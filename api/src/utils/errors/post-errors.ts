import { AppError } from "./app-error";

export class PostNotFoundError extends AppError {
  constructor(id: string) {
    super(`Post not found: ${id}`, 404);
  }
}

export class InvalidPostDataError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class PostCreationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnsupportedFileTypeError extends AppError {
  constructor() {
    super("Unsupported file type", 400);
  }
} 