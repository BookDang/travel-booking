import { randomUUID } from 'node:crypto';
import { TourStatus, TourType } from '@/admin/tours/domain/enums';
import {
  InvalidTourDetailsError,
  InvalidTourStateTransitionError,
} from '@/admin/tours/domain/errors';

const DIACRITIC_MARKS = /[\u0300-\u036f]/g;

interface TourDetails {
  name: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  type: TourType;
  durationDays: number;
  durationNights: number;
}

export interface TourCreateProps extends TourDetails {
  code: string;
}

export interface TourUpdateProps
  extends Partial<Omit<TourDetails, 'shortDescription' | 'description' | 'categoryId'>> {
  shortDescription?: string | null;
  description?: string | null;
  categoryId?: string | null;
}

export interface TourPersistenceProps extends TourCreateProps {
  id: string;
  slug: string;
  status: TourStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface TourCreateOptions {
  /** Overrides the generated id. Mainly for tests that need a deterministic id. */
  id?: string;
  /** Overrides the system clock. Mainly for tests that need a deterministic timestamp. */
  now?: Date;
}

export class Tour {
  readonly id: string;
  readonly code: string;

  private _name: string;
  private _slug: string;
  private _shortDescription?: string;
  private _description?: string;
  private _categoryId?: string;
  private _type: TourType;
  private _durationDays: number;
  private _durationNights: number;
  private _status: TourStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _publishedAt?: Date;

  private constructor(props: TourPersistenceProps) {
    this.id = props.id;
    this.code = props.code;
    this._name = props.name;
    this._slug = props.slug;
    this._shortDescription = props.shortDescription;
    this._description = props.description;
    this._categoryId = props.categoryId;
    this._type = props.type;
    this._durationDays = props.durationDays;
    this._durationNights = props.durationNights;
    this._status = props.status;
    this._createdAt = new Date(props.createdAt);
    this._updatedAt = new Date(props.updatedAt);
    this._publishedAt = props.publishedAt ? new Date(props.publishedAt) : undefined;
  }

  /** Creates a brand-new tour, always starting life as a DRAFT. */
  static create(props: TourCreateProps, options: TourCreateOptions = {}): Tour {
    Tour.assertValidDetails(props);
    const now = options.now ?? new Date();
    return new Tour({
      id: options.id ?? randomUUID(),
      code: props.code,
      name: props.name,
      slug: Tour.slugify(props.name),
      shortDescription: props.shortDescription,
      description: props.description,
      categoryId: props.categoryId,
      type: props.type,
      durationDays: props.durationDays,
      durationNights: props.durationNights,
      status: TourStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Rehydrates a tour already stored in the database. No invariants re-derived, only trusted. */
  static reconstitute(props: TourPersistenceProps): Tour {
    return new Tour(props);
  }

  private static assertValidDetails(props: {
    name: string;
    durationDays: number;
    durationNights: number;
  }): void {
    if (!props.name.trim()) {
      throw new InvalidTourDetailsError('Tour name must not be empty');
    }
    if (props.durationDays < 1) {
      throw new InvalidTourDetailsError('durationDays must be at least 1');
    }
    if (props.durationNights < 0) {
      throw new InvalidTourDetailsError('durationNights must not be negative');
    }
  }

  private static slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(DIACRITIC_MARKS, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get shortDescription(): string | undefined {
    return this._shortDescription;
  }

  get description(): string | undefined {
    return this._description;
  }

  get categoryId(): string | undefined {
    return this._categoryId;
  }

  get type(): TourType {
    return this._type;
  }

  get durationDays(): number {
    return this._durationDays;
  }

  get durationNights(): number {
    return this._durationNights;
  }

  get status(): TourStatus {
    return this._status;
  }

  /** Returns a defensive copy — mutating the result cannot corrupt the entity's internal state. */
  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  get publishedAt(): Date | undefined {
    return this._publishedAt ? new Date(this._publishedAt) : undefined;
  }

  /**
   * Updates editable details. `code` is a fixed identifier and cannot change after creation.
   * For the nullable fields, `undefined` means "leave unchanged" and `null` means "clear it".
   */
  updateDetails(props: TourUpdateProps, now: Date = new Date()): void {
    if (this._status === TourStatus.ARCHIVED) {
      throw new InvalidTourStateTransitionError('Cannot update an archived tour');
    }
    Tour.assertValidDetails({
      name: props.name ?? this._name,
      durationDays: props.durationDays ?? this._durationDays,
      durationNights: props.durationNights ?? this._durationNights,
    });

    if (props.name !== undefined) {
      this._name = props.name;
      this._slug = Tour.slugify(props.name);
    }
    if (props.shortDescription !== undefined)
      this._shortDescription = props.shortDescription ?? undefined;
    if (props.description !== undefined) this._description = props.description ?? undefined;
    if (props.categoryId !== undefined) this._categoryId = props.categoryId ?? undefined;
    if (props.type !== undefined) this._type = props.type;
    if (props.durationDays !== undefined) this._durationDays = props.durationDays;
    if (props.durationNights !== undefined) this._durationNights = props.durationNights;
    this._updatedAt = now;
  }

  publish(now: Date = new Date()): void {
    if (this._status === TourStatus.PUBLISHED) {
      throw new InvalidTourStateTransitionError('Tour is already published');
    }
    if (this._status === TourStatus.ARCHIVED) {
      throw new InvalidTourStateTransitionError('Cannot publish an archived tour');
    }
    this._status = TourStatus.PUBLISHED;
    this._publishedAt = now;
    this._updatedAt = now;
  }

  pause(now: Date = new Date()): void {
    if (this._status !== TourStatus.PUBLISHED) {
      throw new InvalidTourStateTransitionError('Only a published tour can be paused');
    }
    this._status = TourStatus.PAUSED;
    this._updatedAt = now;
  }

  archive(now: Date = new Date()): void {
    if (this._status === TourStatus.ARCHIVED) {
      throw new InvalidTourStateTransitionError('Tour is already archived');
    }
    this._status = TourStatus.ARCHIVED;
    this._updatedAt = now;
  }
}
