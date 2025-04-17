ARG NODE_VERSION=lts-slim

FROM node:${NODE_VERSION} AS dependencies

ENV PNPM_HOME="/var/cache/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /monorepo

RUN --mount=type=cache,id=pnpm-store,target=/var/cache/pnpm/store\
    --mount=type=bind,source=package.json,target=/monorepo/package.json\
    --mount=type=bind,source=pnpm-lock.yaml,target=/monorepo/pnpm-lock.yaml\
    --mount=type=bind,source=pnpm-workspace.yaml,target=/monorepo/pnpm-workspace.yaml\
    corepack enable &&\
    pnpm install --frozen-lockfile --strict-peer-dependencies


FROM dependencies AS pruner

ARG PROJECT

WORKDIR /monorepo

COPY . .

RUN pnpm exec turbo prune --docker ${PROJECT}


FROM dependencies AS builder

ARG PROJECT

WORKDIR /app

COPY --from=pruner /monorepo/out/*.yaml ./
COPY --from=pruner /monorepo/out/json/ .

RUN --mount=type=cache,id=pnpm-store,target=/var/cache/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /monorepo/out/full/ .

RUN --mount=type=cache,id=pnpm-store,target=/var/cache/pnpm/store \
    --mount=type=secret,id=turbo-team,env=TURBO_TEAM \
    --mount=type=secret,id=turbo-token,env=TURBO_TOKEN \
    pnpm run -r --if-present --filter="${PROJECT}^..." prepare && \
    pnpm exec turbo run build --filter=${PROJECT} && \
    pnpm --filter ${PROJECT} --prod deploy out/ && \
    find -type f -name '*.ts' -exec rm -f '{}' \;


FROM gcr.io/distroless/nodejs22-debian12:nonroot AS backend

ARG PROJECT
ARG PORT=3000

ENV NODE_ENV=production
ENV PORT=${PORT}

COPY --from=builder --chown=nonroot:nonroot /app/out ${PROJECT}

WORKDIR /home/nonroot/${PROJECT}

EXPOSE ${PORT}

HEALTHCHECK CMD ["/nodejs/bin/node", "dist/health-check.js"]

CMD ["node_modules/fastify-cli/cli.js", "start", "--log-level", "info", "--address", "0.0.0.0", "dist/app.js"]

FROM devforth/spa-to-http:latest AS frontend

ARG PROJECT

COPY --from=builder /app/apps/${PROJECT}/dist/ .


FROM dependencies AS develop

ARG PROJECT

ENV HUSKY=0
ENV NODE_ENV=development

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json /monorepo/
COPY --chown=node:node ./apps/${PROJECT} /monorepo/apps/${PROJECT}
COPY --chown=node:node ./packages /monorepo/packages
COPY --chown=node:node ./migrations /monorepo/migrations
COPY --from=migrate/migrate /usr/local/bin/migrate /usr/local/bin/migrate

RUN --mount=type=cache,id=pnpm-store,target=/var/cache/pnpm/store\
    pnpm install &&\
    pnpm run -r --if-present prepare
