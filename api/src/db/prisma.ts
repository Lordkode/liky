import { PrismaClient } from "@prisma/client";

export class PrismaService {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClient.instance) {
      PrismaClient.instance = new PrismaClient();
    }
    return PrismaClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaClient.instance) {
      await PrismaClient.instance.disconnect();
    }
  }
}

export const prisma = PrismaClient.getInstance();
