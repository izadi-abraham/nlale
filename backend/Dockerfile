FROM oven/bun:1-alpine AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/gallery.db
ENV UPLOADS_DIR=/data/uploads

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
