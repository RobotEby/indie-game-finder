const request = require('supertest');

jest.mock('../db/pool');
const pool = require('../db/pool');
const app = require('../server');

describe('/developers routes', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('GET /developers returns the list of developers', async () => {
    const fakeDevs = [{ id: 1, name: 'Nova Terra Studio', country: 'Brazil' }];
    pool.query.mockResolvedValueOnce([fakeDevs]);

    const res = await request(app).get('/developers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeDevs);
  });

  it('GET /developers/profile returns games with follower counts', async () => {
    const fakeProfile = [
      { developer: 'Nova Terra Studio', game: 'Iron Roots', followers: 2 },
    ];
    pool.query.mockResolvedValueOnce([fakeProfile]);

    const res = await request(app).get('/developers/profile');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeProfile);
  });

  it('GET /developers/:name/games filters by the name given in the URL', async () => {
    const fakeGames = [{ developer: 'Nova Terra Studio', game: 'Iron Roots' }];
    pool.query.mockResolvedValueOnce([fakeGames]);

    const res = await request(app).get('/developers/Nova%20Terra%20Studio/games');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeGames);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE d.name = ?'),
      ['Nova Terra Studio']
    );
  });

  it('returns status 500 when the profile query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('database error'));

    const res = await request(app).get('/developers/profile');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch developer profiles');
  });
});
