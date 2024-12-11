import 'reflect-metadata';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import { MechanicRepairRecord } from '../entity/MechanicRepairRecord';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';

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

describe('MechanicRepairRecord API Tests', () => {
  let testMechanic: Employee;
  let testVehicle: Vehicle;
  let repairRecordId: number;

  beforeAll(async () => {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

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
    const employeeRepo = AppDataSource.getRepository(Employee);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    // Cleaning up test data
    await employeeRepo.remove(testMechanic);
    await vehicleRepo.remove(testVehicle);
  });

  test('Create a new repair record', async () => {
    const response = await request(new_server).post('/repairRecords').send({
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
    const response = await request(new_server).get('/repairRecords');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Retrieve a repair record by ID', async () => {
    const response = await request(new_server).get(`/repairRecords/${repairRecordId}`);
    expect(response.status).toBe(200);
    expect(response.body.repairId).toBe(repairRecordId);
    expect(response.body).toHaveProperty('mechanicId');
    expect(response.body).toHaveProperty('vehicleId');
  });

  test('Update an existing repair record', async () => {
    const response = await request(new_server).put(`/repairRecords/${repairRecordId}`).send({
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
    const response = await request(new_server).delete(`/repairRecords/${repairRecordId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Repair record deleted successfully');
  });
});
