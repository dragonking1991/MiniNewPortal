import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "crypto";
import { AuthenticationError } from "./errors";

type JWTPayload = {
  username: string;
  iat: number;
  exp: number;
};

function constantTimeCompare(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export const createAuthService = (config: { jwtSecret: string; adminUsername: string; adminPassword: string }) => ({
  async login(username: string, password: string): Promise<string> {
    const usernameMatch = constantTimeCompare(username, config.adminUsername);
    const passwordMatch = constantTimeCompare(password, config.adminPassword);

    if (!usernameMatch || !passwordMatch) {
      throw new AuthenticationError();
    }

    const secret = new TextEncoder().encode(config.jwtSecret);
    const now = Math.floor(Date.now() / 1000);

    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(now)
      .setExpirationTime(now + 3600) // 1 hour
      .sign(secret);

    return token;
  },

  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const secret = new TextEncoder().encode(config.jwtSecret);
      const verified = await jwtVerify(token, secret);
      return verified.payload as JWTPayload;
    } catch {
      return null;
    }
  }
});
