# DDD Layering (api/)

Every business module under `api/src/**` (e.g. `admin/tours/`) is split into 4 layers.
Each layer has one job and a strict rule about what it's allowed to depend on.

## The dependency direction

```
presentation/  ─▶  application/  ─▶  domain/  ◀─  infrastructure/
   (HTTP)           (use-cases)      (core)         (Prisma, etc.)
```

- Arrows point from "depends on" to "depended on".
- `domain/` depends on **nothing** in this module. Everything else depends on it.
- `infrastructure/` doesn't get depended on by anyone — it *implements* interfaces that
  `domain/` declares (Dependency Inversion), so the arrow points **into** `domain/`, not out of it.

Rule of thumb: if you deleted `nestjs` and `@prisma/client` from `node_modules`, everything
inside `domain/` should still type-check. If it doesn't, something leaked in that shouldn't have.

## Which layer does new code belong in?

A quick decision tree for classifying one piece of code at a time (a function, a class, a
single check) — not a whole feature, since most features touch all 4 layers at once.

```
New code
  │
  ▼
Is it a business rule?
  │
  ├── Yes
  │     │
  │     ▼
  │  domain
  │
  └── No
       │
       ▼
Is it a workflow?
       │
       ├── Yes
       │     │
       │     ▼
       │  application
       │
       └── No
            │
            ▼
Does it depend on technology?
            │
            ├── Yes
            │     │
            │     ▼
            │  infrastructure
            │
            └── No
                 │
                 ▼
Is it request/response data?
                 │
                 ▼
             presentation
```

## What lives in each layer

### `domain/` — the business core

Pure business rules. No framework imports, no HTTP, no database.

| Folder | Answers | Example (`admin/tours/`) |
|---|---|---|
| `entities/` | What is a Tour, and what keeps it valid? | `Tour` — factory methods (`create`, `reconstitute`), behavior (`publish()`, `pause()`), invariants |
| `enums/` | What values is a concept allowed to take? | `TourStatus`, `TourType` |
| `errors/` | What goes wrong, in business terms? | `InvalidTourDetailsError`, `InvalidTourStateTransitionError` |
| `repositories/` | What can be done to fetch/persist an entity? (contract only, no implementation) | `TourRepository` — an `interface`, plus the `TOUR_REPOSITORY` DI token |

### `application/` — orchestration

One use-case per business action. A use-case coordinates entities and repositories to fulfil
a single request; it holds no business rules of its own (those live on the entity).

| Folder | Example |
|---|---|
| `use-cases/` | `CreateTourUseCase`, `PublishTourUseCase`, `UpdateTourUseCase`, ... |

A typical use-case: load the entity via the repository interface, call a behavior method on it,
save it back.

```ts
async execute(id: string): Promise<Tour> {
  const tour = await this.tourRepository.findOne(id);
  if (!tour) throw new NotFoundException(...);
  tour.publish();               // business rule lives on the entity, not here
  return this.tourRepository.update(tour);
}
```

### `infrastructure/` — technical implementation

Where `domain/` interfaces meet real technology.

| Folder | Example |
|---|---|
| `repositories/` | `PrismaTourRepository implements TourRepository` |
| `mappers/` | `TourMapper` — converts between `Tour` (domain) and the flat shape used for persistence |

`infrastructure/` is the only layer allowed to know about Prisma. Swapping databases means
rewriting this layer only.

### `presentation/` — HTTP boundary

Translates HTTP in and out. **Never contains business logic.** If you're about to write a check
about what makes a Tour valid, or a state transition, stop — that belongs in `domain/entities`.

| Folder | Purpose | Must NOT contain |
|---|---|---|
| `controllers/` | One method per endpoint: extract params/body, call exactly one use-case, return its result. | Business rules, direct repository/entity manipulation, try/catch for domain errors (that's `filters/`'s job) |
| `dto/` | Shape + *syntactic* validation of an incoming request (`class-validator`): types, required/optional, format. | Business validation — e.g. "a tour can't be published twice" is an entity invariant, not a DTO rule |
| `validators/` | Custom `class-validator` decorators reused across DTOs (e.g. `@IsSlug()`). | Anything needing a DB lookup or another entity — stays purely syntactic |
| `presenters/` | Transform a domain entity into the exact JSON shape returned to the client: hide internal fields, rename, format dates. | Fetching data, calling repositories, business decisions |
| `filters/` | `@Catch()` exception filters. Map thrown errors (mainly `domain/errors/`) to an HTTP status + response body. The **only** place that decides "which domain error → which HTTP status." | Deciding validity itself — filters translate, they don't judge |
| `pipes/` | `PipeTransform` classes that coerce/validate a single param before it reaches the controller (e.g. parsing a UUID param). | Business rules, DB lookups |
| `interceptors/` | Cross-cutting request/response wrapping: logging, response envelope, timeout, caching. | Business logic |
| `guards/` | Authentication/authorization only: "is this caller allowed to call this endpoint at all?" | "Is this operation valid" — that's a domain invariant, not a guard's job |
| `decorators/` | Custom param decorators, e.g. `@CurrentUser()` pulling the authenticated user out of the request. | Anything beyond extracting/shaping request data |

#### Presentation boundary rule

Before writing code in `presentation/`, ask: **does this decide whether the data is valid, or
does it just move/format/gate the request?**

- Deciding validity of the *data* (state transition, business invariant) → `domain/entities`.
- Deciding whether the *caller* may proceed at all (auth) → `guards/`.
- Deciding the *shape* of what comes in or out, not its meaning → `dto/`, `validators/`, `pipes/`, `presenters/`.
- Deciding what an error *means* to an HTTP client → `filters/`.

If none of these fit and you're tempted to add an `if` that checks business meaning inside a
controller, pipe, guard, or interceptor — that check belongs on the entity instead.

### Wiring: `<module>.module.ts`

Sits outside the 4 layers. Registers the controller and use-cases as providers, and binds the
`TOUR_REPOSITORY` token to `PrismaTourRepository`. This is the one place that "knows" every layer.

## Why split it this way

- **Business rules survive infrastructure change.** Swap Prisma for another ORM, or REST for
  GraphQL, and `domain/` (the part encoding what a Tour *is* and *can do*) doesn't change.
- **Rules live in one place.** Because entities enforce their own invariants (e.g. "only a
  published tour can be paused"), no use-case can accidentally skip a check by mutating fields
  directly — there are no public setters to bypass.
- **Errors carry business meaning, not HTTP meaning.** `domain/errors/` throws
  `InvalidTourStateTransitionError`; `presentation/filters/` is the only place that decides that
  means `409 Conflict`. Domain code never mentions HTTP status codes.

## Project-wide conventions that apply here

- Cross-folder imports use the `@/` alias (e.g. `@/admin/tours/domain/entities`), never `../`.
- Every folder gets an `index.ts` barrel, except the 4 top-level layer folders themselves.

See `CLAUDE.md` for the full rules.
