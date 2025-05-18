import { Image } from "../generated/prisma";
import { PostRepository } from "../repository/post.repository";
import { UserNotFoundError } from "../utils/errors/auth-errors";
import { InvalidUploadCredentialsError, CloudinaryInvalidFormatError } from "../utils/errors/cloudinary-errors";
import { CloudinaryService } from "./cloudinary.service";
import { UserRepository } from "../repository/user.repository";
import { AppError } from "../utils/errors/app-error";
import { PostNotFoundError, InvalidPostDataError } from "../utils/errors/post-errors";

export interface PostDTO {
  file: Express.Multer.File;
  title?: string;
  userId: string;
}

export interface PostResponse {
  id: string;
  url: string;
  title?: string;
  publicId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PostService {
  private postRepository: PostRepository;
  private cloudinaryService: CloudinaryService;
  private userRepository: UserRepository;

  constructor(
    postRepository: PostRepository,
    cloudinaryService: CloudinaryService,
    userRepository: UserRepository
  ) {
    this.postRepository = postRepository;
    this.cloudinaryService = cloudinaryService;
    this.userRepository = userRepository;
  }

  // Method to upload image
  async uploadImage(postDTO: PostDTO): Promise<PostResponse> {
    try {
      if (!postDTO.file || !postDTO.userId) {
        throw new InvalidPostDataError("File or userId is missing");
      }

      // Vérifier si l'utilisateur existe
      try {
        await this.userRepository.findById(postDTO.userId);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          throw new InvalidPostDataError("User not found");
        }
        throw error;
      }

      // Upload vers Cloudinary
      try {
        const cloudinaryResult = await this.cloudinaryService.uploadFormDataImage(
          postDTO.file,
          {
            folder: "posts",
          }
        );

        // Créer le post en base de données
        const postData = {
          url: cloudinaryResult.secure_url,
          title: postDTO.title,
          user: {
            connect: { id: postDTO.userId }
          },
          publicId: cloudinaryResult.public_id
        };

        const post = await this.postRepository.createPost(postData);

        return {
          id: post.id,
          url: post.url,
          title: post.title || undefined,
          userId: post.userId,
          publicId: post.publicId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      } catch (error) {
        if (error instanceof CloudinaryInvalidFormatError) {
          throw new InvalidPostDataError(error.message);
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InvalidPostDataError(error.message);
      }
      throw new InvalidPostDataError("Error while creating post");
    }
  }

  // Method to get user feed
  async getFeed(userId: string): Promise<Image[]> {
    try {
      const posts = await this.postRepository.getPostsByUser(userId);
      return posts;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new PostNotFoundError("for user " + userId);
    }
  }

  // Method to get Post
  async getPost(postId: string): Promise<Image> {
    try {
      const post = await this.postRepository.getPostById(postId);
      if (!post) {
        throw new PostNotFoundError(postId);
      }
      return post;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new PostNotFoundError(postId);
    }
  }
}
