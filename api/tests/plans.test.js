const request = require('supertest');

jest.mock('../db/pool');
const pool = require('../db/pool');
const app = require('../server');

describe('GET /plans', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it('returns the list of plans with status 200', async () => {
    const fakePlans = [
      { id: 1, name: 'Free', price: '0.00' },
      { id: 2, name: 'Plus', price: '14.90' },
    ];
    pool.query.mockResolvedValueOnce([fakePlans]);

    const res = await request(app).get('/plans');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakePlans);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM plans');
  });

  it('returns status 500 when the query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('connection lost'));

    const res = await request(app).get('/plans');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch plans');
  });
});
