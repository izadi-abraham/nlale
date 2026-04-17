import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export const jwtPlugin = new Elysia({ name: "jwt" }).use(
  jwt({ name: "jwt", secret: JWT_SECRET, exp: "24h" })
);

export const authGuard = new Elysia({ name: "auth-guard" })
  .use(jwtPlugin)
  .onBeforeHandle({ as: "scoped" }, async ({ jwt, headers, set }) => {
    const auth = headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) { set.status = 401; return { message: "Unauthorized" }; }
    const payload = await jwt.verify(token);
    if (!payload) { set.status = 401; return { message: "Invalid token" }; }
  });

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .use(jwtPlugin)
  .post(
    "/login",
    async ({ body, jwt, set }) => {
      if (!ADMIN_PASSWORD) { set.status = 503; return { message: "Admin not configured" }; }
      const valid = await Bun.password.verify(body.password, ADMIN_PASSWORD);
      if (!valid) { set.status = 401; return { message: "Invalid password" }; }
      const token = await jwt.sign({ role: "admin" });
      return { token };
    },
    { body: t.Object({ password: t.String({ minLength: 1 }) }) }
  );
