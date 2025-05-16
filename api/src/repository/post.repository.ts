import { PrismaClient, Image, Prisma } from "../generated/prisma";
import { NotFoundError } from "../utils/errors/auth-errors";

export class PostRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Methode pour ajouter une nouvelle image
  async createPost(postData: {
    url: string;
    title?: string;
    userId: string;
    publicId: string;
  }): Promise<Image> {
    return await this.prisma.image.create({
      data: {
        url: postData.url,
        title: postData.title,
        userId: postData.userId,
        publicId: postData.publicId
      },
    });
  }

  // Method for getting all posts
  async getAllPosts(): Promise<Image[]> {
    return await this.prisma.image.findMany();
  }

  // Method for getting post by id
  async getPostById(id: string): Promise<Image> {
    const post = await this.prisma.image.findUnique({
      where: { id },
    });
    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }
    return post;
  }

  // Method for deleting post
  async deletePost(id: string): Promise<Image> {
    try {
      return await this.prisma.image.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("Post", id);
        }
      }
      throw error;
    }
  }

  // Methode for getting posts by user id
  async getPostsByUser(userId: string): Promise<Image[]> {
    return await this.prisma.image.findMany({
      where: { userId },
    });
  }
}
