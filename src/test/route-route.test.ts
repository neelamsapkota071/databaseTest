import request from 'supertest';
import { setupTestDataSource } from '../test-utils';
import { DataSource } from 'typeorm';


let AppDataSource: DataSource;
import  {app, server}  from '../app';

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
});

afterAll(async () => {
  if (AppDataSource) {
    server.close()
    await AppDataSource.destroy();
  }
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
        origin: 'New York',
        destination: 'Los Angeles',
      });

    expect(response.status).toBe(201);
    expect(response.body.origin).toBe('New York');
    expect(response.body.destination).toBe('Los Angeles');
  });

  test('GET /routes should return the created route', async () => {
    const response = await request(app).get('/routes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].origin).toBe('New York');
  });

  test('GET /routes/:routeId should return a specific route', async () => {
    const routesResponse = await request(app).get('/routes');
    const routeId = routesResponse.body[0].routeId;

    const response = await request(app).get(`/routes/${routeId}`);
    expect(response.status).toBe(200);
    expect(response.body.routeId).toBe(routeId);
    expect(response.body.origin).toBe('New York');
  });

  test('PUT /routes/:routeId should update a route', async () => {
    const routesResponse = await request(app).get('/routes');
    const routeId = routesResponse.body[0].routeId;

    const response = await request(app)
      .put(`/routes/${routeId}`)
      .send({
        origin: 'San Francisco',
        destination: 'Las Vegas',
      });

    expect(response.status).toBe(200);
    expect(response.body.origin).toBe('San Francisco');
    expect(response.body.destination).toBe('Las Vegas');
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

  test('GET /routes/:routeId with invalid ID should return 400', async () => {
    const response = await request(app).get('/routes/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid route ID');
  });

  test('PUT /routes/:routeId with invalid ID should return 400', async () => {
    const response = await request(app)
      .put('/routes/invalid-id')
      .send({
        origin: 'Invalid City',
        destination: 'Invalid Destination',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid route ID');
  });

  test('DELETE /routes/:routeId with invalid ID should return 400', async () => {
    const response = await request(app).delete('/routes/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid route ID');
  });
});
