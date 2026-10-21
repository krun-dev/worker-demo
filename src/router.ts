import type { Handler, Route } from "./types";

// Minimal path-pattern router: supports ":param" segments and a trailing
// wildcard "*". Kept dependency-free on purpose.
export class Router {
  private routes: Route[] = [];

  add(method: string, pattern: string, handler: Handler): this {
    this.routes.push({ method, pattern, handler });
    return this;
  }

  get(pattern: string, handler: Handler): this {
    return this.add("GET", pattern, handler);
  }

  post(pattern: string, handler: Handler): this {
    return this.add("POST", pattern, handler);
  }

  patch(pattern: string, handler: Handler): this {
    return this.add("PATCH", pattern, handler);
  }

  delete(pattern: string, handler: Handler): this {
    return this.add("DELETE", pattern, handler);
  }

  match(method: string, pathname: string): { handler: Handler; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const params = matchPattern(route.pattern, pathname);
      if (params) return { handler: route.handler, params };
    }
    return null;
  }
}

function matchPattern(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part === "*") return params;
    if (part.startsWith(":")) {
      if (i >= pathParts.length) return null;
      params[part.slice(1)] = decodeURIComponent(pathParts[i]);
      continue;
    }
    if (pathParts[i] !== part) return null;
  }
  return pathParts.length === patternParts.length ? params : null;
}
