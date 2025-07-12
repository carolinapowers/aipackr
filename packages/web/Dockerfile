FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.3.1 --activate

FROM base AS deps

COPY . .

RUN yarn install --immutable --inline-builds

FROM base AS builder

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn workspace @aipackr/types build
RUN yarn workspace @aipackr/web build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/packages/web/.next/standalone ./
COPY --from=builder /app/packages/web/.next/static ./packages/web/.next/static
COPY --from=builder /app/packages/web/public ./packages/web/public

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "packages/web/server.js"]