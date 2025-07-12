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
RUN yarn workspace @aipackr/api build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/package.json ./package.json
COPY --from=builder /app/packages/types/dist ./node_modules/@aipackr/types/dist
COPY --from=builder /app/packages/types/package.json ./node_modules/@aipackr/types/package.json

USER nestjs

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/main.js"]