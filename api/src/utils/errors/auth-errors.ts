import { AppError } from "./app-error";

export class AuthentificationError extends AppError {
  constructor(message = "Authentification requise", code = "AUTH_REQUIRED") {
    super(message, 401, code);
  }
}

export class InvalidCredentialsError extends AuthentificationError {
  constructor() {
    super("Email ou mot de passe incorrect", "INVALID_CREDENTIALS");
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(
      `L'utilisateur avec l'email ${email} existe déjà`,
      409,
      "USER_ALREADY_EXISTS"
    );
  }
}

export class UserNotFoundError extends AppError {
  constructor(identifier: string) {
    super(
      `Utilisateur non trouvé: ${identifier}`,
      404,
      "USER_NOT_FOUND"
    );
  }
}

export class NotFoundError extends AppError {
  constructor(ressourceName: string, identifier: string) {
    super(
      `${ressourceName} non trouvé: ${identifier}`,
      404,
      "RESOURCE_NOT_FOUND"
    );
  }
}

export class TokenExpiredError extends AuthentificationError {
  constructor() {
    super("Le token a expiré", "TOKEN_EXPIRED");
  }
}

export class InvalidTokenError extends AuthentificationError {
  constructor() {
    super("Token invalide", "INVALID_TOKEN");
  }
}
