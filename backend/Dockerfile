FROM rust:1.86-slim-bullseye AS builder
WORKDIR /app
COPY . .
RUN cargo build --release


FROM debian:bullseye-slim
RUN apt-get update \
    && apt-get install -y libssl1.1 ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/backend .

EXPOSE 8000
CMD ["./backend"]