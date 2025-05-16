import { Request, Response, NextFunction } from "express";
import { AuthService, LoginDTO, RegisterDTO } from "../services/auth.service";
import { UserRepository } from "../repository/user.repository";
import { PrismaClient } from "../generated/prisma";
import { InvalidPostDataError } from "../utils/errors/post-errors";

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
      if (!registerData.email || !registerData.password || !registerData.username) {
        throw new InvalidPostDataError("Tous les champs sont requis");
      }

      // Validation du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        throw new InvalidPostDataError("Format d'email invalide");
      }

      // Validation de la longueur du mot de passe
      if (registerData.password.length < 6) {
        throw new InvalidPostDataError("Le mot de passe doit contenir au moins 6 caractères");
      }

      const result = await this.authService.register(registerData);

      res.status(201).json({
        status: "success",
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
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to get current user
  public getcurrentUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  };
}

export const authController = new AuthController();