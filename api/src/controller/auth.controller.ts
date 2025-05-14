import { Request, Response, NextFunction } from "express";
import { AuthService, LoginDTO, RegisterDTO } from "../services/auth.service";
import { UserRepository } from "../repository/user.repository";
import { PrismaClient } from "../generated/prisma";

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