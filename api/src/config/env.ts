import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface Config {
  server: {
    port: number;
    nodeEnv: string;
  };

  postgres: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl: boolean;
  };

  database: {
    url: string;
  };

  redis: {
    host: string;
    port: number;
    password: string;
    username: string;
    database: number;
    ssl: boolean;
  };

  socket: {
    path: string;
    corsOrigin: string;
  };

  security: {
    jwtSecret: string;
    jwtExpiration: string;
    rateLimit: {
      window: number;
      max: number;
    };
  };

  logs: {
    level: string;
  };

  cache: {
    ttl: number;
  };

  monitoring: {
    enableMetrics: boolean;
    metricsPort: number;
  };
}

// Function to get env variable ()
const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable : ${key}`);
  }
  return value;
};

// Fonction to get optional env variable
const getOptionalEnvVariable = (
  key: string,
  defaultValue: string = ""
): string => {
  return process.env[key] || defaultValue;
};

export const config: Config = {
  server: {
    port: parseInt(getOptionalEnvVariable("PORT", "3000"), 10),
    nodeEnv: getOptionalEnvVariable("NODE_ENV", "development"),
  },
  postgres: {
    host: getOptionalEnvVariable("POSTGRES_HOST", "localhost"),
    port: parseInt(getOptionalEnvVariable("POSTGRES_PORT", "5432"), 10),
    database: getOptionalEnvVariable("POSTGRES_DB", "likes_db"),
    user: getOptionalEnvVariable("POSTGRES_USER", "postgres"),
    password: getOptionalEnvVariable("POSTGRES_PASSWORD", ""),
    ssl: getOptionalEnvVariable("POSTGRES_SSL", "false") === "true",
  },
  database: {
    url: getEnvVariable("DATABASE_URL"),
  },
  redis: {
    host: getOptionalEnvVariable("REDIS_HOST", "localhost"),
    port: parseInt(getOptionalEnvVariable("REDIS_PORT", "6379"), 10),
    password: getOptionalEnvVariable("REDIS_PASSWORD", ""),
    username: getOptionalEnvVariable("REDIS_USERNAME", ""),
    database: parseInt(getOptionalEnvVariable("REDIS_DATABASE", "0"), 10),
    ssl: getOptionalEnvVariable("REDIS_SSL", "false") === "true",
  },
  socket: {
    path: getOptionalEnvVariable("SOCKET_PATH", "/socket.io"),
    corsOrigin: getOptionalEnvVariable(
      "SOCKET_CORS_ORIGIN",
      "http://localhost:3000"
    ),
  },
  security: {
    jwtSecret: getOptionalEnvVariable("JWT_SECRET", "default_secret_key"),
    jwtExpiration: getOptionalEnvVariable("JWT_EXPIRATION", "1d"),
    rateLimit: {
      window: parseInt(getOptionalEnvVariable("RATE_LIMIT_WINDOW", "15"), 10),
      max: parseInt(getOptionalEnvVariable("RATE_LIMIT_MAX", "100"), 10),
    },
  },
  logs: {
    level: getOptionalEnvVariable("LOG_LEVEL", "info"),
  },
  cache: {
    ttl: parseInt(getOptionalEnvVariable("CACHE_TTL", "3600"), 10),
  },
  monitoring: {
    enableMetrics: getOptionalEnvVariable("ENABLE_METRICS", "true") === "true",
    metricsPort: parseInt(getOptionalEnvVariable("METRICS_PORT", "9090"), 10),
  },
};

if (config.server.nodeEnv === "production") {
  if (config.security.jwtSecret === "default_secret_key") {
    throw new Error("JWT_SECRET must be define in production");
  }

  if (config.postgres.password === "") {
    throw new Error("POSTGRESS_PASSWORD must be define in production");
  }
}

export default config;
