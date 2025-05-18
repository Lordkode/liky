import { AppError } from "./app-error";

export class PostNotFoundError extends AppError {
  constructor(id: string) {
    super(
      `Post non trouvé: ${id}`,
      404,
      "POST_NOT_FOUND"
    );
  }
}

export class InvalidPostDataError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "INVALID_POST_DATA"
    );
  }
}

export class PostCreationError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "POST_CREATION_ERROR"
    );
  }
}

export class UnsupportedFileTypeError extends AppError {
  constructor() {
    super(
      "Type de fichier non supporté",
      400,
      "UNSUPPORTED_FILE_TYPE"
    );
  }
} 