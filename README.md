# 🏋️ Champions315 API

> 🚧 **Work in Progress** - This project is under active development

RESTful API focused on user authentication and management, built with **SOLID principles** and **enterprise-grade architecture**. This API provides a complete authentication and user management system with professional logging, error handling, and monitoring.

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- ✅ User registration with email validation
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (salt 6)
- ✅ Token expiration control
- ✅ Secure password storage

### 👤 User Management
- ✅ Create user (POST /users/signup)
- ✅ Authenticate user (POST /users/signin)
- ✅ Get user by ID (GET /users/:id)
- ✅ Password hash hidden from responses
- Test

### 🏗️ Architecture & Best Practices
- ✅ **SOLID principles** implementation
- ✅ **Repository Pattern** for data access
- ✅ **Service Layer** for business logic
- ✅ **DTOs** (Data Transfer Objects)
- ✅ **Dependency Injection** (manual)
- ✅ **Custom Error Classes** by HTTP status
- ✅ **Global Error Handler**
- ✅ **Request/Error Logging** with Winston
- ✅ **Environment validation** with Zod
- ✅ **HTTP Status Constants** (no magic numbers)

### 📊 Monitoring & Logging
- ✅ Winston logger (request.log, error.log, combined.log)
- ✅ Health check endpoint (/health)
- ✅ Database connection monitoring
- ✅ Structured JSON logs
- ✅ Migration-ready for Elasticsearch

### 🛡️ Security & Rate Limiting
- ✅ Rate limiting with express-rate-limit
- ✅ Different limits per endpoint (signup, signin, general)
- ✅ DDoS protection
- ✅ Brute force attack prevention
- ✅ Environment-based rate limits (dev vs prod)

### 🧪 Testing
- ✅ Vitest for unit testing
- ✅ In-Memory Repository pattern
- ✅ Test coverage reports (v8)
- ✅ Vitest UI for visual test management
- ✅ 100% coverage on CreateUserService

## 🛠️ Tech Stack

### Core
- **Node.js 18+** - JavaScript runtime
- **TypeScript 5.9** - Type safety
- **Express 5.1** - Web framework
- **Prisma 7.3** - Modern ORM
- **PostgreSQL** - Relational database

### Security & Validation
- **JWT (jsonwebtoken)** - Token-based auth
- **bcryptjs** - Password hashing
- **Zod 4.1** - Schema validation

### Logging & Monitoring
- **Winston** - Professional logging
- **express-winston** - HTTP request logging

### Security
- **express-rate-limit** - API rate limiting

### Testing
- **Vitest** - Fast unit testing framework
- **@vitest/coverage-v8** - Code coverage reports
- **@vitest/ui** - Visual test management

### Development
- **tsx** - TypeScript execution
- **ESLint** - Code linting
- **Docker** - Database containerization

## 📦 Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd champions315api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:

```env
NODE_ENV=dev
PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/champions315apidb?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRATION_TIME="7d"
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` in production! Generate a secure key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start PostgreSQL with Docker
```bash
docker-compose up -d
```

### 5. Run database migrations
```bash
npx prisma migrate dev
```

### 6. Start development server
```bash
npm run start:dev
```

Server will be running at `http://localhost:3333`

## 📚 API Endpoints

### Health Check
```http
GET /health
```
Returns API health status and database connection.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-02T12:00:00.000Z",
  "uptime": 123.45,
  "database": "connected"
}
```

---

### User Registration
```http
POST /users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Rate Limit:** 3 accounts per hour (dev: 100)

**Response (201):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-02-02T12:00:00.000Z"
}
```

---

### User Authentication
```http
POST /users/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Rate Limit:** 5 attempts per 15 minutes (dev: 100)

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-02-02T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get User by ID
```http
GET /users/:id
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-02-02T12:00:00.000Z"
}
```

## 🗂️ Project Structure

```
src/
├── app.ts                          # Express app configuration
├── server.ts                       # Server entry point
├── routes.ts                       # Main routes aggregator
├── env/
│   └── index.ts                    # Environment validation (Zod)
├── modules/
│   └── user/
│       ├── controller/             # HTTP layer
│       │   ├── CreateUserController.ts
│       │   ├── AuthenticateUserController.ts
│       │   └── GetUserByIdController.ts
│       ├── service/                # Business logic
│       │   ├── CreateUserService.ts
│       │   ├── AuthenticateUserService.ts
│       │   └── GetUserByIdService.ts
│       ├── repository/             # Data access
│       │   ├── IUserRepository.ts
│       │   ├── PrismaUserRepository.ts
│       │   └── InMemoryUserRepository.ts  # For testing
│       ├── dto/                    # Data Transfer Objects
│       │   ├── CreateUserDTO.ts
│       │   └── AuthenticateUserDTO.ts
│       └── routes.ts               # User routes
└── shared/
    ├── config/
    │   └── logger.ts               # Winston configuration
    ├── controllers/
    │   └── HealthCheckController.ts
    ├── errors/                     # Custom error classes
    │   ├── BadRequestError.ts      # 400
    │   ├── UnauthorizedError.ts    # 401
    │   ├── ForbiddenError.ts       # 403
    │   ├── NotFoundError.ts        # 404
    │   ├── ConflictError.ts        # 409
    │   └── index.ts
    ├── middlewares/
    │   ├── errorHandler.ts         # Global error handler
    │   ├── logger.ts               # Request/error logger
    │   └── rateLimiter.ts          # Rate limiting configs
    ├── utils/
    │   └── httpStatus.ts           # HTTP status constants
    └── infra/
        └── prisma/
            └── client.ts           # Prisma client instance
```

