const request = require('supertest');

jest.mock('../db/pool');
const pool = require('../db/pool');
const app = require('../server');

describe('/games routes', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('GET /games returns the full list of games', async () => {
    const fakeGames = [
      { id: 1, title: 'Iron Roots', genre: 'RPG', release_year: 2022, developer_id: 1 },
    ];
    pool.query.mockResolvedValueOnce([fakeGames]);

    const res = await request(app).get('/games');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeGames);
  });

  it('GET /games/trending returns at most the top trending games', async () => {
    const fakeTrending = [
      { game: 'Iron Roots', players_reached: 2 },
      { game: 'Last Lantern', players_reached: 2 },
    ];
    pool.query.mockResolvedValueOnce([fakeTrending]);

    const res = await request(app).get('/games/trending');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeTrending);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('LIMIT 2'));
  });
});
