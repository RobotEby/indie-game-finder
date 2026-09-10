const request = require('supertest');

jest.mock('../db/pool');
const pool = require('../db/pool');
const app = require('../server');

describe('/players routes', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('GET /players returns the list of players with the expected fields', async () => {
    const fakePlayers = [{ id: 1, name: 'Alice', email: 'alice@.com', plan_id: 2 }];
    pool.query.mockResolvedValueOnce([fakePlayers]);

    const res = await request(app).get('/players');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakePlayers);
  });

  it('GET /players/activity aggregates games and minutes per player', async () => {
    const fakeActivity = [{ player: 'Alice', games_played: 3, total_minutes: 870 }];
    pool.query.mockResolvedValueOnce([fakeActivity]);

    const res = await request(app).get('/players/activity');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeActivity);
  });

  it('GET /players/:name/library returns the count for the given player', async () => {
    pool.query.mockResolvedValueOnce([[{ games_in_library: 3 }]]);

    const res = await request(app).get('/players/Alice/library');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ games_in_library: 3 });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['Alice']);
  });
});
