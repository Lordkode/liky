import { AppError } from "./app-error";

export class InvalidUploadCredentialsError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class CloudinaryDeleteError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class CloudinaryTransformError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class CloudinaryInvalidFormatError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class CloudinaryUploadError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}
