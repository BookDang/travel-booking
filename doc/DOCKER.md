# Docker (Dev)

The dev environment has 3 services: **nginx** (reverse proxy), **mysql** (database), and **api** (NestJS, in the `api/` folder).

## Structure

```
.docker/
  nginx/nginx.conf       # reverse proxy -> api:3000
  node/Dockerfile.dev     # dev image for NestJS (hot reload)
  mysql/init/             # DB init scripts (run on first mysql container init)
docker-compose.yml
dev.sh                    # helper script: local domain setup + start/stop docker
.env.example               # copy to .env before running
```

## Requirements

- Docker Desktop running.
- Git Bash running **as Administrator** (so `dev.sh` can edit the hosts file).

## First run

```bash
./dev.sh up
```

The script will:
1. Copy `.env.example` → `.env` if it doesn't exist.
2. Add `127.0.0.1 travel-booking.com` to the hosts file (`C:\Windows\System32\drivers\etc\hosts`) if missing.
3. Run `docker compose up --build`.

Once it's up, visit: **http://travel-booking.com**

If not run as Administrator, the script will report the failure and print the line to add manually.

## Stop

```bash
./dev.sh down
```

This runs `docker compose down` **and removes** the domain entry from the hosts file, so nothing unnecessary is left behind on your machine.

## Other commands

| Task | Command |
|---|---|
| Tail logs for all services | `docker compose logs -f` |
| Tail logs for api only | `docker compose logs -f api` |
| Shell into the api container | `docker compose exec api sh` |
| Open a mysql client | `docker compose exec mysql mysql -u root -p` |
| Check nginx config syntax | `docker compose exec nginx nginx -t` |
| Reload nginx after editing `nginx.conf` | `docker compose exec nginx nginx -s reload` |
| Fully restart the nginx container | `docker compose restart nginx` |

`nginx.conf` is mounted as a volume, so edits on the host are visible in the container immediately — reload is enough, no rebuild needed.

## Ports (overridable via `.env`)

| Variable | Default | Meaning |
|---|---|---|
| `NGINX_PORT` | `80` | Host port mapped to nginx |
| `APP_PORT` | `3000` | Host port mapped directly to NestJS |
| `MYSQL_PORT` | `3306` | Host port mapped to MySQL |

## Troubleshooting

- **Port 80 already in use** (commonly IIS / World Wide Web Publishing Service on Windows): stop that service, or change `NGINX_PORT` in `.env` and visit `http://travel-booking.com:<port>`.
- **Can't edit the hosts file**: reopen Git Bash via "Run as administrator" and run `./dev.sh up` again.
- **api isn't hot-reloading**: check `docker compose logs -f api` — the container runs `npm run start:dev`; if `node_modules` inside the container is out of sync, run `docker compose up --build` again.
