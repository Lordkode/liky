import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app-error";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { config } from "../config/env";

export class ErrorHandler {
  public static handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Log l'erreur complète pour le debugging
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    // Si c'est une de nos erreurs personnalisées
    if (err instanceof AppError) {
      const errorResponse = err.toJSON();
      errorResponse.path = req.path;
      
      res.status(err.statusCode).json(errorResponse);
      return;
    }

    // Si c'est une erreur Prisma
    if (err instanceof PrismaClientKnownRequestError) {
      const errorResponse = {
        status: 500,
        code: "DATABASE_ERROR",
        message: "Erreur de base de données",
        details: {
          code: err.code,
          meta: err.meta,
          clientVersion: err.clientVersion
        },
        path: req.path,
        timestamp: new Date().toISOString()
      };

      switch (err.code) {
        case 'P2002':
          errorResponse.status = 409;
          errorResponse.code = "UNIQUE_CONSTRAINT_VIOLATION";
          errorResponse.message = "Une entrée avec cette valeur existe déjà";
          break;
        case 'P2025':
          errorResponse.status = 404;
          errorResponse.code = "NOT_FOUND";
          errorResponse.message = "Ressource non trouvée";
          break;
        case 'P2003':
          errorResponse.status = 400;
          errorResponse.code = "FOREIGN_KEY_CONSTRAINT";
          errorResponse.message = "Violation de contrainte de clé étrangère";
          break;
      }

      res.status(errorResponse.status).json(errorResponse);
      return;
    }

    // Si c'est une erreur de validation Prisma
    if (err instanceof PrismaClientValidationError) {
      res.status(400).json({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Données invalides",
        details: err.message,
        path: req.path,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Pour toute autre erreur non gérée
    const errorResponse = {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Une erreur inattendue est survenue",
      path: req.path,
      timestamp: new Date().toISOString()
    };

    // En développement, on ajoute plus de détails
    if (config.server.nodeEnv === 'development') {
      Object.assign(errorResponse, {
        stack: err.stack,
        name: err.name,
        details: err.message
      });
    }

    res.status(500).json(errorResponse);
  }

  public static initialize(): void {
    process.on("unhandledRejection", (reason: Error) => {
      console.error("Unhandled Rejection:", {
        name: reason.name,
        message: reason.message,
        stack: reason.stack,
        timestamp: new Date().toISOString()
      });
    });

    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      process.exit(1);
    });
  }
}
