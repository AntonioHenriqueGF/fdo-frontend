# Nginx Configuration

Este diretório contém a configuração do Nginx para diferentes ambientes do projeto, seguindo uma abordagem profissional baseada em separação de responsabilidades.

---

## 📁 Estrutura

```
nginx/
├─ nginx.conf
├─ conf.d/
│  ├─ dev.conf
├─ templates/
│  └─ prod.conf.template
```

---

## 🧠 Conceito geral

A configuração foi separada em:

* **Configuração global** → `nginx.conf`
* **Configuração por ambiente** → `dev` e `prod`
* **Template dinâmico** → usado em produção com variáveis de ambiente

---

## ⚙️ nginx.conf (Configuração Global)

Arquivo base do Nginx.

Responsável por:

* definir workers
* configurar `events`
* configurar `http`
* incluir os arquivos de configuração de servidores

Exemplo:

```
include /etc/nginx/conf.d/*.conf;
```

👉 Este arquivo **não contém blocos `server {}`**.

---

## 🟢 Ambiente de Desenvolvimento (dev.conf)

Localização:

```
nginx/conf.d/dev.conf
```

Características:

* Usa apenas HTTP (porta 80)
* Sem HTTPS
* Sem redirecionamento
* Proxy direto para a API

Objetivo:

* Simplicidade
* Facilidade de desenvolvimento local
* Evitar complexidade com certificados

---

## 🔴 Ambiente de Produção (prod.conf.template)

Localização:

```
nginx/templates/prod.conf.template
```

Características:

* Usa HTTP (porta 80) + HTTPS (porta 443)
* Redireciona HTTP → HTTPS
* Utiliza certificados SSL
* Usa variável de ambiente: `${NGINX_SERVER_NAME}`

---

## 🔄 Uso de Templates

Em produção, utilizamos o mecanismo de template do Docker:

```
/etc/nginx/templates/*.template
```

O container do Nginx:

1. Processa os arquivos `.template`
2. Substitui variáveis de ambiente (envsubst)
3. Gera arquivos finais em:

```
/etc/nginx/conf.d/
```

---

## 🔐 HTTPS e Certbot

A configuração de produção inclui suporte a certificados gerados via Certbot.

### Webroot utilizado:

```
/var/www/certbot
```

### Desafio HTTP:

```
/.well-known/acme-challenge/
```

Este caminho é necessário para validação do domínio.

---

## 🚀 Fluxo de ativação do HTTPS

1. Subir Nginx apenas com HTTP
2. Validar acesso ao webroot
3. Gerar certificado com Certbot
4. Ativar configuração HTTPS
5. Reiniciar Nginx

---

## 🔁 Renovação automática

A renovação do certificado é feita via cron:

```
certbot renew
```

Após renovação, o Nginx deve ser recarregado:

```
nginx -s reload
```

---

## 🧩 Separação por ambiente

| Ambiente | Arquivo                        | Características  |
| -------- | ------------------------------ | ---------------- |
| Dev      | `conf.d/dev.conf`              | HTTP simples     |
| Prod     | `templates/prod.conf.template` | HTTPS + redirect |

---

## 🎯 Benefícios desta arquitetura

* Separação clara de ambientes
* Reutilização do container Nginx
* Configuração declarativa
* Fácil manutenção
* Escalável para múltiplos domínios

---

## 💡 Observações

* Variáveis de ambiente não funcionam diretamente em arquivos `.conf`
* Devemos usar `.template` para permitir substituição via `envsubst`
* Evitar duplicação de Dockerfiles

---

## 📌 Conclusão

Esta estrutura segue boas práticas de infraestrutura moderna, permitindo:

* desenvolvimento simples
* deploy seguro
* fácil replicação para outros projetos

```
```
