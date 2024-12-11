import request from 'supertest';
import { setupTestDataSource } from '../test-utils';
import { DataSource } from 'typeorm';
import app  from '../test';
import { createServer, Server } from 'http';

let new_server: Server;

let AppDataSource: DataSource;

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
  new_server = app.listen(3001, () => {
    console.log(`Server is running on http://localhost:${3001}`);
  });
});

afterAll(async () => {
  if (AppDataSource) {
    await AppDataSource.destroy();
  }
  new_server.close()
});

describe('Mechanic Repair Record API Routes', () => {
  let mechanicId: number;
  let vehicleId: number;

  beforeAll(async () => {
    // Create a mechanic
    const mechanicResponse = await request(app)
      .post('/employees')
      .send({
        firstName: 'Neelam',
        lastName: 'Sapkota',
        seniority: 10,
        isMechanic: true,
        certifiedVehicleTypes: ['Car', 'Truck'],
      });
    mechanicId = mechanicResponse.body.employeeId;

    // Create a vehicle
    const vehicleResponse = await request(app)
      .post('/vehicles')
      .send({
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        loadCapacity: 120,
        vehicleType: 'Car',
        numRepairs: 1,
      });
    vehicleId = vehicleResponse.body.vehicleId;
  });

  test('GET /repairRecords should return an empty array initially', async () => {
    const response = await request(app).get('/repairRecords');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /repairRecords should create a new repair record', async () => {
    const response = await request(app)
      .post('/repairRecords')
      .send({
        mechanicId,
        vehicleId,
        estimatedRepairTimeDays: 5,
        actualRepairTimeDays: 4,
      });

    expect(response.status).toBe(201);
    expect(response.body.estimatedRepairTimeDays).toBe(5);
    expect(response.body.actualRepairTimeDays).toBe(4);
    expect(response.body.mechanicId.employeeId).toBe(mechanicId);
    expect(response.body.vehicleId.vehicleId).toBe(vehicleId);
  });

  test('GET /repairRecords should return the created repair record', async () => {
    const response = await request(app).get('/repairRecords');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].estimatedRepairTimeDays).toBe(5);
  });

  test('GET /repairRecords/:repairId should return a specific repair record', async () => {
    const repairRecordsResponse = await request(app).get('/repairRecords');
    const repairId = repairRecordsResponse.body[0].repairId;

    const response = await request(app).get(`/repairRecords/${repairId}`);
    expect(response.status).toBe(200);
    expect(response.body.repairId).toBe(repairId);
  });

  test('PUT /repairRecords/:repairId should update a repair record', async () => {
    const repairRecordsResponse = await request(app).get('/repairRecords');
    const repairId = repairRecordsResponse.body[0].repairId;

    const response = await request(app)
      .put(`/repairRecords/${repairId}`)
      .send({
        mechanicId,
        vehicleId,
        estimatedRepairTimeDays: 6,
        actualRepairTimeDays: 6,
      });

    expect(response.status).toBe(200);
    expect(response.body.estimatedRepairTimeDays).toBe(6);
    expect(response.body.actualRepairTimeDays).toBe(6);
  });

  test('DELETE /repairRecords/:repairId should delete a repair record', async () => {
    const repairRecordsResponse = await request(app).get('/repairRecords');
    const repairId = repairRecordsResponse.body[0].repairId;

    const deleteResponse = await request(app).delete(`/repairRecords/${repairId}`);
    expect(deleteResponse.status).toBe(200);

    const fetchResponse = await request(app).get(`/repairRecords/${repairId}`);
    expect(fetchResponse.status).toBe(404);
  });
});
