# Project Name: Docker VPS Template

A template for setting up a local development environment and production deployment using Docker, Nginx, and Go. This project is designed to provide a scalable and secure API with best practices in mind.

---

## 🚀 Usage Instructions

### 1. **Prerequisites**
Make sure you have the following software installed:
- Docker and Docker Compose

### 2. **Environment Configuration**
1. Copy the `example.env` file to `.env` and configure the necessary environment variables.

Note: It is not necessary to manually run the migrations, as the `migrations` service in `docker-compose.yml` is configured to automatically apply migrations when starting the environment.

### 3. **Starting the Development Environment**
Run the following command to start the local environment:
```bash
docker-compose up -d --build
```
This will start the services defined in `docker-compose.override.yml`, including the API and Nginx.

### 4. **Configuring SSL in Production**
To configure SSL in production, you need to modify the `nginx/templates/prod.conf.template` file to have only HTTP (port 80) and configure Certbot to generate SSL certificates without redirecting HTTP to HTTPS. Follow the example in `nginx/conf.d/prod.conf.gen-cert`. Then run:
```bash
mkdir -p certbot/www/.well-known/acme-challenge
```

When running the command below, make sure to replace `your-domain.com` and `your@email.com` with the correct values. The command will generate the SSL certificate using the HTTP validation method, where Certbot will create a challenge file in the specified directory to prove domain ownership.

```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.prod.yml \
run --rm certbot certonly \
--webroot \
--webroot-path=/var/www/certbot \
-d your-domain.com \
--email your@email.com \
--agree-tos \
--no-eff-email
```

After generating the certificate, configure the server's Cron to automatically renew the certificate by running the following command:
```bash
crontab -e
```
Then add the following line to renew the certificate daily, replacing `/path` with the absolute path to your project. This command will renew the certificate and reload Nginx to apply the changes:

```bash
0 6 * * * docker compose -f /path/docker-compose.yml -f /path/docker-compose.prod.yml run --rm certbot renew && docker compose -f /path/docker-compose.yml -f /path/docker-compose.prod.yml exec nginx nginx -s reload
```

Note: The cron time is in UTC, so adjust the time as needed to ensure the renewal occurs at a convenient time. In this case, the cron is set to run daily at 6:00 UTC, which is equivalent to 3:00 AM Brasília time (BRT), a time of low traffic in Brazil.

### 5. **Production Deployment**
1. Configure the environment variables in the `.env` file.
2. Use the `docker-compose.yml` and `docker-compose.prod.yml` files to start the services:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## 🛠️ Maintenance
- To apply database migrations, use the scripts in `db/migrations/`.

---

## 📌 Conclusion
This project was developed with a focus on scalability and best practices, using Go, Docker, and Nginx to provide a robust and secure API.