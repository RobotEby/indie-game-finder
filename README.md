# indie-game-finder

Read this in: **English** | [Português (Brasil)](README.pt-BR.md)

Indie game discovery hub: a REST API in Node.js/Express for exploring a game catalog, developer profiles, and player activity stored in MySQL.

## What it is

Most big game stores push the same AAA titles to the top. indie-game-finder exists to give visibility to independent studios. Its data model records developer follows and play history, and the API provides read-only access to catalog information, follower counts, and player activity statistics.

## Features

- Game catalog with genre, release year, and developer information
- Developer profiles with all published games and follower counts
- Game counts and total playtime per player, plus library size by player name
- Top two games ranked by player reach across the entire play history
- Subscription plans (Free, Plus, Pro) with aggregate revenue statistics

## Data model

| Table            | Description                                                              |
|-------------------|---------------------------------------------------------------------------|
| `plans`           | Subscription plans and their prices                                     |
| `players`         | Platform users; each with one active plan                               |
| `developers`      | Registered indie studios                                                |
| `games`           | Game catalog, each linked to a primary developer                        |
| `game_sessions`   | One row per play session (player, game, date, minutes); a player can play a game many times |
| `followers`       | Players following developers                                            |

Scripts live in `database/schema.sql` (table structure) and `database/seed.sql` (sample data for local development). Metrics such as `games_played`, `games_in_library` and `players_reached` count **distinct** games/players, not session rows. If your database was created before `game_sessions` allowed repeat sessions, apply `database/migrations/001-game-sessions-multiple-sessions.sql` (MySQL 8.0.16+).

## Supporting queries

`database/queries/` contains standalone SQL queries for platform stats, player activity, all-time trending games, aggregate subscription revenue, developer profiles, catalog by studio, player library size, reach among Free and Plus players, and suggested special edition titles. A historical status query classifies players according to whether their latest recorded activity occurred in 2023. The API implements the subset of queries listed below.

## API

| Route                                  | Description                                              |
|-----------------------------------------|-----------------------------------------------------------|
| `GET /plans`                           | List available plans                                     |
| `GET /developers`                      | List developers                                          |
| `GET /developers/profile`              | Games + follower count per developer                     |
| `GET /developers/:name/games`          | Catalog of a specific developer                           |
| `GET /games`                           | List all games, including genre and release year          |
| `GET /games/trending`                  | Top two games by player reach across all recorded history |
| `GET /players`                         | List players                                              |
| `GET /players/activity`                | Game counts and total minutes played per player           |
| `GET /players/:name/library`           | Game count for the given player name (`games_in_library`) |
| `GET /stats/general`                   | Overall platform numbers                                  |
| `GET /stats/revenue`                   | Minimum, maximum, average, and total subscription revenue |

`GET /games` returns the full catalog without genre or release-year filters. Revenue statistics aggregate the prices of all players' plans into a single result.

### Getting started

1. Create the database. **`database/schema.sql` drops and recreates `indieGameFinder`, deleting any existing data in that database.**
   ```sh
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```

2. Set up the API:
   ```sh
   cd api
   cp .env.example .env   # edit with your MySQL credentials; DB_NAME=indieGameFinder
   npm install
   npm start
   ```

3. The API runs at `http://localhost:3333` by default.

## Tests

All routes have route tests with Jest + Supertest, using a mock of the connection pool (`db/__mocks__/pool.js`) — the suite runs without needing a real MySQL instance.

```sh
cd api
npm install
npm test
```

A second suite runs the real routes against a real MySQL 8.0.16+ server, loading `database/schema.sql` and `database/seed.sql` first, so SQL the mock cannot validate (strict `GROUP BY`, `CHECK` and foreign-key rules, aggregate results) is covered. **It drops and recreates `indieGameFinder`, so use a disposable server**; it refuses to run unless `RUN_DB_INTEGRATION=1` is set.

```sh
cd api
RUN_DB_INTEGRATION=1 npm run test:integration   # uses DB_HOST / DB_USER / DB_PASSWORD
```

GitHub Actions (`.github/workflows/ci.yml`) runs the mocked suite on Node 20 and 22 and the MySQL suite against a `mysql:8.0` service container on every push to `main` and every pull request.

## Roadmap

- Versioned migrations (Knex or Prisma)
- Player authentication
- API documentation with OpenAPI/Swagger
- Web UI for browsing the catalog
