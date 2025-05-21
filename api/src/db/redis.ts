import Redis, { Redis as RedisType } from "ioredis";
import config from "../config/env";

class RedisClient {
  private static instance: RedisType;

  static getInstance(): RedisType {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.database,
      });
    }
    return RedisClient.instance;
  }
}

export const redisClient = RedisClient.getInstance();
