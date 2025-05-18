import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Like, Prisma, PrismaClient } from "../generated/prisma";
import { NotFoundError } from "../utils/errors/auth-errors";

export class LikeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Method to create new like in database
  async createLike(likeData: Prisma.LikeCreateInput): Promise<Like> {
    return await this.prisma.like.create({
      data: likeData,
    });
  }

  // Method to delete like from database
  async deleteLike(userId: string, imageId: string): Promise<Like> {
    try {
      return await this.prisma.like.delete({
        where: {
          userId_imageId: {
            userId,
            imageId,
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("Like", imageId);
        }
      }
      throw error;
    }
  }
}
