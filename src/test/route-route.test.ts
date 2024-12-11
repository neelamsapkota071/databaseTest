import request from 'supertest';
import { setupTestDataSource } from '../test-utils';
import { DataSource } from 'typeorm';
import app  from '../test';
import { createServer, Server } from 'http';

let new_server: Server;

let AppDataSource: DataSource;

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
  new_server = app.listen(3001)
});

afterAll(async () => {
  if (AppDataSource) {
    await AppDataSource.destroy();
  }
  new_server.close()
});

describe('Route API Routes', () => {
  test('GET /routes should return an empty array initially', async () => {
    const response = await request(app).get('/routes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /routes should create a new route', async () => {
    const response = await request(app)
      .post('/routes')
      .send({
        origin: 'Kathmandu',
        destination: 'Bhaktapur',
      });

    expect(response.status).toBe(201);
    expect(response.body.origin).toBe('Kathmandu');
    expect(response.body.destination).toBe('Bhaktapur');
  });

  test('GET /routes should return the created route', async () => {
    const response = await request(app).get('/routes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].origin).toBe('Kathmandu');
  });

  test('GET /routes/:routeId should return a specific route', async () => {
    const routesResponse = await request(app).get('/routes');
    const routeId = routesResponse.body[0].routeId;

    const response = await request(app).get(`/routes/${routeId}`);
    expect(response.status).toBe(200);
    expect(response.body.routeId).toBe(routeId);
    expect(response.body.origin).toBe('Kathmandu');
  });

  test('PUT /routes/:routeId should update a route', async () => {
    const routesResponse = await request(app).get('/routes');
    const routeId = routesResponse.body[0].routeId;

    const response = await request(app)
      .put(`/routes/${routeId}`)
      .send({
        origin: 'Lalitpur',
        destination: 'Kupondole',
      });

    expect(response.status).toBe(200);
    expect(response.body.origin).toBe('Lalitpur');
    expect(response.body.destination).toBe('Kupondole');
  });

  test('DELETE /routes/:routeId should delete a route', async () => {
    const routesResponse = await request(app).get('/routes');
    const routeId = routesResponse.body[0].routeId;

    const deleteResponse = await request(app).delete(`/routes/${routeId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Route deleted successfully');

    const fetchResponse = await request(app).get(`/routes/${routeId}`);
    expect(fetchResponse.status).toBe(404);
  });
});
