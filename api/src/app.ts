import { Client } from "pg";
import express, { Application, Express, Request, Response } from "express";
import { config } from "./config/env";
import { redisClent } from "./db/redis";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./routes/auth.routes";
import { Server } from "http";

export class App {
  public app: Application;
  public port: number;
  public server?: Server;
  private postgresClient!: Client;

  constructor() {
    this.app = express();
    this.port = config.server.port;

    this.initializeMiddlewares();
    this.initializeDatabaseConnections();
    this.initializeRoutes();
    this.setupRootRoute();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  private async initializeDatabaseConnections(): Promise<void> {
    // PostgreSQL
    this.postgresClient = new Client({
      host: config.postgres.host,
      port: config.postgres.port,
      user: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.database,
    });

    try {
      await this.postgresClient.connect();
      console.log("✅ Connected to PostgreSQL");
    } catch (error) {
      console.error("❌ PostgreSQL connection error:", error);
    }

    // Redis
    try {
      const ping = await redisClent.ping();
      if (ping === "PONG") {
        console.log("✅ Connected to Redis");
      } else {
        console.error("❌ Redis ping failed");
      }
    } catch (error) {
      console.error("❌ Redis connection error:", error);
    }
  }

  private initializeRoutes(): void {
    this.app.use("/api/auth", authRouter.router);
  }

  private setupRootRoute(): void {
    this.app.get("/", async (req, res) => {
      const redisPing = await redisClent.ping();
      res.json({
        message: "API running",
        environment: config.server.nodeEnv,
        redis: redisPing,
      });
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running at http://localhost:${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await this.postgresClient.end();
    if (this.server) {
      this.server.close();
    }
  }
}

export default App;
