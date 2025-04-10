FROM rust:1.86-slim-bullseye AS builder
WORKDIR /app

# https://www.reddit.com/r/rust/comments/126xeyx/exploring_the_problem_of_faster_cargo_docker/
# Build dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo fetch
RUN cargo build --release
RUN rm src/main.rs

# Copy the actual code files and build the application
COPY src ./src/
# Update the file date
RUN touch src/main.rs
RUN cargo build --release


FROM debian:bullseye-slim
RUN apt-get update \
    && apt-get install -y libssl1.1 ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/backend .

EXPOSE 8000
CMD ["./backend"]