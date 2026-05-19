import { H3Event, setHeader, setResponseStatus } from "h3";
import { z } from "zod";
import { AppError } from "../services/errors";

export default defineEventHandler(async (event: H3Event) => {
  try {
    await event._handled;
  } catch (error) {
    setHeader(event, "Content-Type", "application/json");

    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      const errorResponse: any = {
        error: {
          code: error.code,
          message: error.message
        }
      };

      if (error.details) {
        errorResponse.error.details = error.details;
      }

      return errorResponse;
    }

    if (error instanceof z.ZodError) {
      setResponseStatus(event, 400);
      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.issues.map((issue) => ({
            field: issue.path.join(".") || "_root",
            message: issue.message
          }))
        }
      };
    }

    // Generic error handling
    console.error("[API Error]", error);

    setResponseStatus(event, 500);
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred"
      }
    };
  }
});
