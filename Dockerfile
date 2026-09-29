# syntax=docker/dockerfile:1

# ---- Build: statically export the Next.js app into out/ -------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build \
  # Everything served must be world-readable.
  && chmod -R a+rX out

# ---- Serve: static files from Caddy (headers, caching, compression in docker/Caddyfile) --------
FROM caddy:2-alpine
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/out /srv

EXPOSE 32774
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:32774/ || exit 1
