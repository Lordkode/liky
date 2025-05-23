import { Request, Response, NextFunction } from "express";
import { jwtService, JwtService } from "../utils/jwt.utils";
import { PrismaClient } from "../generated/prisma";
import { UserRepository } from "../repository/user.repository";
import {
  InvalidTokenError,
  AuthentificationError,
} from "../utils/errors/auth-errors";
import { redisClient } from "../db/redis";

// Extension of Express request interface for adding user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
    }
  }
}

export class AuthMiddleware {
  private userRepository: UserRepository;

  constructor() {
    const prisma = new PrismaClient();
    this.userRepository = new UserRepository(prisma);
  }

  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract token from header
      const token = jwtService.extractToken(req.headers.authorization);
      if (!token) {
        throw new AuthentificationError();
      }

      // Check blacklist on Redis
      const isBlacklisted = await redisClient.get(`bl_${token}`);
      if (isBlacklisted) {
        throw new InvalidTokenError();
      }

      //Verify & decode token
      const decoded = jwtService.verifyToken(token);

      // add user id to the request
      req.userId = decoded.userId;

      next();
    } catch (error) {
      if (error instanceof AuthentificationError) {
        next(error);
      } else {
        next(new InvalidTokenError());
      }
    }
  };

  public leadUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.userId) {
        next();
        return;
      }

      const user = await this.userRepository.findById(req.userId);

      // Delete password
      const { password, ...userWithoutPassword } = user;

      // Add user to request
      req.user = userWithoutPassword;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const authMiddleware = new AuthMiddleware();
