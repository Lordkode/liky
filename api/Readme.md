# 🚀 Liky API

This is a RESTful API built with **Express.js** and **TypeScript**, using **PostgreSQL** as the database and **Redis** for caching.

## 🧰 Tech Stack

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Redis](https://redis.io/)
- [ioredis](https://github.com/luin/ioredis)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Lordkode/liky.git
cd liky/api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory (or rename `.env.example`):

```env
# SERVER CONFIG
PORT=3000
NODE_ENV=development

# DATABASE POSTGRESQL CONFIG
POSTGRES_HOST=""
POSTGRES_PORT=""
POSTGRES_DB=likes_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
POSTGRES_SSL=false # or true

# REDIS CONFIG
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_USERNAME=
REDIS_DATABASE=0
REDIS_SSL=false

# SOCKET CONFIG
SOCKET_PATH=/socket.io
SOCKET_CORS_ORIGIN=http://localhost:3000

# SECURITY CONFIG
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# LOG CONFIG
LOG_LEVEL=info

# CACHE CONFIG
CACHE_TTL=3600

# MONITORING CONFIG
ENABLE_METRICS=true
METRICS_PORT=9090

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/likes_db?schema=public"
```

### 4. Initialize the database

> Make sure PostgreSQL is running and the `likes_db` database exists.

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run dev
```

---

## 📦 Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the server in development mode |
| `npm run build`     | Compile TypeScript to JavaScript     |
| `npm start`         | Start the compiled server            |
| `npx prisma studio` | Open Prisma Studio (GUI for DB)      |

---

## 🧪 Test Endpoint

### GET `/`

Returns a welcome message and Redis connection status.

```json
{
  "message": "Express server running!",
  "environment": "development",
  "redis": "PONG"
}
```

---

## 🧠 Coming Soon

- JWT Authentication
- User registration & login
- Image Like & Comment features
- Automated tests
- Swagger documentation

---

## 🛠 Core Dependencies

- `express`
- `typescript`
- `pg` & `@prisma/client`
- `redis` & `ioredis`
- `dotenv`

---

## 🧑‍💻 Author

Richard || Software engineer || Tech Lead
📫 Contact: \[[richard.ati@epitech.eu](mailto:richard.ati@epitech.eu)]
🌐 GitHub: [github.com/LordKode](https://github.com/LordKode)