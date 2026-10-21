import { Router } from "./router";
import { withLogging } from "./middleware/logging";
import { health, echo, sha256 } from "./handlers/meta";
import { listTodos, createTodo, updateTodo, deleteTodo } from "./handlers/todos";

const router = new Router()
  .get("/health", health)
  .get("/echo/*", (request, ctx) => echo(request, ctx))
  .post("/echo/*", (request, ctx) => echo(request, ctx))
  .post("/sha256", (request) => sha256(request))
  .get("/todos", listTodos)
  .post("/todos", createTodo)
  .patch("/todos/:id", updateTodo)
  .delete("/todos/:id", deleteTodo);

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const matched = router.match(request.method, url.pathname);
    if (!matched) {
      return new Response(JSON.stringify({ error: "not found", path: url.pathname }), {
        status: 404,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
    return withLogging(matched.handler)(request, { params: matched.params, url } as never);
  },
};
