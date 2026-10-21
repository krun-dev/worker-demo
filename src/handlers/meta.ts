import { json } from "../utils/http";
import type { RouteContext } from "../types";

export function health(): Response {
  return json({ status: "ok", uptimeSeconds: Math.round(performance.now() / 1000) });
}

export function echo(request: Request, ctx: RouteContext): Response {
  return json({
    method: request.method,
    path: ctx.url.pathname,
    params: ctx.params,
    query: Object.fromEntries(ctx.url.searchParams),
  });
}

export async function sha256(request: Request): Promise<Response> {
  const digest = await crypto.subtle.digest("SHA-256", await request.arrayBuffer());
  return json({ sha256: [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("") });
}
