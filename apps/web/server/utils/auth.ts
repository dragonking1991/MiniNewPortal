import { H3Event, getCookie, getHeader } from "h3";
import { createAuthService } from "../services/auth.service";
import { AuthenticationError } from "../services/errors";

let authService: ReturnType<typeof createAuthService> | null = null;

function getAuthService(event: H3Event) {
  if (!authService) {
    const config = useRuntimeConfig();
    const jwtSecret = config.jwtSecret as string;
    const adminUsername = config.adminUsername as string;
    const adminPassword = config.adminPassword as string;

    if (!jwtSecret || !adminUsername || !adminPassword) {
      throw new Error("Missing required auth config: JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD");
    }

    authService = createAuthService({ jwtSecret, adminUsername, adminPassword });
  }

  return authService;
}

export async function requireAdmin(event: H3Event): Promise<{ username: string }> {
  // Try to get token from Authorization header or cookie
  const authHeader = getHeader(event, "authorization");
  const cookieToken = getCookie(event, "mnp_token");

  const token = authHeader?.replace(/^Bearer\s+/, "") || cookieToken;

  if (!token) {
    throw new AuthenticationError("Missing authentication token");
  }

  const authSvc = getAuthService(event);
  const payload = await authSvc.verifyToken(token);

  if (!payload) {
    throw new AuthenticationError("Invalid or expired token");
  }

  return { username: payload.username };
}
