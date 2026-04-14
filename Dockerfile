# Use the official Node.js 20 image as the base (updated for better Next.js 15 support)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Use BuildKit cache mount for npm cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci --frozen-lockfile --prefer-offline --no-audit

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build environment (NO SECRETS HERE - they're injected at runtime via env_file)
ENV NODE_ENV=production

# Generate Prisma client with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npx prisma generate

# Build the application with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install utilities (as root) - needed for health checks
RUN apk add --no-cache curl

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules ./node_modules

# Copy entrypoint
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh

# Note: Cron jobs are managed by host system, not container
# See host crontab for scheduled tasks

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use custom entrypoint that runs migrations
ENTRYPOINT ["./docker/entrypoint.sh"]
