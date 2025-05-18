import { Router } from "express";
import { LikeController } from "../controller/like.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { PrismaClient } from "../generated/prisma";

export class LikeRouter {
  public router: Router;
  private likeController: LikeController;

  constructor() {
    this.router = Router();
    this.likeController = new LikeController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/:imageId",
      authMiddleware.authenticate,
      this.likeController.createLike
    );

    this.router.delete(
      "/:imageId",
      authMiddleware.authenticate,
      this.likeController.deleteLike
    );
  }
}

export const likeRouter = new LikeRouter();
