
# RealWorld monorepo

Implementation of [gothinkster/realworld](https://github.com/gothinkster/realworld) with a monorepo


## Tech Stack

**Client:** React, TanStack, shadcn/ui

**Server:** Node, Fastify, OpenAPI

**Database:** PostgreSQL, [golang-migrate](https://github.com/golang-migrate/migrate), IntegreSQL


## Installation

Clone the repository

```bash
git clone https://github.com/leosuncin/conduit-monorepo.git
cd conduit-monorepo
```

Install the dependencies


```bash
pnpm install
```

Run the services

```bash
docker compose up --watch
```
