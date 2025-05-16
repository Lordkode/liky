import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { PostRepository } from "../repository/post.repository";
import { UserRepository } from "../repository/user.repository";
import { CloudinaryService } from "../services/cloudinary.service";
import { PostService } from "../services/post.service";
import { NotFoundError, AuthentificationError } from "../utils/errors/auth-errors";
import { InvalidUploadCredentialsError } from "../utils/errors/cloudinary-errors";

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
        throw new InvalidUploadCredentialsError('No file provided');
      }

      if (!req.userId) {
        throw new AuthentificationError('Authentication required');
      }

      const PostDTO = {
        file: req.file,
        title: req.body.title,
        userId: req.userId,
      };

      const post = await this.postService.uploadImage(PostDTO);

      res.status(201).json({
        status: "success",
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
      const post = await this.postService.getPost(req.params.id);
      res.status(200).json({
        status: "success",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };

  // Method to get all posts
  public getUserPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.userId) {
        throw new AuthentificationError('Authentification requise');
      }

      const posts = await this.postService.getFeed(req.userId);
      res.status(200).json({
        status: "success",
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  };
}
