import { AppError } from "./app-error";

export class AuthentificationError extends AppError {
  constructor(message = "Authautentification faild !") {
    super(message, 401);
  }
}

export class InvalidCredentialsError extends AuthentificationError {
  constructor() {
    super("Email or password is incorrect !");
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`User with email ${email} already exist !`, 409);
  }
}

export class UserNotFoundError extends AppError {
  constructor(identifier: string) {
    super(`User not found : ${identifier}`, 404);
  }
}

export class TokenExpiredError extends AuthentificationError {
  constructor() {
    super("Token has expired !");
  }
}

export class InvalidTokenError extends AuthentificationError {
  constructor() {
    super("Authentification token is not valide");
  }
}
