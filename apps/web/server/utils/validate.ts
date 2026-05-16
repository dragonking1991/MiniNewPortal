import { z, ZodSchema } from "zod";
import { H3Event, readBody, getQuery, getRouterParams } from "h3";
import { ValidationError } from "../services/errors";

type ValidationTarget = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export async function validate(
  event: H3Event,
  schemas: ValidationTarget
): Promise<{
  body?: unknown;
  query?: unknown;
  params?: unknown;
}> {
  const result: { body?: unknown; query?: unknown; params?: unknown } = {};
  const errors: Record<string, Record<string, string[]>> = {};

  if (schemas.body) {
    try {
      const body = await readBody(event);
      result.body = schemas.body.parse(body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.body = err.flatten().fieldErrors as Record<string, string[]>;
      }
    }
  }

  if (schemas.query) {
    try {
      const query = getQuery(event);
      result.query = schemas.query.parse(query);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.query = err.flatten().fieldErrors as Record<string, string[]>;
      }
    }
  }

  if (schemas.params) {
    try {
      const params = getRouterParams(event);
      result.params = schemas.params.parse(params);
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.params = err.flatten().fieldErrors as Record<string, string[]>;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }

  return result;
}
