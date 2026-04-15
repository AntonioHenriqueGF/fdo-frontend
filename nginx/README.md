# Nginx Configuration

This directory contains the Nginx configuration for different project environments, following a professional approach based on separation of concerns.

---

## 📁 Structure

```
nginx/
├─ nginx.conf
├─ conf.d/
│  ├─ dev.conf
├─ templates/
│  └─ prod.conf.template
```

---

## 🧠 General Concept

The configuration is divided into:

* **Global configuration** → `nginx.conf`
* **Environment-specific configuration** → `dev` and `prod`
* **Dynamic template** → used in production with environment variables

---

## ⚙️ nginx.conf (Global Configuration)

Base Nginx file.

Responsible for:

* defining workers
* configuring `events`
* configuring `http`
* including server configuration files

Example:

```
include /etc/nginx/conf.d/*.conf;
```

👉 This file **does not contain `server {}` blocks**.

---

## 🟢 Development Environment (dev.conf)

Location:

```
nginx/conf.d/dev.conf
```

Characteristics:

* Uses only HTTP (port 80)
* No HTTPS
* No redirection
* Direct proxy to the API

Purpose:

* Simplicity
* Ease of local development
* Avoid complexity with certificates

---

## 🔴 Production Environment (prod.conf.template)

Location:

```
nginx/templates/prod.conf.template
```

Characteristics:

* Uses HTTP (port 80) + HTTPS (port 443)
* Redirects HTTP → HTTPS
* Uses SSL certificates
* Uses environment variable: `${NGINX_SERVER_NAME}`

---

## 🔄 Template Usage

In production, we use Docker’s template mechanism:

```
/etc/nginx/templates/*.template
```

The Nginx container:

1. Processes `.template` files
2. Replaces environment variables (envsubst)
3. Generates final files in:

```
/etc/nginx/conf.d/
```

---

## 🔐 HTTPS and Certbot

The production configuration includes support for certificates generated via Certbot.

### Webroot used:

```
/var/www/certbot
```

### HTTP challenge:

```
/.well-known/acme-challenge/
```

This path is required for domain validation.

---

## 🚀 HTTPS Activation Flow

1. Start Nginx with HTTP only
2. Validate access to the webroot
3. Generate certificate with Certbot
4. Enable HTTPS configuration
5. Restart Nginx

---

## 🔁 Automatic Renewal

Certificate renewal is handled via cron:

```
certbot renew
```

After renewal, Nginx must be reloaded:

```
nginx -s reload
```

---

## 🧩 Environment Separation

| Environment | File                           | Characteristics  |
| ----------- | ------------------------------ | ---------------- |
| Dev         | `conf.d/dev.conf`              | Simple HTTP      |
| Prod        | `templates/prod.conf.template` | HTTPS + redirect |

---

## 🎯 Benefits of this Architecture

* Clear separation of environments
* Reusable Nginx container
* Declarative configuration
* Easy maintenance
* Scalable for multiple domains

---

## 💡 Notes

* Environment variables do not work directly in `.conf` files
* Use `.template` files to allow substitution via `envsubst`
* Avoid duplicating Dockerfiles

---

## 📌 Conclusion

This structure follows modern infrastructure best practices, enabling:

* simple development
* secure deployment
* easy replication for other projects

