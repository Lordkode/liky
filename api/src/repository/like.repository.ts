import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Like, PrismaClient } from "../generated/prisma";
import { NotFoundError } from "../utils/errors/auth-errors";

export class LikeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Method to create new like in database
  async createLike(likeData: {
    imageId: string;
    userId: string;
  }): Promise<Like> {
    return await this.prisma.like.create({
      data: {
        imageId: likeData.imageId,
        userId: likeData.userId,
      },
    });
  }

  // Method to delete like from database
  async deleteLike(id: string): Promise<Like> {
    try {
      return await this.prisma.like.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("Like", id);
        }
      }
      throw error;
    }
  }
}
