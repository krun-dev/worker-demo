export type RouteContext = {
  params: Record<string, string>;
  url: URL;
};

export type Handler = (
  request: Request,
  ctx: RouteContext,
) => Promise<Response> | Response;

export type Route = {
  method: string;
  pattern: string;
  handler: Handler;
};

export type Todo = {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
};
