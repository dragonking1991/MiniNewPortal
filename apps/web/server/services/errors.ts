export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const msg = identifier ? `${resource} not found: ${identifier}` : `${resource} not found`;
    super("NOT_FOUND", msg, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super("CONFLICT", message, 409, details);
    this.name = "ConflictError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super("VALIDATION_ERROR", message, 400, details);
    this.name = "ValidationError";
  }
}

export class CategoryHasNewsError extends AppError {
  constructor(categoryId: number, newsCount: number) {
    super("CATEGORY_HAS_NEWS", `Cannot delete category with ${newsCount} news item(s)`, 409, {
      categoryId,
      newsCount
    });
    this.name = "CategoryHasNewsError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Invalid credentials") {
    super("AUTHENTICATION_ERROR", message, 401);
    this.name = "AuthenticationError";
  }
}
