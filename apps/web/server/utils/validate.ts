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
  const details: Array<{ field: string; message: string }> = [];

  function collectIssues(source: "body" | "query" | "params", err: z.ZodError) {
    for (const issue of err.issues) {
      const path = issue.path.length ? issue.path.join(".") : "_root";
      details.push({
        field: `${source}.${path}`,
        message: issue.message
      });
    }
  }

  if (schemas.body) {
    try {
      const body = await readBody(event);
      result.body = schemas.body.parse(body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        collectIssues("body", err);
      }
    }
  }

  if (schemas.query) {
    try {
      const query = getQuery(event);
      result.query = schemas.query.parse(query);
    } catch (err) {
      if (err instanceof z.ZodError) {
        collectIssues("query", err);
      }
    }
  }

  if (schemas.params) {
    try {
      const params = getRouterParams(event);
      result.params = schemas.params.parse(params);
    } catch (err) {
      if (err instanceof z.ZodError) {
        collectIssues("params", err);
      }
    }
  }

  if (details.length > 0) {
    throw new ValidationError("Validation failed", details);
  }

  return result;
}
