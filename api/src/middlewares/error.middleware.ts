import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app-error";

export class ErrorHandler {
  public static handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
      return;
    }

    // Unhandled error
    console.error("Unhandled error");
    res.status(500).json({
      status: "error",
      message: "Internal server error !",
    });
  }

  // To capture unmanaged promises
  public static initialize(): void {
    process.on("unhandledRejection", (reason: Error) => {
      console.error("Unmanaged promises", reason);
      // In production, you may want to restart the server free of charge
    });

    process.on("uncaughtException", (error: Error) => {
      console.error("Exception not captured", error);
      // In production, you may want to restart the server free of charge
      process.exit(1);
    });
  }
}
