# Etapa 1: build da aplicação
FROM golang:1.25 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o app

# Etapa 2: imagem final (menor)
#FROM debian:bullseye-slim
#WORKDIR /root/
#COPY --from=builder /app/app .
EXPOSE 8080
CMD ["./app"]
