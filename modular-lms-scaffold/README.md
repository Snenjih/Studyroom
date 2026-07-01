# Studyroom

Self-hosted, modular learning platform built with Next.js, Postgres, Redis and MinIO.

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2

### Setup

```bash
# 1. Copy environment file
cp .env.example .env.local

# 2. Start all services
docker compose up
```

The app is available at **http://localhost:3000**.  
MinIO web UI (file storage) is at **http://localhost:9001**.

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

| Service  | Image               | Purpose                       |
|----------|---------------------|-------------------------------|
| app      | (local build)       | Next.js application           |
| postgres | postgres:16-alpine  | Primary database              |
| redis    | redis:7-alpine      | Sessions / cache / job queue  |
| minio    | minio/minio:latest  | S3-compatible file storage    |
