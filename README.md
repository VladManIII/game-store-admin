# GameStore Admin

A small full-stack admin panel for managing a video game catalog.

<!-- TODO: add a screenshot of the Games list here -->

## Tech stack

| Layer   | Technology                                                              |
| ------- | ----------------------------------------------------------------------- |
| Client  | Vue 3 (`<script setup>`), TypeScript, Vite, Tailwind CSS, Vue Router    |
| API     | ASP.NET Core Minimal APIs (.NET 10), Entity Framework Core, SQLite      |
| Testing | Vitest + Vue Test Utils (client), xUnit + `WebApplicationFactory` (API) |

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8 / rolldown — older Node 20.x releases will fail to run Vite)

### Run the API

```bash
cd GameStore.Api
dotnet run
```

Serves on `http://localhost:5285`. On first run in the `Development` environment, the database is created, migrated, and seeded automatically with sample genres and games. An interactive API reference (Scalar) is available at `http://localhost:5285/scalar/v1` in Development only.

### Run the client

```bash
cd GameStore.Client
npm install
npm run dev
```

Serves on `http://localhost:5173` and proxies `/api/*` requests to the API at `http://localhost:5285` (see `vite.config.js`). The app has two routes, `/games` and `/genres`, reachable from the nav bar.

## Tests

```bash
# API tests (xUnit)
cd GameStore.Api.Tests
dotnet test

# Client tests (Vitest)
cd GameStore.Client
npm test
```

## Architecture notes

- **No repository/service layer in the API.** Minimal API endpoints (`Endpoints/GamesEndpoints.cs`, `Endpoints/GenreEndpoints.cs`) talk to `GameStoreContext` (EF Core) directly. This is a deliberate simplicity trade-off for a project of this size, not an oversight.
- **DTOs are separate from EF entities** (`Dtos/`) — the API never serializes EF models directly.
- **Validation** is handled by .NET 10's built-in automatic minimal-API validation (`AddValidation()` + `DataAnnotations` on the request DTOs) — no third-party validation library needed.
- **Genres are read-only** in both the API (`GET /genres` only) and the client — there's currently no use case for creating/editing genres from the admin UI, so no CRUD endpoints or screens were built for them.
- **Migrations/seeding and the OpenAPI/Scalar UI only run automatically in the `Development` environment.** A production deployment would apply migrations as an explicit, separate step.

## License

MIT — see [LICENSE](LICENSE).
