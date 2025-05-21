import { Request, Response, NextFunction } from "express";
import { AuthService, LoginDTO, RegisterDTO } from "../services/auth.service";
import { UserRepository } from "../repository/user.repository";
import { PrismaClient } from "../generated/prisma";
import { InvalidPostDataError } from "../utils/errors/post-errors";
import { AuthentificationError } from "../utils/errors/auth-errors";
import { jwtService } from "../utils/jwt.utils";
import { redisClient } from "../db/redis";

export class AuthController {
  private authService: AuthService;

  constructor() {
    const prisma = new PrismaClient();
    const userRepository = new UserRepository(prisma);
    this.authService = new AuthService(userRepository);
  }

  // Method for register
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const registerData: RegisterDTO = req.body;

      // Validation des données d'entrée
      if (
        !registerData.email ||
        !registerData.password ||
        !registerData.username
      ) {
        throw new InvalidPostDataError("Tous les champs sont requis");
      }

      // Validation du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        throw new InvalidPostDataError("Format d'email invalide");
      }

      // Validation de la longueur du mot de passe
      if (registerData.password.length < 6) {
        throw new InvalidPostDataError(
          "Le mot de passe doit contenir au moins 6 caractères"
        );
      }

      const result = await this.authService.register(registerData);

      res.status(201).json({
        status: 201,
        code: "USER_CREATED",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to login
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;

      // Validation des données d'entrée
      if (!loginData.email || !loginData.password) {
        throw new InvalidPostDataError("Email et mot de passe requis");
      }

      const result = await this.authService.login(loginData);

      res.status(200).json({
        status: 200,
        code: "LOGIN_SUCCESS",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to get current user
  public getcurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthentificationError();
      }

      res.status(200).json({
        status: 200,
        code: "USER_FOUND",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to logout
  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        const decodedToken = jwtService.verifyToken(token);
        const expireIn = decodedToken.exp - Math.floor(Date.now() / 1000);

        await redisClient.set(`bl_${token}`, "true", "EX", expireIn);
      }
      // This is just a placeholder, as JWTs are stateless and don't require server-side invalidation
      res.status(200).json({
        status: 200,
        code: "LOGOUT_SUCCESS",
        message: "User logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
