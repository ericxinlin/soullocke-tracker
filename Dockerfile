FROM node:23-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
COPY . .

RUN npm run build


FROM caddy:2.9.1-alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80