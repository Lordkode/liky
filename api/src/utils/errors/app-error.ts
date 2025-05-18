export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly timestamp: string;
  public readonly path?: string;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    path?: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    this.path = path;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: this.statusCode,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      path: this.path,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }
}