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

let routeId1: number;
let routeId2: number;
let employeeId1: number;
let employeeId2: number;
let vehicleId1: number;

describe('Trip API Routes', () => {
  beforeAll(async () => {
    // Create a mechanic
    const response1 = await request(app)
      .post('/routes')
      .send({
        origin: 'New York',
        destination: 'Los Angeles',
      });
    routeId1 = response1.body.routeId;

    const response2 = await request(app)
      .post('/routes')
      .send({
        origin: 'New York',
        destination: 'Los Angeles',
      });
    routeId2 = response2.body.routeId;

    const response3 = await request(app)
      .post('/employees')
      .send({
        firstName: 'Alice',
        lastName: 'Johnson',
        seniority: 5,
        isMechanic: true,
        certifiedVehicleTypes: ['Car', 'Truck'],
      });

    employeeId1 = response3.body.employeeId

    const response4 = await request(app)
      .post('/employees')
      .send({
        firstName: 'Alice',
        lastName: 'Johnson',
        seniority: 5,
        isMechanic: true,
        certifiedVehicleTypes: ['Car', 'Truck'],
      });

    employeeId2 = response4.body.employeeId

    const response5 = await request(app)
      .post('/vehicles')
      .send({
        vehicleType: 'Truck',
        brand: 'Ford',
        loadCapacity: 1500,
        year: 2020,
        numRepairs: 2,
      });

    vehicleId1 = response5.body.vehicleId

  });

  test('GET /trips should return an empty array initially', async () => {
    const response = await request(app).get('/trips');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /trips should create a new trip', async () => {
    const response = await request(app)
      .post('/trips')
      .send({
        routeId: routeId1,
        vehicleId: vehicleId1,
        driver1Id: employeeId1,
        driver2Id: employeeId2,
      });

    expect(response.status).toBe(201);
    expect(response.body.routeId).toBe(routeId1);
    expect(response.body.vehicleId).toBe(vehicleId1);
    expect(response.body.driver1Id).toBe(employeeId1);
    expect(response.body.driver2Id).toBe(employeeId2);
  });

  test('GET /trips should return the created trip', async () => {
    const response = await request(app).get('/trips');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('GET /trips/:tripId should return a specific trip', async () => {
    const tripsResponse = await request(app).get('/trips');
    const tripId = tripsResponse.body[0].tripId;

    const response = await request(app).get(`/trips/${tripId}`);
    expect(response.status).toBe(200);
    expect(response.body.tripId).toBe(tripId);
  });

  test('PUT /trips/:tripId should update a trip', async () => {
    const tripsResponse = await request(app).get('/trips');
    const tripId = tripsResponse.body[0].tripId;

    const response = await request(app)
      .put(`/trips/${tripId}`)
      .send({
        routeId: routeId2,
        vehicleId: vehicleId1,
        driver1Id: employeeId2,
        driver2Id: employeeId1,
      });

    expect(response.status).toBe(200);
    expect(response.body.routeId).toBe(routeId2);
    expect(response.body.vehicleId).toBe(vehicleId1);
    expect(response.body.driver1Id).toBe(employeeId2);
    expect(response.body.driver2Id).toBe(employeeId1);
  });

  test('DELETE /trips/:tripId should delete a trip', async () => {
    const tripsResponse = await request(app).get('/trips');
    const tripId = tripsResponse.body[0].tripId;

    const deleteResponse = await request(app).delete(`/trips/${tripId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Trip deleted successfully');

    const fetchResponse = await request(app).get(`/trips/${tripId}`);
    expect(fetchResponse.status).toBe(404);
  });

  test('GET /trips/:tripId with invalid ID should return 400', async () => {
    const response = await request(app).get('/trips/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid trip ID');
  });

  test('PUT /trips/:tripId with invalid ID should return 400', async () => {
    const response = await request(app)
      .put('/trips/invalid-id')
      .send({
        routeId: 3,
        vehicleId: 3,
        driver1Id: 105,
        driver2Id: 106,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid trip ID');
  });

  test('DELETE /trips/:tripId with invalid ID should return 400', async () => {
    const response = await request(app).delete('/trips/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid trip ID');
  });
});