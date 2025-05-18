import { Request, Response, NextFunction } from "express";
import { AuthentificationError } from "../utils/errors/auth-errors";
import { LikeService } from "../services/like.service";
import { PrismaClient } from "../generated/prisma";
import { InvalidPostDataError } from "../utils/errors/post-errors";

export class LikeController {
  private likeService: LikeService;

  constructor() {
    this.likeService = new LikeService();
  }

  // Method to create new like
  createLike = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.userId) {
        throw new AuthentificationError();
      }

      if (!req.params.imageId) {
        throw new InvalidPostDataError("ID de l'image manquant");
      }

      const newLike = await this.likeService.createLike({
        imageId: req.params.imageId,
        userId: req.userId,
      });

      res.status(201).json({
        status: 201,
        code: "LIKE_CREATED",
        data: newLike,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to delete like from database
  deleteLike = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.userId) {
        throw new AuthentificationError();
      }

      if (!req.params.imageId) {
        throw new InvalidPostDataError("ID de l'image manquant");
      }

      const deletedLike = await this.likeService.deleteLike({
        userId: req.userId,
        imageId: req.params.imageId,
      });

      res.status(200).json({
        status: 200,
        code: "LIKE_DELETED",
        data: deletedLike,
      });
    } catch (error) {
      next(error);
    }
  }
}
