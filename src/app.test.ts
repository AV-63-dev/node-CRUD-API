import request from "supertest";
import app from './app';

const server = request(app);

describe('Scenario', () => {

  it('get', async () => {
    const response = await server.get('/api/users');
    expect(response.statusCode).toBe(200)
  });

  it('get', async () => {
    const response = await server.get('/api/users');
    expect(response.statusCode).toBe(200)
  });

  it('get', async () => {
    const response = await server.get('/api/users');
    expect(response.statusCode).toBe(200)
  });

  app.close();
});