import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import request from 'supertest';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';
import { Route } from '../entity/Route';
import { Trip } from '../entity/Trip'; // Assuming Trip entity exists
// let App: any;
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

let testDriver1: Employee;
let testDriver2: Employee;

let testVehicle1: Vehicle;
let testVehicle2: Vehicle;

let testRoute1: Route;
let testRoute2: Route;

describe('Trip API Tests', () => {
  beforeAll(async () => {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const routeRepo = AppDataSource.getRepository(Route);

    
    testDriver1 = await employeeRepo.save({
      firstName: 'Test',
      lastName: 'Mechanic',
      isMechanic: true,
      seniority: 5,
      certifiedVehicleTypes: ['car'],
    });

    testDriver2 = await employeeRepo.save({
      firstName: 'Test',
      lastName: 'Driver',
      isMechanic: false,
      seniority: 3,
      certifiedVehicleTypes: ['truck'],
    });

    // Creating test vehicles
    testVehicle1 = await vehicleRepo.save({
      brand: 'Honda',
      model: 'Civic',
      vehicleType: 'car',
      year: 2020,
      loadCapacity: 100,
      numRepairs: 1,
    });

    testVehicle2 = await vehicleRepo.save({
      brand: 'Toyota',
      model: 'Corolla',
      vehicleType: 'car',
      year: 2019,
      loadCapacity: 120,
      numRepairs: 2,
    });

    
    testRoute1 = await routeRepo.save({
      origin: 'Nepal',
      destination: 'Canada',
    });

    testRoute2 = await routeRepo.save({
      origin: 'Pokhara',
      destination: 'Lalitpur',
    });
  });

  test('should create a new trip', async () => {
    const response = await request(new_server)
      .post('/trips')
      .send({
        routeId: testRoute1.routeId,
        vehicleId: testVehicle1.vehicleId,
        driver1Id: testDriver1.employeeId,
        driver2Id: testDriver2.employeeId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('tripId');
  });

  test('should fetch all trips', async () => {
    const response = await request(new_server).get('/trips');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should fetch a single trip by ID', async () => {
    const tripRepo = AppDataSource.getRepository(Trip);

    const newTrip = tripRepo.create({
      routeId: testRoute1,
      vehicleId: testVehicle1,
      driver1Id: testDriver1,
      driver2Id: testDriver2,
    });

    await tripRepo.save(newTrip);

    const response = await request(new_server).get(`/trips/${newTrip.tripId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripId: newTrip.tripId,
    });
  });

  test('should update a trip', async () => {
    const tripRepo = AppDataSource.getRepository(Trip);

    const newTrip = tripRepo.create({
      routeId: testRoute1,
      vehicleId: testVehicle2,
      driver1Id: testDriver1,
      driver2Id: testDriver2,
    });

    await tripRepo.save(newTrip);

    const response = await request(new_server)
      .put(`/trips/${newTrip.tripId}`)
      .send({
        routeId: testRoute2.routeId,
        vehicleId: testVehicle2.vehicleId,
        driver1Id: testDriver2.employeeId,
        driver2Id: testDriver1.employeeId,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripId: newTrip.tripId,
      routeId: testRoute2.routeId,
      vehicleId: testVehicle2.vehicleId,
      driver1Id: testDriver2.employeeId,
      driver2Id: testDriver1.employeeId,
    });
  });

  test('should delete a trip', async () => {
    const tripRepo = AppDataSource.getRepository(Trip);

    const newTrip = tripRepo.create({
      routeId: testRoute1,
      vehicleId: testVehicle1,
      driver1Id: testDriver1,
      driver2Id: testDriver2,
    });

    await tripRepo.save(newTrip);

    const response = await request(new_server).delete(`/trips/${newTrip.tripId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: 'Trip deleted successfully' });

    const deletedTrip = await tripRepo.findOneBy({
      tripId: newTrip.tripId,
    });
    expect(deletedTrip).toBeNull();
  });
});
