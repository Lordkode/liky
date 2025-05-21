import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import {
  TokenExpiredError as JwtTokenExpiredError,
} from "jsonwebtoken";
import { InvalidTokenError, TokenExpiredError } from "./errors/auth-errors";

export class JwtService {
  private readonly jwtSecret: string;
  private readonly tokenExpiration: string;

  constructor() {
    this.jwtSecret = config.security.jwtSecret;
    this.tokenExpiration = config.security.jwtExpiration;
  }

  public generateToken(payload: Record<string, any>): string {
    return jwt.sign(payload, this.jwtSecret as jwt.Secret, {
      expiresIn: this.tokenExpiration as jwt.SignOptions["expiresIn"],
    });
  }

  public generateRefreshToken(payload: Record<string, any>): string {
    return jwt.sign(payload, this.jwtSecret as jwt.Secret, {
      expiresIn: "7d",
    });
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      if (error instanceof JwtTokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  }

  public extractToken(authHeader: string | undefined): string {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new InvalidTokenError();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new InvalidTokenError();
    }

    return token;
  }
}

export const jwtService = new JwtService();
