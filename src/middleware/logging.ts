// Wraps a handler with structured request logging; demonstrates cross-cutting
// composition without frameworks.
export function withLogging(handler: (request: Request, ctx: never) => unknown) {
  return async (request: Request, ctx: never) => {
    const started = Date.now();
    const response = (await handler(request, ctx)) as Response;
    console.log(JSON.stringify({
      method: request.method,
      path: new URL(request.url).pathname,
      status: response.status,
      ms: Date.now() - started,
    }));
    return response;
  };
}
