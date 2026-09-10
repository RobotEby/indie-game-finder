const request = require('supertest');

jest.mock('../db/pool');
const pool = require('../db/pool');
const app = require('../server');

describe('/stats routes', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('GET /stats/general returns totals for games, developers and genres', async () => {
    const fakeGeneral = { games: 7, developers: 5, genres: 5 };
    pool.query.mockResolvedValueOnce([[fakeGeneral]]);

    const res = await request(app).get('/stats/general');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeGeneral);
  });

  it('GET /stats/revenue returns aggregated plan values', async () => {
    const fakeRevenue = {
      min_revenue: '0.00',
      max_revenue: '29.90',
      avg_revenue: '13.94',
      total_revenue: '69.70',
    };
    pool.query.mockResolvedValueOnce([[fakeRevenue]]);

    const res = await request(app).get('/stats/revenue');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeRevenue);
  });

  it('returns status 500 when the revenue query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('timeout'));

    const res = await request(app).get('/stats/revenue');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch revenue stats');
  });
});
