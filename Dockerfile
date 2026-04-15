# Etapa 1: build da aplicação
FROM node:24.14.1 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: imagem final (menor)
#FROM debian:bullseye-slim
#WORKDIR /root/
#COPY --from=builder /app/app .
EXPOSE 8080
CMD ["npm", "start"]
