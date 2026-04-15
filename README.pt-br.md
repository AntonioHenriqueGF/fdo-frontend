# Nome do Projeto: Docker VPS Template

Um template para configurar um ambiente de desenvolvimento local e deploy em produção utilizando Docker, Nginx e Go. Este projeto foi desenvolvido para fornecer uma API escalável e segura, seguindo as melhores práticas.

---

## 🚀 Instruções de Uso

### 1. **Pré-requisitos**
Certifique-se de ter os seguintes softwares instalados:
- Docker e Docker Compose

### 2. **Configuração do Ambiente**
1. Copie o arquivo `example.env` para `.env` e configure as variáveis de ambiente necessárias.

Obs: Não é necessário rodar manualmente as migrações, pois o serviço `migrations` no `docker-compose.yml` está configurado para aplicar as migrações automaticamente ao iniciar o ambiente.

### 3. **Subindo o Ambiente de Desenvolvimento**
Execute o seguinte comando para iniciar o ambiente local:
```bash
docker-compose up -d --build
```
Isso irá iniciar os serviços definidos no `docker-compose.override.yml`, incluindo a API e o Nginx.

### 4. **Configurando SSL em produção**
Para configurar SSL em produção, é preciso alterar o arquivo `nginx/templates/prod.conf.template` para ter apenas HTTP (porta 80) e configurar o Certbot para gerar os certificados SSL, sem redirecionar HTTP para HTTPS. Siga o exemplo em `nginx/conf.d/prod.conf.gen-cert`. Depois rode:
```bash
mkdir -p certbot/www/.well-known/acme-challenge
```

Ao rodar o comando abaixo, sertifique-se de substituir `seu-dominio.com` e `seu@email.com` pelos valores corretos. O comando irá gerar o certificado SSL utilizando o método de validação HTTP, onde o Certbot criará um arquivo de desafio no diretório especificado para comprovar a posse do domínio.

```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.prod.yml \
run --rm certbot certonly \
--webroot \
--webroot-path=/var/www/certbot \
-d seu-dominio.com \
--email seu@email.com \
--agree-tos \
--no-eff-email
```

Depois de gerar o certificado, configure o Cron do servidor para renovar o certificado automaticamente, rodando o seguinte comando:
```bash
crontab -e
```
Depois adicione a seguinte linha para renovar o certificado diariamente, substituindo `/caminho` pelo caminho absoluto para o seu projeto. Este comando irá renovar o certificado e recarregar o Nginx para aplicar as mudanças:

```bash
0 6 * * * docker compose -f /caminho/docker-compose.yml -f /caminho/docker-compose.prod.yml run --rm certbot renew && docker compose -f /caminho/docker-compose.yml -f /caminho/docker-compose.prod.yml exec nginx nginx -s reload
```

Obs: O horário do cron é em UTC, então ajuste o horário conforme necessário para garantir que a renovação ocorra em um horário conveniente. Neste caso, o cron está configurado para rodar diariamente às 6:00 UTC que equivale a 3:00 no horário de Brasília (BRT), horário de pouco tráfego.

### 5. **Deploy em Produção**
1. Configure as variáveis de ambiente no arquivo `.env`.
2. Utilize os arquivos `docker-compose.yml` e `docker-compose.prod.yml` para subir os serviços:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## 🛠️ Manutenção
- Para aplicar migrações no banco de dados, utilize os scripts em `db/migrations/`.

---

## 📌 Conclusão
Este projeto foi desenvolvido com foco em escalabilidade e boas práticas, utilizando Go, Docker e Nginx para fornecer uma API robusta e segura.