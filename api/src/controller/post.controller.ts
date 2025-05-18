import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { PostRepository } from "../repository/post.repository";
import { UserRepository } from "../repository/user.repository";
import { CloudinaryService } from "../services/cloudinary.service";
import { PostService } from "../services/post.service";
import { AuthentificationError } from "../utils/errors/auth-errors";
import { InvalidUploadCredentialsError } from "../utils/errors/cloudinary-errors";
import { InvalidPostDataError } from "../utils/errors/post-errors";

export class PostController {
  private postService: PostService;
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    const postRepository = new PostRepository(this.prisma);
    const userRepository = new UserRepository(this.prisma);
    const cloudinaryService = new CloudinaryService();
    this.postService = new PostService(postRepository, cloudinaryService, userRepository);
  }

  // Method to create new post
  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new InvalidUploadCredentialsError('Aucun fichier fourni');
      }

      if (!req.userId) {
        throw new AuthentificationError();
      }

      if (!req.body.title) {
        throw new InvalidPostDataError('Le titre est requis');
      }

      const PostDTO = {
        file: req.file,
        title: req.body.title,
        userId: req.userId,
      };

      const post = await this.postService.uploadImage(PostDTO);

      res.status(201).json({
        status: 201,
        code: "POST_CREATED",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to get post
  public getPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.params.id) {
        throw new InvalidPostDataError('ID du post manquant');
      }

      const post = await this.postService.getPost(req.params.id);
      
      res.status(200).json({
        status: 200,
        code: "POST_FOUND",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to get one user all posts
  public getUserPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.userId) {
        throw new AuthentificationError();
      }

      const posts = await this.postService.getFeed(req.userId);
      
      res.status(200).json({
        status: 200,
        code: "POSTS_FOUND",
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  };
}
