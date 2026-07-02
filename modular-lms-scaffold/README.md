# Studyroom

Self-hosted, modular learning platform built with Next.js, Postgres, Redis and MinIO.

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2

### Quickstart (prebuilt images)

Pulls the published `app`/`db-init` images from GHCR instead of building locally — fastest way to get running:

```bash
# 1. Copy environment file
cp .env.example .env.local

# 2. Start all services (pulls images from ghcr.io/snenjih/studyroom)
docker compose up
```

The app is available at **http://localhost:3000**.  
MinIO web UI (file storage) is at **http://localhost:9001**.

Pin a specific release instead of `latest` (image tags drop the `v` prefix that git tags use):

```bash
IMAGE_TAG=1.2.3 docker compose up
```

### Setup (build from source)

Force a local build instead of pulling (useful when you've changed application code):

```bash
cp .env.example .env.local
docker compose up --build
```

### Development (hot-reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This mounts the source directory into the container and runs `npm run dev` with hot-reload. Postgres and Redis ports are also exposed locally (5432 / 6379) for use with database clients.

### Stop & clean up

```bash
# Stop containers, keep volumes
docker compose down

# Stop and delete all data volumes
docker compose down -v
```

## Stack

| Service  | Image                                | Purpose                      |
| -------- | ------------------------------------ | ---------------------------- |
| app      | `ghcr.io/snenjih/studyroom`          | Next.js application          |
| db-init  | `ghcr.io/snenjih/studyroom-migrator` | Runs migrations + seed once  |
| postgres | postgres:16-alpine                   | Primary database             |
| redis    | redis:7-alpine                       | Sessions / cache / job queue |
| minio    | minio/minio:latest                   | S3-compatible file storage   |

## Releases

Pushing a tag matching `v*.*.*` triggers the [Release workflow](.github/workflows/release.yml), which:

1. Builds and pushes the `app` and `db-init` (migrator) images to [GHCR](https://github.com/Snenjih/Studyroom/pkgs/container/studyroom), tagged with the exact version (`1.2.3`, no `v` prefix), the minor (`1.2`) and major (`1`) lines, and `latest`.
2. Creates a [GitHub Release](https://github.com/Snenjih/Studyroom/releases) for the tag with an auto-generated changelog from the commits/PRs since the previous release.

Cutting a release:

```bash
git tag v1.2.3
git push origin v1.2.3
```
