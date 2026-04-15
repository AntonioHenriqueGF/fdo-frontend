# Instruções para as Migrations

Para criar uma migration, basta rodar o comando:

```bash
migrate create -ext sql -dir db/migrations -seq descricao_da_operacao
```

As descrições devem seguir a convenção `create_<entidade>_table` para a criação de tabelas e `add_<campo>_to_<entidade>` para adição de campos.

As migrations serão guardadas na pasta `db/migrations`.

## Rodar as Migrations

Para rodar as migrations, basta subir o container de migrações com docker compose up.