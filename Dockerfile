# Use the official Node.js 18 image as the base
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments for Stripe environment variables
ARG STRIPE_SECRET_KEY
ARG STRIPE_STARTER_PRICE_ID
ARG STRIPE_PRO_PRICE_ID
ARG STRIPE_BUSINESS_PRICE_ID
ARG STRIPE_WEBHOOK_SECRET

# Set environment variables for build
ENV NODE_ENV=production
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_STARTER_PRICE_ID=$STRIPE_STARTER_PRICE_ID
ENV STRIPE_PRO_PRICE_ID=$STRIPE_PRO_PRICE_ID
ENV STRIPE_BUSINESS_PRICE_ID=$STRIPE_BUSINESS_PRICE_ID
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install utilities (as root)
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
