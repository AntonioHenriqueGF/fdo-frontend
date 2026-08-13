# FDO Frontend (Financial Data Overview)

Aplicacao frontend em React + TypeScript para visualizacao e gestao de dados financeiros pessoais.

Este repositorio contem o cliente web (Vite), com autenticacao, importacao de arquivo CSV, cadastro de categorias/regras, CRUD de transacoes e saldos diarios, e paineis graficos.

Importante: este repositorio nao contem a API backend. O frontend depende de uma API externa configurada por variavel de ambiente.

## Stack atual

- React 19 + TypeScript
- Vite 8
- Material UI (MUI) + MUI X Charts + MUI Data Grid
- Jotai (estado local)
- Axios (com cookies e XSRF)
- Notistack (feedback visual)
- Laravel Echo + Pusher JS (notificacoes de jobs em tempo real)
- Docker + Nginx para empacotamento/deploy do frontend

## O que o projeto implementa hoje

### 1) Autenticacao

- Tela de login em `/login`
- Tela de cadastro em `/signin`
- Fluxo com obtencao de cookie CSRF (`/sanctum/csrf-cookie`) antes de login/cadastro
- Guardas de rota:
  - Usuario autenticado: acesso ao dashboard
  - Usuario nao autenticado: acesso apenas a login/cadastro

### 2) Importacao de dados

- Importacao de arquivo CSV (nao XLSX)
- Leitura do arquivo via `react-papaparse`
- Preview das linhas
- Definicao manual de:
  - linha de cabecalho
  - linha inicial de dados
  - mapeamento de colunas por tipo
- Tipos de coluna suportados:
  - Date (MM/DD/YYYY)
  - Date (DD/MM/YYYY)
  - Date (YYYY-MM-DD)
  - Description
  - Amount (single credit/debit)
  - Credit Only
  - Debit Only
  - Closing Balance
  - Ignore
- Normalizacao no frontend antes de enviar para a API
- Envio para endpoint de importacao (`/api/import`)
- Listagem e exclusao de imports existentes

### 3) Categorias e regras

- CRUD de categorias
- Marcacao de categoria como receita (`cat_is_income`)
- CRUD de regras por categoria (pattern + priority)
- Acao para solicitar reprocessamento de regras (`/api/reprocess-rules`)

### 4) Transacoes

- Listagem paginada
- Filtros por categoria e intervalo de datas
- CRUD completo (criar, editar, excluir)

### 5) Saldos diarios

- Listagem paginada
- Filtro por intervalo de datas
- CRUD completo (criar, editar, excluir)

### 6) Dashboard e visualizacoes

- Grafico de reconciliacao diaria: saldo diario x total diario de transacoes
- Grafico de barras por dia e categoria
- Grafico de pizza com totais por categoria
- Filtros por categorias no painel de categorias

### 7) Notificacoes de jobs

- Provider global de notificacoes para usuario autenticado
- Integracao com Laravel Echo/Reverb em canal privado por usuario
- Sincronizacao de jobs pendentes salvos em `localStorage`
- Toasts de status: iniciado, concluido e falha

## Rotas principais

- Publicas:
  - `/login`
  - `/signin`
- Protegidas:
  - `/dashboard`
  - `/dashboard/statement-import`
  - `/dashboard/categories`
  - `/dashboard/transactions`
  - `/dashboard/daily-balances`

## Dependencias de ambiente

O frontend precisa das variaveis de ambiente usadas pela API e pelo realtime:

- `VITE_BACKEND_URL`
- `VITE_REVERB_APP_KEY`
- `VITE_REVERB_HOST`
- `VITE_REVERB_PORT`
- `VITE_REVERB_SCHEME`

## Como rodar

### Desenvolvimento local (Node)

1. Instale dependencias:

```bash
npm install
```

2. Configure `.env` com as variaveis necessarias.

3. Rode em modo dev:

```bash
npm run dev
```

### Build local

```bash
npm run build
npm run preview
```

### Docker (frontend)

- Desenvolvimento (Dockerfile.dev + compose override):

```bash
docker compose up -d --build
```

- Producao (build estatico + Nginx):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Observacao: os arquivos de compose deste repositorio definem principalmente servicos de frontend e certbot. API e banco sao dependencias externas deste repositorio.

## Escopo planejado x implementacao real

Com base no documento de escopo, estes sao os pontos mais relevantes comparando plano e implementacao atual do frontend:

1. Importacao de arquivo:

- Planejado: XLSX/CSV.
- Atual: CSV apenas.

2. Visualizacoes de dashboard:

- Planejado: foco em recortes mensais (receita/despesa por mes, etc.).
- Atual: foco principal em recortes diarios e totais por categoria no periodo filtrado.

3. Filtro de categoria no dashboard:

- Planejado: nenhuma ou uma categoria por vez.
- Atual: formulario aceita selecao de multiplas categorias.

4. Arquitetura completa (frontend + backend + banco):

- Planejado: demonstracao completa.
- Atual neste repositorio: frontend completo, integrado por API; backend e banco nao estao implementados aqui.

5. Seguranca e autenticacao:

- Planejado: autenticacao com protecao dos dados por usuario.
- Atual no frontend: fluxo com cookie CSRF, envio com credenciais e rotas protegidas; a garantia final de isolamento dos dados depende do backend.

## Observacoes finais

- O README anterior descrevia um template generico com Go/API no mesmo repositorio; isso nao representa o estado atual deste projeto.
- Este README foi ajustado para documentar o sistema que realmente existe hoje no frontend.
