import { AppError } from "./app-error";

export class AuthentificationError extends AppError {
  constructor(message = "Authentification requise") {
    super(message, 401);
  }
}

export class InvalidCredentialsError extends AuthentificationError {
  constructor() {
    super("Authentication failed");
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 409);
  }
}

export class UserNotFoundError extends AppError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, 404);
  }
}

export class NotFoundError extends AppError {
  constructor(ressourceName: string, identifier: string) {
    super(`${ressourceName} not found: ${identifier}`, 404);
  }
}

export class TokenExpiredError extends AuthentificationError {
  constructor() {
    super("Token has expired");
  }
}

export class InvalidTokenError extends AuthentificationError {
  constructor() {
    super("Token not valid");
  }
}
