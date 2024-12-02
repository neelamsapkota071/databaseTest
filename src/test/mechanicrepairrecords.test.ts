import 'reflect-metadata';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { app, server } from '../app'; // Assuming Express app is exported from this module
import { AppDataSource } from '../ormconfig';
import { MechanicRepairRecord } from '../entity/MechanicRepairRecord';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';

let App: any; // Express app instance
let connection: DataSource;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  App = app; // Assuming your app is exported as `App`
});

afterAll(async () => {
  await connection.destroy();
  server.close()

});

describe('MechanicRepairRecord API Tests', () => {
  let testMechanic: Employee;
  let testVehicle: Vehicle;
  let repairRecordId: number;

  beforeAll(async () => {
    const employeeRepo = connection.getRepository(Employee);
    const vehicleRepo = connection.getRepository(Vehicle);

    // Creating a test mechanic
    testMechanic = await employeeRepo.save({
      firstName: 'Test',
      lastName: 'Mechanic',
      isMechanic: true,
      seniority: 5,
      certifiedVehicleTypes: ["asd"],
    });

    // Creating a test vehicle
    testVehicle = await vehicleRepo.save({
      brand: 'Honda',
      model: 'Civic',
      vehicleType: 'car',
      year: 2020,
      loadCapacity: 100,
      numRepairs: 1,
    });
  });

  afterAll(async () => {
    const employeeRepo = connection.getRepository(Employee);
    const vehicleRepo = connection.getRepository(Vehicle);

    // Cleaning up test data
    await employeeRepo.remove(testMechanic);
    await vehicleRepo.remove(testVehicle);
  });

  test('Create a new repair record', async () => {
    const response = await request(App).post('/repairRecords').send({
      mechanicId: testMechanic.employeeId,
      vehicleId: testVehicle.vehicleId,
      estimatedRepairTimeDays: 7,
      actualRepairTimeDays: 6,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('repairId');
    repairRecordId = response.body.repairId; // Save the created record ID for future tests
  });

  test('Retrieve all repair records', async () => {
    const response = await request(App).get('/repairRecords');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Retrieve a repair record by ID', async () => {
    const response = await request(App).get(`/repairRecords/${repairRecordId}`);
    expect(response.status).toBe(200);
    expect(response.body.repairId).toBe(repairRecordId);
    expect(response.body).toHaveProperty('mechanicId');
    expect(response.body).toHaveProperty('vehicleId');
  });

  test('Update an existing repair record', async () => {
    const response = await request(App).put(`/repairRecords/${repairRecordId}`).send({
      mechanicId: testMechanic.employeeId,
      vehicleId: testVehicle.vehicleId,
      estimatedRepairTimeDays: 8,
      actualRepairTimeDays: 7,
    });

    expect(response.status).toBe(200);
    expect(response.body.repairId).toBe(repairRecordId);
    expect(response.body.estimatedRepairTimeDays).toBe(8);
    expect(response.body.actualRepairTimeDays).toBe(7);
  });

  test('Delete a repair record by ID', async () => {
    const response = await request(App).delete(`/repairRecords/${repairRecordId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Repair record deleted successfully');
  });

  test('Retrieve a deleted repair record should return 404', async () => {
    const response = await request(App).get(`/repairRecords/${repairRecordId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Repair record not found');
  });
});
