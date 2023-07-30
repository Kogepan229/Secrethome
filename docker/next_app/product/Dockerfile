FROM node:20-alpine as builder

RUN apk add --no-cache libc6-compat
WORKDIR /next_app

COPY ./next_app/ ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN npm run build


FROM gcr.io/distroless/nodejs20-debian11 as runner
ENV NODE_ENV=production
WORKDIR /next_app

COPY --from=builder /next_app/public ./public
COPY --from=builder /next_app/.next/standalone ./
COPY --from=builder /next_app/.next/static ./.next/static

ENV PORT 3000
