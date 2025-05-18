import { AppError } from "./app-error";

export class InvalidUploadCredentialsError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "INVALID_UPLOAD_CREDENTIALS"
    );
  }
}

export class CloudinaryDeleteError extends AppError {
  constructor(message: string) {
    super(
      message,
      500,
      "CLOUDINARY_DELETE_ERROR"
    );
  }
}

export class CloudinaryTransformError extends AppError {
  constructor(message: string) {
    super(
      message,
      500,
      "CLOUDINARY_TRANSFORM_ERROR"
    );
  }
}

export class CloudinaryInvalidFormatError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "CLOUDINARY_INVALID_FORMAT"
    );
  }
}

export class CloudinaryUploadError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "CLOUDINARY_UPLOAD_ERROR"
    );
  }
}

export class CloudinaryConfigError extends AppError {
  constructor(message: string) {
    super(
      message,
      500,
      "CLOUDINARY_CONFIG_ERROR"
    );
  }
}

export class CloudinaryInvalidFileError extends AppError {
  constructor(message: string) {
    super(
      message,
      400,
      "CLOUDINARY_INVALID_FILE"
    );
  }
}

export class CloudinaryServiceError extends AppError {
  constructor(message: string) {
    super(
      message,
      500,
      "CLOUDINARY_SERVICE_ERROR"
    );
  }
}
