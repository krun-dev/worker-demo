# krun worker-demo

A dependency-free Workers demo: hand-rolled router, middleware composition,
layered handlers, and typed responses — pure Web APIs, no bindings and no
npm dependencies. Built to exercise the krun builder (relative TS imports,
multi-file bundles).

Routes:
- `GET /health` — liveness with isolate uptime
- `GET|POST /echo/*` — echoes method/path/params/query
- `POST /sha256` — SHA-256 hex digest of the request body
- `GET|POST /todos`, `PATCH|DELETE /todos/:id` — in-memory CRUD
