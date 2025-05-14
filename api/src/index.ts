import { Client } from "pg";
import express, { Express, Request, Response } from "express";
import { config } from "./config/env";
import { redisClent } from "./db/redis";

const app: Express = express();
const port = config.server.port;

// Middleware for parser a JSON
app.use(express.json());

// Test postgreSQL connexion
const client = new Client({
  host: config.postgres.host,
  port: config.postgres.port,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
});

client
  .connect()
  .then(() => console.log("✅ Connected to postgreSQL"))
  .catch((err) => console.log("Error connecting PostgreSQL :", err));

// Redis connexion test
redisClent
  .ping()
  .then((result) => {
    if (result === "PONG") {
      console.log("✅ Connected to Redis");
    } else {
      console.error("❌ Redis ping failed");
    }
  })
  .catch((error) => {
    console.error("❌ Error connecting Redis:", error);
  });

// Route for test
app.get("/", async (req: Request, res: Response) => {
  const redisStatus = await redisClent.ping();
  res.json({
    message: "Express server runing !",
    environment: config.server.nodeEnv,
    redis: redisStatus,
  });
});

// Start server
app.listen(port, () => {
  console.log(
    `[server]: Server is runing in ${config.server.nodeEnv} at http://localhost:${port}`
  );
});
