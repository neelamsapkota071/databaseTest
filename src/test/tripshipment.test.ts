import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import { Trip } from '../entity/Trip';
import request from 'supertest';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';
import { Route } from '../entity/Route';
import { Customer } from '../entity/Customer';
import { Shipment } from '../entity/Shipment';
import { TripShipment } from '../entity/TripShipment';
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

let trip1: Trip;
let trip2: Trip;
let customer1: Customer;

let shipment1: Shipment;
let shipment2: Shipment;

describe('TripShipment API Tests', () => {

  beforeAll(async () => {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const routeRepo = AppDataSource.getRepository(Route);
    const shipmentRepo =AppDataSource.getRepository(Shipment)
    const tripRepo = AppDataSource.getRepository(Trip)
    const customerRepo = AppDataSource.getRepository(Customer)


    // Creating a test driver
    testDriver1 = await employeeRepo.save({
      firstName: 'test',
      lastName: 'test',
      seniority: 5,
      isMechanic: true,
      certifiedVehicleTypes: ['Car', 'Truck'],
    });

    testDriver2 = await employeeRepo.save({
      firstName: 'test',
      lastName: 'test',
      seniority: 5,
      isMechanic: true,
      certifiedVehicleTypes: ['Car', 'Truck'],
    });

    // Creating a test vehicle
    testVehicle1 = await vehicleRepo.save({
      vehicleType: 'Van',
      brand: 'Toyota',
      loadCapacity: 1200,
      year: 2019,
      numRepairs: 1,
    });

    testVehicle2 = await vehicleRepo.save({
      vehicleType: 'Van',
      brand: 'Toyota',
      loadCapacity: 1200,
      year: 2019,
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
      name: 'Rama Sakota',
      address: '458 Islington St',
      phone1: '984-594-4100',
      phone2: '986-611-0003',
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

    const tripshipmentRepository = AppDataSource.getRepository(TripShipment);

    const newTripShipment = tripshipmentRepository.create({
      tripId: trip1,
      shipmentId: shipment1,
    });

    await tripshipmentRepository.save(newTripShipment);

    const savedTripShipment = await tripshipmentRepository.findOne({
      where: { tripShipmentId: newTripShipment.tripShipmentId },
      relations: ['tripId', 'shipmentId'], // Adjust names based on your entity configuration
    });


    expect(savedTripShipment).not.toBeNull();
    expect(savedTripShipment?.tripId.tripId).toBe(trip1.tripId);
    expect(savedTripShipment?.shipmentId.shipmentId).toBe(shipment1.shipmentId);
  });


  test('should fetch all trip shipments', async () => {
    const response = await request(new_server).get('/tripshipments');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should fetch a single trip shipment by ID', async () => {
    const newTripShipment = AppDataSource.getRepository(TripShipment).create({
      tripId: trip1,
      shipmentId: shipment1,
    });
    await AppDataSource.getRepository(TripShipment).save(newTripShipment);

    const response = await request(new_server).get(`/tripshipments/${newTripShipment.tripShipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripShipmentId: newTripShipment.tripShipmentId,
    });
  });

  test('should update a trip shipment', async () => {
    const newTripShipment = AppDataSource.getRepository(TripShipment).create({
      tripId: trip1,
      shipmentId: shipment1,
    });
    await AppDataSource.getRepository(TripShipment).save(newTripShipment);

    const response = await request(new_server)
      .put(`/tripshipments/${newTripShipment.tripShipmentId}`)
      .send({
        tripId: trip2,
        shipmentId: shipment2,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      tripShipmentId: newTripShipment.tripShipmentId,
    });
  });

  test('should delete a trip shipment', async () => {
    const newTripShipment = AppDataSource.getRepository(TripShipment).create({
      tripId: trip1,
      shipmentId: shipment1,
    });
    await AppDataSource.getRepository(TripShipment).save(newTripShipment);

    const response = await request(new_server).delete(`/tripshipments/${newTripShipment.tripShipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: 'Trip shipment deleted successfully' });

    const deletedTripShipment = await AppDataSource.getRepository(TripShipment).findOneBy({
      tripShipmentId: newTripShipment.tripShipmentId,
    });
    expect(deletedTripShipment).toBeNull();
  });
});
