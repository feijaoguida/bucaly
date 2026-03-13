# Plan: Bucaly Backend & Frontend Integration

## Overview
Desenvolvimento da API REST completa usando NestJS para o e-commerce Bucaly (plataforma de produtos odontológicos profissionais) e integração do frontend Next.js existente para consumo imediato desta nova API, substituindo o mock atual.

## Project Type
BACKEND (com integração WEB/FRONTEND)

## Success Criteria
- Backend em NestJS funcional, conectado ao PostgreSQL via Prisma ORM.
- Autenticação e segurança via JWT + Passport implementadas.
- Pipeline de requests validada com `class-validator` e `class-transformer`.
- Rotas de base (auth, usuários, categorias, produtos, carrinho, pedidos, endereços, contato, dashboard) mapeadas e documentadas no Swagger.
- Frontend em Next.js perfeitamente atualizado para consumir endpoints reais.
- Sem Clean Architecture purista, adotando a forte estruturação nativa por módulos do NestJS.

## Tech Stack
- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT, Passport, Bcrypt
- **Documentação**: Swagger / OpenAPI
- **Uploads**: Multer (suporte a Cloudinary ou S3)
- **Frontend**: Next.js (TailwindCSS e Axios/Fetch API)

## File Structure (Backend)
```
src/
├── app.module.ts
├── main.ts
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── swagger.config.ts
├── common/             # decorators, filters, guards, interceptors, pipes, dto
├── modules/
│   ├── auth/
│   ├── users/
│   ├── categories/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── addresses/
│   ├── contact/
│   └── dashboard/
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

## Task Breakdown

### TS-01: Inicialização e Integração com Banco (NestJS + Prisma)
- **Agent**: `backend-specialist`
- **Skills**: `nestjs-expert`, `prisma-expert`, `database-design`
- **Priority**: P0
- **Dependencies**: Nenhuma
- **INPUT**: Executar a criação do servidor NestJS e configurar o Prisma Schema com os modelos do e-commerce fornecidos no prompt.
- **OUTPUT**: Schemas validados (`User`, `Product`, `Category`, `Cart`, etc) gerados no Postgres e aplicação levantando dev-server e executando script `.seed.ts`.
- **VERIFY**: Comando `npx prisma migrate dev` sem falhas. A conexão é confirmada através de log de banco.

### TS-02: Sistema de Segurança e Identificação (Módulo de Auth)
- **Agent**: `security-auditor` e `backend-specialist`
- **Skills**: `vulnerability-scanner`, `api-patterns`
- **Priority**: P1
- **Dependencies**: TS-01
- **INPUT**: Criar o modelo genérico de Autenticação usando LocalStrategy e JwtStrategy. Implementar cadastro seguro criptografando a senha e roteando as roles (ADMIN, CLIENTE).
- **OUTPUT**: Guardas de escopo (`@Roles()`, `@Public()`, `@CurrentUser()`) ativos. Rate Limiting implementado.
- **VERIFY**: Endpoints restritos barram visitantes não autorizados gerando status 401.

### TS-03: Rotas C-Level Públicas (Produtos e Categorias)
- **Agent**: `backend-specialist`
- **Skills**: `api-patterns`
- **Priority**: P1
- **Dependencies**: TS-01
- **INPUT**: Montar endpoints usando DTOs para listagem e paginação otimizada dos produtos e categorias. Integrar filtros complexos e paginação.
- **OUTPUT**: Dados visíveis na documentação Swagger (`/api-docs`) operando os CRUDS base e de busca por slugs.
- **VERIFY**: Retorno paginado respeita formatação padrão definida de `{ success, data, meta }`.

### TS-04: Motor de Compras (Carrinho, Transações e Endereços)
- **Agent**: `backend-specialist`
- **Skills**: `nodejs-best-practices`
- **Priority**: P1
- **Dependencies**: TS-02, TS-03
- **INPUT**: Organizar controle de entidades dinâmico entre Visitantes (com `sessionId`) e Usuários Autenticados. Montar order service com regras de fluxo.
- **OUTPUT**: Conversão do carrinho anônimo para usuário efetuada e validação de quantidade em estoque ativa no momento da compra.
- **VERIFY**: Processo de Order finalizado subtrai valores corretos do total do Subtotal, Frete e Imposições configuradas.

### TS-05: Estrutura Administrativa (Dashboard, Contatos e Upload)
- **Agent**: `backend-specialist`
- **Skills**: `api-patterns`, `bash-linux`
- **Priority**: P2
- **Dependencies**: TS-01
- **INPUT**: Adição das estatísticas e relatórios em agregações geradas em Queries do Prisma. Adicionar `Multer` aos `Products`.
- **OUTPUT**: Endpoint `/dashboard/stats` expõe estatísticas; Contatos listáveis e suporte para images resolvido.
- **VERIFY**: Administrador acessa com êxito retorno das requisições com base em dados populados com `.seed.ts`.

### TS-06: Adoção no Frontend (Next.js Link)
- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **Priority**: P2
- **Dependencies**: TS-01 a TS-05
- **INPUT**: Modificar o código do `/lib/api` no frontend. Migrar lógicas mockadas de carrinho, autenticação e listagens para requisições com token JWT nos headers.
- **OUTPUT**: App reactivel consumindo o DB real.
- **VERIFY**: E2E e navegação fluidos; usuário finaliza o check-out inteiro pelo Next.js com dados chegando intactos no banco.

## Phase X: Verificação Final
- [ ] Checagem e auditoria do código por P0.
- [ ] Scripts da base: `python .agent/scripts/checklist.py .` passando sem bloqueios críticos.
- [ ] Integração E2E rodando e validada pelo lado do FrontEnd local usando `playwright_runner.py`
- [ ] Interface livre de componentes padrão/Template Bans e purples de acordo com restrições.
- [ ] Clean code global na api.

## ✅ PHASE X COMPLETE
Pendente.
