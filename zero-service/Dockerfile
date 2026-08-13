# Zero Clawd service: builds the Zero Go binary, runs the Node SSE bridge.
# Build context MUST be the repo root (so both zero-main/ and zero-service/ are
# available). Render: dockerfilePath=./zero-service/Dockerfile, dockerContext=.

# ── Stage 1: compile the Zero agent binary ──────────────────────────────────
FROM golang:1.26-bookworm AS zerobuild
ENV GOTOOLCHAIN=auto
WORKDIR /src
COPY zero-main/ ./zero-main/
WORKDIR /src/zero-main
RUN go build -o /out/zero ./cmd/zero

# ── Stage 2: Node runtime ───────────────────────────────────────────────────
FROM node:22-bookworm-slim
WORKDIR /app

# Install service deps first (better layer caching).
COPY zero-service/package.json zero-service/package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

# App source + the compiled agent.
COPY zero-service/ ./
COPY --from=zerobuild /out/zero /usr/local/bin/zero

ENV ZERO_BIN=/usr/local/bin/zero \
    ZERO_WORKSPACE=/tmp/zero-clawd-workspace \
    ZERO_MODEL=grok-4.6 \
    PORT=8787
EXPOSE 8787
CMD ["node", "src/server.mjs"]
