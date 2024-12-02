import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import { app, server } from '../app'; // Import your Express app
import { Trip } from '../entity/Trip';
import request from 'supertest';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';
import { Route } from '../entity/Route';
import { rootCertificates } from 'tls';
import { AppDataSource } from '../ormconfig';
import { connect } from 'http2';
import { Customer } from '../entity/Customer';
import { Shipment } from '../entity/Shipment';
import { TripShipment } from '../entity/TripShipment';
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
let testDriver1: Employee;
let testDriver2: Employee;

let testVehicle1: Vehicle;
let testVehicle2: Vehicle;

let testRoute1: Route;
let testRoute2: Route;

let trip1: Trip;
let trip2: Trip;
let customer1: Customer;

let shipment1: Shipment;
let shipment2: Shipment;

describe('TripShipment API Tests', () => {

  beforeAll(async () => {
    const employeeRepo = connection.getRepository(Employee);
    const vehicleRepo = connection.getRepository(Vehicle);
    const routeRepo = connection.getRepository(Route);
    const shipmentRepo = connection.getRepository(Shipment)
    const tripRepo = connection.getRepository(Trip)
    const customerRepo = connection.getRepository(Customer)


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

    // Create trip
    trip1 = await tripRepo.save({
      routeId: testRoute1,
      vehicleId: testVehicle1,
      driver1Id: testDriver1,
      driver2Id: testDriver1,
    });
    trip2 = await tripRepo.save({
      routeId: testRoute1,
      vehicleId: testVehicle1,
      driver1Id: testDriver1,
      driver2Id: testDriver1,
    });

    // create Customer 
    customer1 = await customerRepo.save({
      name: 'John Doe',
      address: '123 Elm Street',
      phone1: '555-1234',
      phone2: '555-5678',
    });

    // Create Shipment
    shipment1 = await shipmentRepo.save({
      customerId: customer1,
      origin: 'New York',
      destination: 'Los Angeles',
      shipmentDate: new Date('2024-11-01'),
      weight: 200,
      status: 'In Transit',
    });

    shipment2 = await shipmentRepo.save({
      customerId: customer1,
      origin: 'New York',
      destination: 'Los Angeles',
      shipmentDate: new Date('2024-11-01'),
      weight: 200,
      status: 'In Transit',
    });


  });

  test('should create a new trip shipment', async () => {
    const response = await request(app)
      .post('/tripshipments')
      .send({
        tripId: trip1,
        shipmentId: shipment1,
      });

    expect(response.status).toBe(201);
    // expect(response.body).toMatchObject({
    //   tripId: 1,
    //   shipmentId: 2,
    // });
  });

  test('should fetch all trip shipments', async () => {
    const response = await request(app).get('/tripshipments');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should fetch a single trip shipment by ID', async () => {
    const newTripShipment = AppDataSource.getRepository(TripShipment).create({
      tripId: trip1,
      shipmentId: shipment1,
    });
    await AppDataSource.getRepository(TripShipment).save(newTripShipment);

    const response = await request(app).get(`/tripshipments/${newTripShipment.tripShipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripShipmentId: newTripShipment.tripShipmentId,
      // tripId: trip1,
      // shipmentId: shipment1,
    });
  });

  test('should update a trip shipment', async () => {
    const newTripShipment = AppDataSource.getRepository(TripShipment).create({
      tripId: trip1,
      shipmentId: shipment1,
    });
    await AppDataSource.getRepository(TripShipment).save(newTripShipment);

    const response = await request(app)
      .put(`/tripshipments/${newTripShipment.tripShipmentId}`)
      .send({
        tripId: trip2,
        shipmentId: shipment2,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripShipmentId: newTripShipment.tripShipmentId,
      // tripId: trip2,
      // shipmentId: shipment2,
    });
  });

  test('should delete a trip shipment', async () => {
    const newTripShipment = AppDataSource.getRepository(TripShipment).create({
      tripId: trip1,
      shipmentId: shipment1,
    });
    await AppDataSource.getRepository(TripShipment).save(newTripShipment);

    const response = await request(app).delete(`/tripshipments/${newTripShipment.tripShipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: 'Trip shipment deleted successfully' });

    const deletedTripShipment = await AppDataSource.getRepository(TripShipment).findOneBy({
      tripShipmentId: newTripShipment.tripShipmentId,
    });
    expect(deletedTripShipment).toBeNull();
  });

  test('should handle invalid trip shipment ID', async () => {
    const response = await request(app).get('/tripshipments/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: 'Invalid trip shipment ID' });
  });

  test('should return 404 for non-existent trip shipment', async () => {
    const response = await request(app).get('/tripshipments/9999');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Trip shipment not found' });
  });
});
