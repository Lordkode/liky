import { PrismaClient, User, Prisma } from "../generated/prisma";
import { UserNotFoundError } from "../utils/errors/auth-errors";

export class UserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data: userData,
    });
  }

  async update(id: string, userData: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new UserNotFoundError(id);
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new UserNotFoundError(id);
        }
      }
      throw error;
    }
  }
}
