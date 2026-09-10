const request = require('supertest');

jest.mock('../db/pool');
const app = require('../server');

describe('GET /', () => {
  it('returns the service status', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'IndieGameFinder API' });
  });
});
