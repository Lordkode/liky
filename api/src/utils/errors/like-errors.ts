import { AppError } from "./app-error";

export class LikeNotFoundError extends AppError {
  constructor(id: string) {
    super(
      `Like non trouvé: ${id}`,
      404,
      "LIKE_NOT_FOUND"
    );
  }
}

export class LikeAlreadyExistsError extends AppError {
  constructor(userId: string, imageId: string) {
    super(
      `L'utilisateur ${userId} a déjà liké l'image ${imageId}`,
      409,
      "LIKE_ALREADY_EXISTS"
    );
  }
}

export class LikeCreationError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "LIKE_CREATION_ERROR"
    );
  }
}

export class LikeDeletionError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "LIKE_DELETION_ERROR"
    );
  }
} 