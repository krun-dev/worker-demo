import { json, error } from "../utils/http";
import type { RouteContext, Todo } from "../types";

// In-memory store: the demo worker has no bindings by design, so state lives
// for the lifetime of the isolate.
let nextId = 1;
const todos = new Map<number, Todo>();

export async function listTodos(_request: Request, _ctx: RouteContext): Promise<Response> {
  return json({ items: [...todos.values()] });
}

export async function createTodo(request: Request, _ctx: RouteContext): Promise<Response> {
  const body = await request.json<{ title?: string }>().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return error("title is required", 422);
  }
  const todo: Todo = { id: nextId++, title: body.title.trim(), done: false, createdAt: new Date().toISOString() };
  todos.set(todo.id, todo);
  return json(todo, 201);
}

export async function updateTodo(_request: Request, ctx: RouteContext): Promise<Response> {
  const id = Number(ctx.params.id);
  const todo = todos.get(id);
  if (!todo) return error("todo not found", 404);
  todo.done = !todo.done;
  return json(todo);
}

export async function deleteTodo(_request: Request, ctx: RouteContext): Promise<Response> {
  const id = Number(ctx.params.id);
  if (!todos.delete(id)) return error("todo not found", 404);
  return new Response(null, { status: 204 });
}
