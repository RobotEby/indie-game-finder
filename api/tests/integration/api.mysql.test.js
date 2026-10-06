// Runs the real routes against the real schema and seed in MySQL, so SQL that
// only the real server can reject (ONLY_FULL_GROUP_BY, CHECK, FK/index rules)
// is exercised. Expected values are derived from database/seed.sql.
const request = require('supertest');
const pool = require('../../db/pool');
const app = require('../../server');

afterAll(async () => {
  await pool.end();
});

const get = (url) => request(app).get(url);

describe('catalog and stats routes (real MySQL)', () => {
  it('GET /stats/general counts games, developers and distinct genres', async () => {
    const res = await get('/stats/general');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ games: 7, developers: 5, genres: 5 });
  });

  it('GET /stats/revenue aggregates the plan price of every player', async () => {
    const res = await get('/stats/revenue');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      min_revenue: '0.00',
      max_revenue: '29.90',
      avg_revenue: '11.94',
      total_revenue: '59.70',
    });
  });

  it('GET /plans, /developers, /games and /players return the seeded rows', async () => {
    const counts = {};
    for (const url of ['/plans', '/developers', '/games', '/players']) {
      const res = await get(url);
      expect(res.status).toBe(200);
      counts[url] = res.body.length;
    }
    expect(counts).toEqual({ '/plans': 3, '/developers': 5, '/games': 7, '/players': 5 });
  });

  it('GET /developers/profile orders by followers, then developer and game', async () => {
    const res = await get('/developers/profile');
    expect(res.status).toBe(200);
    expect(res.body.map((r) => [r.developer, r.game, Number(r.followers)])).toEqual([
      ['Nova Terra Studio', 'Iron Roots', 3],
      ['Nova Terra Studio', 'Iron Roots II', 3],
      ['Pixel Marmot', 'Lost Orbit', 2],
      ['Pixel Marmot', 'Space Marmot', 2],
      ['Lantern Games', 'Last Lantern', 1],
      ['Quiet Harbor Games', 'Silent Harbor', 1],
      ['Rustbelt Interactive', 'City of Ashes', 1],
    ]);
  });

  it('GET /developers/:name/games lists only that developer\'s games', async () => {
    const res = await get('/developers/Pixel%20Marmot/games');
    expect(res.status).toBe(200);
    expect(res.body.map((r) => r.game)).toEqual(['Lost Orbit', 'Space Marmot']);
  });
});

describe('game_sessions routes (real MySQL)', () => {
  it('GET /players/activity counts distinct games and sums minutes', async () => {
    const res = await get('/players/activity');
    expect(res.status).toBe(200);
    expect(res.body.map((r) => [r.player, Number(r.games_played), Number(r.total_minutes)])).toEqual(
      [
        ['Alice', 3, 960],
        ['Bruno', 2, 150],
        ['Carla', 3, 1270],
        ['Diego', 1, 45],
        ['Elis', 3, 665],
      ],
    );
  });

  it('GET /players/:name/library counts distinct games, not sessions', async () => {
    // Alice has 4 session rows but 3 different games
    const res = await get('/players/Alice/library');
    expect(res.status).toBe(200);
    expect(Number(res.body.games_in_library)).toBe(3);
  });

  it('GET /games/trending counts distinct players, not sessions', async () => {
    // Iron Roots has 4 session rows from 2 players; Iron Roots II has 4 from 3
    const res = await get('/games/trending');
    expect(res.status).toBe(200);
    expect(res.body.map((r) => [r.game, Number(r.players_reached)])).toEqual([
      ['Iron Roots II', 3],
      ['Iron Roots', 2],
    ]);
  });

  describe('a new session of a game the player already played', () => {
    let insertedId;

    beforeAll(async () => {
      const [result] = await pool.query(
        "INSERT INTO game_sessions (player_id, game_id, session_date, minutes_played) VALUES (2, 2, '2023-10-10', 45)",
      );
      insertedId = result.insertId;
    });

    afterAll(async () => {
      await pool.query('DELETE FROM game_sessions WHERE id = ?', [insertedId]);
    });

    it('is accepted and adds minutes without adding a game', async () => {
      const activity = (await get('/players/activity')).body.find((r) => r.player === 'Bruno');
      expect(Number(activity.games_played)).toBe(2);
      expect(Number(activity.total_minutes)).toBe(195);

      const library = (await get('/players/Bruno/library')).body;
      expect(Number(library.games_in_library)).toBe(2);
    });
  });
});

describe('game_sessions schema constraints (real MySQL)', () => {
  it('has no unique key on (player_id, game_id)', async () => {
    const [indexes] = await pool.query('SHOW INDEX FROM game_sessions');
    const uniqueKeys = new Set(indexes.filter((i) => i.Non_unique === 0).map((i) => i.Key_name));
    expect([...uniqueKeys]).toEqual(['PRIMARY']);
  });

  it('rejects a session with zero minutes', async () => {
    await expect(
      pool.query(
        "INSERT INTO game_sessions (player_id, game_id, session_date, minutes_played) VALUES (1, 1, '2023-11-01', 0)",
      ),
    ).rejects.toMatchObject({ code: 'ER_CHECK_CONSTRAINT_VIOLATED' });
  });

  it('rejects a session for a player that does not exist', async () => {
    await expect(
      pool.query(
        "INSERT INTO game_sessions (player_id, game_id, session_date, minutes_played) VALUES (999, 1, '2023-11-01', 10)",
      ),
    ).rejects.toMatchObject({ code: 'ER_NO_REFERENCED_ROW_2' });
  });
});
