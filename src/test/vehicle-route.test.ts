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

describe('Vehicle API Routes', () => {
  test('GET /vehicles should return an empty array initially', async () => {
    const response = await request(app).get('/vehicles');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /vehicles should create a new vehicle', async () => {
    const response = await request(app)
      .post('/vehicles')
      .send({
        vehicleType: 'Truck',
        brand: 'Volvo',
        loadCapacity: 2000,
        year: 2022,
        numRepairs: 0,
      });

    expect(response.status).toBe(201);
    expect(response.body.vehicleType).toBe('Truck');
    expect(response.body.brand).toBe('Volvo');
    expect(response.body.loadCapacity).toBe(2000);
    expect(response.body.year).toBe(2022);
    expect(response.body.numRepairs).toBe(0);
  });

  test('GET /vehicles should return the created vehicle', async () => {
    const response = await request(app).get('/vehicles');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].vehicleType).toBe('Truck');
    expect(response.body[0].brand).toBe('Volvo');
  });

  test('GET /vehicles/:vehicleId should return a specific vehicle', async () => {
    const vehiclesResponse = await request(app).get('/vehicles');
    const vehicleId = vehiclesResponse.body[0].vehicleId;

    const response = await request(app).get(`/vehicles/${vehicleId}`);
    expect(response.status).toBe(200);
    expect(response.body.vehicleId).toBe(vehicleId);
    expect(response.body.vehicleType).toBe('Truck');
  });

  test('PUT /vehicles/:vehicleId should update a vehicle', async () => {
    const vehiclesResponse = await request(app).get('/vehicles');
    const vehicleId = vehiclesResponse.body[0].vehicleId;

    const response = await request(app)
      .put(`/vehicles/${vehicleId}`)
      .send({
        vehicleType: 'SUV',
        brand: 'Tesla',
        loadCapacity: 1000,
        year: 2023,
        numRepairs: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.vehicleType).toBe('SUV');
    expect(response.body.brand).toBe('Tesla');
    expect(response.body.loadCapacity).toBe(1000);
    expect(response.body.year).toBe(2023);
    expect(response.body.numRepairs).toBe(1);
  });

  test('DELETE /vehicles/:vehicleId should delete a vehicle', async () => {
    const vehiclesResponse = await request(app).get('/vehicles');
    const vehicleId = vehiclesResponse.body[0].vehicleId;

    const deleteResponse = await request(app).delete(`/vehicles/${vehicleId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Vehicle deleted successfully');

    const fetchResponse = await request(app).get(`/vehicles/${vehicleId}`);
    expect(fetchResponse.status).toBe(404);
  });

  test('DELETE /vehicles/:vehicleId with invalid ID should return 400', async () => {
    const response = await request(app).delete('/vehicles/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid vehicle ID');
  });
});