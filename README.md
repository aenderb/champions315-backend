# 🏋️ Champions315 API

RESTful API de autenticação e gerenciamento de usuários, construída com **princípios SOLID** e **arquitetura enterprise**. Sistema completo de autenticação via cookies httpOnly com access token + refresh token.

---

## 📑 Índice

- [Tech Stack](#-tech-stack)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Banco de Dados](#-banco-de-dados)
- [Executando](#-executando)
- [Endpoints](#-endpoints)
- [Fluxo de Autenticação](#-fluxo-de-autenticação)
- [Testes](#-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Node.js | 18+ |
| Linguagem | TypeScript | 5.9 |
| Framework | Express | 5.1 |
| ORM | Prisma | 7.3 |
| Banco de Dados | PostgreSQL | latest |
| Autenticação | jsonwebtoken (JWT) | 9.0 |
| Hash de Senha | bcryptjs | 3.0 |
| Validação | Zod | 4.1 |
| Upload | Multer | 2.0 |
| Logging | Winston | 3.19 |
| Testes | Vitest | 4.0 |
| Containerização | Docker Compose | - |

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas com princípios SOLID:

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

| Camada | Responsabilidade |
|--------|-----------------|
| **Routes** | Definição de endpoints e middlewares |
| **Controller** | Validação do request (Zod), orquestração |
| **Service** | Lógica de negócio |
| **Repository** | Acesso a dados (interface + implementação) |
| **Middleware** | Auth, rate limiting, logging, error handling |

**Padrões aplicados:**
- Repository Pattern com interfaces (`IUserRepository`, `IRefreshTokenRepository`)
- Dependency Injection manual (service recebe repository via construtor)
- DTOs para transferência de dados entre camadas
- Custom Error Classes por tipo de erro HTTP
- In-Memory Repository para testes

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Registro de usuário com validação de email
- Login com cookies httpOnly (access token + refresh token)
- Access token JWT com expiração curta (15 min)
- Refresh token opaco com expiração longa (7 dias)
- Hash SHA-256 do refresh token no banco (nunca salva o token original)
- Revogação de tokens no logout
- Rotação automática de refresh tokens no login

### 👤 Usuários
- Cadastro com upload de avatar (JPEG, PNG, WebP — máx. 5MB)
- Consulta de usuário por ID (sem expor password_hash)

### 🛡️ Segurança
- Rate limiting por endpoint (signup, signin, geral)
- Proteção contra brute force e DDoS
- Cookies httpOnly + secure + sameSite
- Senhas com bcrypt (salt 10)
- Variáveis de ambiente validadas com Zod

### 📊 Monitoramento
- Winston logger (request.log, error.log, combined.log)
- Health check endpoint (`/health`)
- Logs estruturados em JSON

---

## 📋 Pré-requisitos

- **Node.js** 18+
- **Docker** e **Docker Compose** (para o PostgreSQL)
- **npm** ou **yarn**

---

## 🚀 Instalação

```bash
# Clonar o repositório
git clone <repo-url>
cd champions315-backend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Subir o PostgreSQL
docker compose up -d

# Rodar migrations
npx prisma migrate dev

# Iniciar em desenvolvimento
npm run start:dev
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=dev
PORT=3333

DATABASE_URL="postgresql://docker:docker@localhost:5432/champions315apidb?schema=public"

# Access Token (curta duração)
JWT_SECRET="sua-chave-secreta-aqui"
JWT_EXPIRATION_TIME="15m"

# Refresh Token (longa duração)
JWT_REFRESH_SECRET="outra-chave-secreta-aqui"
JWT_REFRESH_EXPIRATION_TIME="7d"
```

| Variável | Descrição | Default |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente (dev, test, production) | `dev` |
| `PORT` | Porta do servidor | `3333` |
| `DATABASE_URL` | Connection string PostgreSQL | - |
| `JWT_SECRET` | Chave para assinar o access token | - |
| `JWT_EXPIRATION_TIME` | Expiração do access token | `15m` |
| `JWT_REFRESH_SECRET` | Chave para o refresh token | - |
| `JWT_REFRESH_EXPIRATION_TIME` | Expiração do refresh token | `7d` |

---

## 🗄️ Banco de Dados

### Subir com Docker Compose

```bash
docker compose up -d
```

Isso cria um container PostgreSQL com:
- **User:** docker
- **Password:** docker  
- **Database:** champions315apidb
- **Porta:** 5432

### Schema Prisma

```prisma
model User {
  id             String         @id @db.Uuid
  name           String
  email          String         @unique
  password_hash  String
  avatar         String?
  created_at     DateTime       @default(now())
  refresh_tokens RefreshToken[]
}

model RefreshToken {
  id         String    @id @db.Uuid
  token_hash String
  user_id    String    @db.Uuid
  expires_at DateTime
  created_at DateTime  @default(now())
  revoked_at DateTime?
}
```

### Comandos úteis

```bash
# Criar/aplicar migrations
npx prisma migrate dev --name descricao

# Verificar status das migrations
npx prisma migrate status

# Abrir Prisma Studio (UI visual)
npx prisma studio

# Resetar banco (cuidado!)
npx prisma migrate reset
```

---

## ▶️ Executando

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Build para produção
npm run build

# Produção
npm start

# Com Docker Compose (produção)
docker compose -f docker-compose.prod.yml up -d
```

O servidor inicia em `http://localhost:3333`.

---

## 📡 Endpoints

### Health Check

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/health` | ❌ | Status da API e banco |

### Usuários

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/users/signup` | ❌ | Cadastro de usuário |
| POST | `/users/signin` | ❌ | Login (retorna cookies) |
| POST | `/users/refresh` | ❌ | Renovar access token |
| POST | `/users/logout` | ✅ | Logout (revoga tokens) |
| GET | `/users/:id` | ✅ | Buscar usuário por ID |

### Detalhes das requisições

#### `POST /users/signup`

```bash
curl -X POST http://localhost:3333/users/signup \
  -F "name=João Silva" \
  -F "email=joao@email.com" \
  -F "password=123456" \
  -F "avatar=@/caminho/foto.jpg"
```

**Response** `201 Created`:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "avatar": "/uploads/avatars/1707...-foto.jpg",
  "created_at": "2026-02-12T..."
}
```

#### `POST /users/signin`

```bash
curl -X POST http://localhost:3333/users/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "123456"}' \
  -c cookies.txt
```

**Response** `200 OK`:
```json
{ "user": { "id": "uuid", "name": "João Silva", "email": "joao@email.com" } }
```

**Cookies setados:**
- `token` — access token (httpOnly, 15 min)
- `refresh_token` — refresh token (httpOnly, 7 dias)

#### `POST /users/refresh`

```bash
curl -X POST http://localhost:3333/users/refresh \
  -b cookies.txt -c cookies.txt
```

**Response** `200 OK`:
```json
{ "user": { "id": "uuid", "name": "João Silva", "email": "joao@email.com" } }
```

Renova o cookie `token` com um novo access token.

#### `POST /users/logout`

```bash
curl -X POST http://localhost:3333/users/logout \
  -b cookies.txt
```

**Response** `200 OK`:
```json
{ "message": "Logout realizado com sucesso" }
```

#### `GET /users/:id`

```bash
curl http://localhost:3333/users/uuid-aqui \
  -b cookies.txt
```

**Response** `200 OK`:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "avatar": "/uploads/avatars/...",
  "created_at": "2026-02-12T..."
}
```

---

## 🔄 Fluxo de Autenticação

```
1. POST /signin → valida credenciais → gera access token (JWT, 15min) + refresh token (opaco, 7d)
2. Salva SHA-256 do refresh token no banco, revoga tokens anteriores
3. Seta dois cookies httpOnly: "token" e "refresh_token"
4. Requisições autenticadas → middleware lê cookie "token" → jwt.verify
5. Após 15min, access token expira → front recebe 401
6. POST /refresh → valida refresh token via hash no banco → gera novo access token
7. POST /logout → revoga refresh tokens no banco + limpa cookies
```

**Por que dois tokens?**

| | Access Token | Refresh Token |
|---|---|---|
| Formato | JWT (assinado) | Opaco (random bytes) |
| Duração | 15 minutos | 7 dias |
| No banco? | Não (stateless) | Sim (hash SHA-256) |
| Revogável? | Não (expira sozinho) | Sim (revoked_at) |

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Testes com watch mode
npm run test:watch

# Cobertura de testes
npm run test:coverage

# Interface visual do Vitest
npm run test:ui
```

Os testes usam **In-Memory Repository** — não precisam de banco de dados.

---

## 📁 Estrutura do Projeto

```
src/
├── app.ts                          # Configuração do Express
├── server.ts                       # Inicialização do servidor
├── routes.ts                       # Rotas principais
├── env/
│   └── index.ts                    # Validação de variáveis (Zod)
├── @types/
│   └── express.d.ts                # Extensão do Request (userId)
├── modules/
│   └── user/
│       ├── routes.ts               # Rotas de /users
│       ├── controller/
│       │   ├── AuthenticateUserController.ts
│       │   ├── CreateUserController.ts
│       │   ├── GetUserByIdController.ts
│       │   ├── LogoutController.ts
│       │   └── RefreshTokenController.ts
│       ├── service/
│       │   ├── AuthenticateUserService.ts
│       │   ├── CreateUserService.ts
│       │   ├── GetUserByIdService.ts
│       │   └── RefreshTokenService.ts
│       ├── repository/
│       │   ├── IUserRepository.ts
│       │   ├── IRefreshTokenRepository.ts
│       │   ├── PrismaUserRepository.ts
│       │   ├── PrismaRefreshTokenRepository.ts
│       │   └── InMemoryUserRepository.ts
│       └── dto/
│           ├── AuthenticateUserDTO.ts
│           └── CreateUserDTO.ts
└── shared/
    ├── config/
    │   ├── logger.ts               # Configuração Winston
    │   └── upload.ts               # Configuração Multer
    ├── controllers/
    │   └── HealthCheckController.ts
    ├── errors/
    │   ├── BadRequestError.ts
    │   ├── ConflictError.ts
    │   ├── ForbiddenError.ts
    │   ├── NotFoundError.ts
    │   └── UnauthorizedError.ts
    ├── infra/
    │   └── prisma/
    │       └── client.ts           # Instância do PrismaClient
    ├── middlewares/
    │   ├── ensureAuth.ts           # Validação JWT via cookie
    │   ├── errorHandler.ts         # Tratamento global de erros
    │   ├── logger.ts               # Request/Error logging
    │   └── rateLimiter.ts          # Rate limiting
    └── utils/
        └── httpStatus.ts           # Constantes HTTP
```

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `start:dev` | `npm run start:dev` | Dev com hot reload (tsx watch) |
| `start` | `npm start` | Produção (node build/) |
| `build` | `npm run build` | Build com tsup |
| `test` | `npm test` | Rodar testes |
| `test:watch` | `npm run test:watch` | Testes com watch |
| `test:coverage` | `npm run test:coverage` | Cobertura de testes |
| `test:ui` | `npm run test:ui` | Interface visual Vitest |

---

## 📄 Licença

ISC
