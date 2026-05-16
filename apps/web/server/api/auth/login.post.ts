import { createAuthService } from "~/server/services/auth.service";
import { loginSchema } from "@mnp/shared";
import { setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authService = createAuthService({
    jwtSecret: config.jwtSecret as string,
    adminUsername: config.adminUsername as string,
    adminPassword: config.adminPassword as string
  });

  const { body } = await validate(event, { body: loginSchema });
  const { username, password } = body as any;

  const token = await authService.login(username, password);

  setCookie(event, "mnp_token", token, {
    httpOnly: true,
    secure: !process.dev,
    sameSite: "lax",
    maxAge: 3600,
    path: "/"
  });

  return {
    token,
    username
  };
});
