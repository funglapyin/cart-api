# Shopping Cart API

A RESTful shopping cart API built with Node.js, Express, and TypeScript.

---

## Local Running Instructions

```bash
npm install
npm run dev
npm run build
npm start
```

Server runs on `http://localhost:3000`. Override with `PORT=3001 npm run dev`.

**Endpoints:**

| Method   | Path                              | Description                           |
| -------- | --------------------------------- | ------------------------------------- |
| `GET`    | `/health`                         | Health check                          |
| `POST`   | `/carts`                          | Create a new cart                     |
| `GET`    | `/carts/:cartId`                  | Get cart with total                   |
| `POST`   | `/carts/:cartId/items`            | Add item (merges if productId exists) |
| `PATCH`  | `/carts/:cartId/items/:productId` | Update item quantity                  |
| `DELETE` | `/carts/:cartId/items/:productId` | Remove item                           |
| `DELETE` | `/carts/:cartId`                  | Delete cart                           |

**Example — add an item:**

```bash
curl -X POST http://localhost:3000/carts/{cartId}/items \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2,"pricing":{"unitPrice":1099},"metadata":{"name":"Pasta Kit"}}'
```

`unitPrice` in pence — `1099` = £10.99.

---

## Design Decisions

- **Layered structure** — `router → controller → service → repository`. Each layer has one job. The service has no HTTP knowledge so it can be called from a CLI or queue worker. Swapping the DB only touches the repository file.
- **`unitPrice` locked at add-time** — prevents cart total from silently changing if the product price updates mid-session.
- **`metadata.name` / `imageUrl` denormalised** — copied from the product at add-time so the cart stays readable if the product is later renamed or deleted. Values can go stale mid-session — acceptable for a cart, intentional for order history.
- **`POST /carts` explicit creation** — simplification for this scope. In production, carts are created implicitly when the first item is added, resolved server-side via session.
- **`204` on delete** — no body to return. `200` implies a response body exists.
- **`unitPrice` in pence** — avoids floating-point rounding errors on totals.

---

## Trade-offs

- **No currency field** — mixed-currency totals are possible. Production: `currency` on the `Cart`, set on first item add, validated on every subsequent add.
- **Error handling inline** — `handleError` lives in each controller. Production: Express error middleware

---

## What I'd Improve With More Time

- Express error middleware with an `AppError` base class carrying `statusCode`
- Zod validation on request bodies
- PostgreSQL + Prisma for persistence
- Session-based cart resolution — remove `cartId` from the URL
- Cart expiry (TTL) and checkout lifecycle
- Auth — JWT or session linking cart to a user
- Service-layer unit tests: quantity merging, validation rules, total calculation
- Supertest integration tests per endpoint
