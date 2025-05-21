import { Router } from "express";
import { authController } from "../controller/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Register route
    this.router.post("/register", authController.register);

    // Login route
    this.router.post("/login", authController.login);

    // Logout route
    this.router.post(
      "/logout",
      authMiddleware.authenticate,
      authMiddleware.leadUser,
      authController.logout
    );

    // route for getting current user
    this.router.get(
      "/me",
      authMiddleware.authenticate,
      authMiddleware.leadUser,
      authController.getcurrentUser
    );
  }
}

export const authRouter = new AuthRouter();