## 🔑 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (dev/test/production) | dev | No |
| `PORT` | Server port | 3333 | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRATION_TIME` | Token expiration time | 7d | No |
| `LOG_LEVEL` | Winston log level (info/warn/error) | info | No |

## 📝 Available Scripts

```bash
# Development with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm start

# Testing
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:ui       # Visual test UI

# Database
npx prisma studio     # DB viewer
npx prisma migrate dev --name migration_name  # Create migration
npx prisma generate   # Generate Prisma Client
```

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Environment variables validation
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma ORM)
- ✅ **Rate limiting implemented** (DDoS, brute force protection)
- ✅ Environment-based rate limits (dev/prod)
- ⚠️ **TODO**: Add CORS configuration
- ⚠️ **TODO**: Add Helmet.js for security headers
- ⚠️ **TODO**: Increase bcrypt salt to 10 in production

### Rate Limiting Configuration

| Endpoint | Production Limit | Development Limit |
|----------|------------------|-------------------|
| General (all routes) | 100 req/15min | 1000 req/15min |
| POST /users/signin | 5 attempts/15min | 100 attempts/15min |
| POST /users/signup | 3 accounts/hour | 100 accounts/hour |

## 📊 Logging

Logs are stored in the `logs/` directory:

- **request.log** - All HTTP requests
- **error.log** - Application errors
- **combined.log** - Everything

Logs are in JSON format for easy parsing and can be migrated to Elasticsearch. See [LOGGING_MIGRATION.md](LOGGING_MIGRATION.md) for details.

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Visual UI
npm run test:ui
```

### Test Coverage
Current coverage: **47.61%** (CreateUserService: 100%)

```
----------------------------|---------|----------|---------|---------|
File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
CreateUserService.ts        |     100 |      100 |     100 |     100 |
InMemoryUserRepository.ts   |   53.84 |       50 |   66.66 |   54.54 |
----------------------------|---------|----------|---------|---------|
```

### Testing Strategy
- **In-Memory Repository** - Fast, isolated tests without database
- **Unit Tests** - Service layer logic validation
- **100% Coverage Goal** - All critical business logic covered

Coverage reports: `coverage/index.html`

## 🚀 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a secure random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure production `DATABASE_URL`
- [ ] Increase bcrypt salt to 10
- [x] Add rate limiting ✅
- [ ] Configure CORS
- [ ] Add Helmet.js
- [ ] Set up log rotation
- [ ] Configure monitoring (Sentry, New Relic)
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Review rate limit values for production

## 📈 Roadmap

### Next Features
- [ ] Refresh tokens
- [ ] Email verification
- [ ] Password reset
- [ ] User profile update/delete
- [ ] Role-based authorization
- [ ] Pagination
- [ ] API documentation (Swagger)

### Future Improvements
- [x] Unit tests (Vitest) ✅
- [ ] Integration tests (E2E)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Redis caching
- [ ] DI Container (tsyringe)
- [ ] GraphQL API
- [ ] WebSocket notifications
- [ ] Increase test coverage to 80%+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

---

**Made with ❤️ using SOLID principles and enterprise-grade architecture**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your settings:
```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/champions315apidb"
PORT=3000
```

4. **Start the database with Docker**
```bash
docker-compose up -d
```

5. **Run Prisma migrations**
```bash
npx prisma migrate dev
```

6. **Start the development server**
```bash
npm run start:dev
```

The server will be available at `http://localhost:3000`

## 🗄️ Database Structure

### User
- `id` - Unique user UUID
- `name` - Full name
- `email` - Unique email
- `password_hash` - Encrypted password
- `created_at` - Creation date

## 📝 Available Scripts

```bash
# Development with hot reload
npm run start:dev

# Build for production
npm run build

# Start in production
npm run start

# Prisma Studio (visual database interface)
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

## 🐳 Docker

The project uses Docker Compose to manage the PostgreSQL database:

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose stop

# View logs
docker-compose logs -f
```

## 🏗️ Directory Structure

```
champions315api/
├── src/
│   ├── app.ts           # Express configuration
│   ├── server.ts        # Server initialization
│   └── env/             # Environment variables validation
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration history
├── generated/           # Generated Prisma Client
├── docker-compose.yml   # Docker configuration
└── package.json         # Dependencies and scripts
```



## 👨‍💻 Author
Developed by Aender Binoto

---

⭐ If this project was helpful to you, consider giving it a star!
