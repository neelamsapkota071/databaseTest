import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import {app, server} from '../app';import { Trip } from '../entity/Trip';
import request from 'supertest';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';
import { Route } from '../entity/Route';
import { rootCertificates } from 'tls';
import { AppDataSource } from '../ormconfig';
import { connect } from 'http2';
let App: any; // Express app instance
let connection: DataSource;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  // App = app; // Assuming your app is exported as `App`
});

afterAll(async () => {

  await connection.destroy();
});

let testDriver1: Employee;
let testDriver2: Employee;

let testVehicle1: Vehicle;
let testVehicle2: Vehicle;

let testRoute1: Route;
let testRoute2: Route;

describe('Trip API Tests', () => {

  let repairRecordId: number;

  beforeAll(async () => {
    const employeeRepo = connection.getRepository(Employee);
    const vehicleRepo = connection.getRepository(Vehicle);
    const routeRepo = connection.getRepository(Route);

    // Creating a test driver
    testDriver1 = await employeeRepo.save({
      firstName: 'Test',
      lastName: 'Mechanic',
      isMechanic: true,
      seniority: 5,
      certifiedVehicleTypes: ["asd"],
    });

    testDriver2 = await employeeRepo.save({
      firstName: 'Test',
      lastName: 'Mechanic',
      isMechanic: true,
      seniority: 5,
      certifiedVehicleTypes: ["asd"],
    });

    // Creating a test vehicle
    testVehicle1 = await vehicleRepo.save({
      brand: 'Honda',
      model: 'Civic',
      vehicleType: 'car',
      year: 2020,
      loadCapacity: 100,
      numRepairs: 1,
    });

    testVehicle2 = await vehicleRepo.save({
      brand: 'Honda',
      model: 'Civic',
      vehicleType: 'car',
      year: 2020,
      loadCapacity: 100,
      numRepairs: 1,
    });

    testRoute1 = await routeRepo.save({
      origin: 'Montreal',
      destination: 'Calgary',
    });

    testRoute2 = await routeRepo.save({
      origin: 'Montreal',
      destination: 'Calgary',
    });
  });

  test('should create a new trip', async () => {
    const response = await request(app)
      .post('/trips')
      .send({
        routeId: testRoute1.routeId,
        vehicleId: testVehicle1.vehicleId,
        driver1Id: testDriver1.employeeId,
        driver2Id: testDriver2.employeeId,
      });

    expect(response.status).toBe(201);
  });

  test('should fetch all trips', async () => {
    const response = await request(app).get('/trips');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should fetch a single trip by ID', async () => {
    const tripRepo = connection.getRepository(Trip);

    const newTrip = tripRepo.create({
      routeId: testRoute1,
      vehicleId: testVehicle1,
      driver1Id: testDriver1,
      driver2Id: testDriver1,
    });

    await tripRepo.save(newTrip);

    const response = await request(app).get(`/trips/${newTrip.tripId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripId: newTrip.tripId
    });
  });

  test('should update a trip', async () => {
    const newTrip = AppDataSource.getRepository(Trip).create({
      routeId: testRoute1,
      vehicleId: testVehicle2,
      driver1Id: testDriver1,
      driver2Id: testDriver2,
    });
    await AppDataSource.getRepository(Trip).save(newTrip);

    const response = await request(app)
      .put(`/trips/${newTrip.tripId}`)
      .send({
        routeId: testRoute2,
        vehicleId: testVehicle2,
        driver1Id: testDriver2,
        driver2Id: testDriver1,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripId: newTrip.tripId,
      routeId: testRoute2,
      vehicleId: testVehicle2,
      driver1Id: testDriver2,
      driver2Id: testDriver1,
    });
  });

  test('should delete a trip', async () => {
    const tripRepository = AppDataSource.getRepository(Trip);
    const newTrip = AppDataSource.getRepository(Trip).create({
      routeId: testRoute1,
      vehicleId: testVehicle2,
      driver1Id: testDriver1,
      driver2Id: testDriver2,
    });
    await tripRepository.save(newTrip);

    const response = await request(app).delete(`/trips/${newTrip.tripId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: 'Trip deleted successfully' });

    const deletedTrip = await AppDataSource.getRepository(Trip).findOneBy({
      tripId: newTrip.tripId,
    });
    expect(deletedTrip).toBeNull();
  });

  test('should handle invalid trip ID', async () => {
    const response = await request(app).get('/trips/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: 'Invalid trip ID' });
  });

  test('should return 404 for non-existent trip', async () => {
    const response = await request(app).get('/trips/9999');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Trip not found' });
  });
});
