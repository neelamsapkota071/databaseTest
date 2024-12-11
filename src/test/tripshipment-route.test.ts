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
let routeId1: number;
let routeId2: number;
let employeeId1: number;
let employeeId2: number;
let vehicleId1: number;
let tripId1: number;
let tripId2: number;
let shipmentId1: number;
let shipmentId2: number;


describe('TripShipment API Routes', () => {

  beforeAll(async () => {
    const response1 = await request(new_server)
      .post('/routes')
      .send({
        origin: 'New York',
        destination: 'Los Angeles',
      });
    routeId1 = response1.body.routeId;

    const response2 = await request(new_server)
      .post('/routes')
      .send({
        origin: 'New York',
        destination: 'Los Angeles',
      });
    routeId2 = response2.body.routeId;

    const response3 = await request(new_server)
      .post('/employees')
      .send({
        firstName: 'Alice',
        lastName: 'Johnson',
        seniority: 5,
        isMechanic: true,
        certifiedVehicleTypes: ['Car', 'Truck'],
      });

    employeeId1 = response3.body.employeeId

    const response4 = await request(new_server)
      .post('/employees')
      .send({
        firstName: 'Alice',
        lastName: 'Johnson',
        seniority: 5,
        isMechanic: true,
        certifiedVehicleTypes: ['Car', 'Truck'],
      });

    employeeId2 = response4.body.employeeId

    const response5 = await request(new_server)
      .post('/vehicles')
      .send({
        vehicleType: 'Truck',
        brand: 'Ford',
        loadCapacity: 1500,
        year: 2020,
        numRepairs: 2,
      });

    vehicleId1 = response5.body.vehicleId

    const response = await request(new_server)
      .post('/trips')
      .send({
        routeId: routeId1,
        vehicleId: vehicleId1,
        driver1Id: employeeId1,
        driver2Id: employeeId2,
      });
    tripId1 = response.body.tripId

    const response7 = await request(new_server)
      .post('/trips')
      .send({
        routeId: routeId1,
        vehicleId: vehicleId1,
        driver1Id: employeeId1,
        driver2Id: employeeId2,
      });
    tripId2 = response.body.tripId

    const response8 = await request(new_server)
      .post('/shipments')
      .send({
        customerId: employeeId1,
        origin: 'San Francisco',
        destination: 'New York',
        shipmentDate: '2024-11-27',
        weight: 500,
        status: 'In Transit',
      });
    shipmentId1 = response.body.shipmentId

    const response9 = await request(new_server)
      .post('/shipments')
      .send({
        customerId: employeeId2,
        origin: 'San Francisco',
        destination: 'New York',
        shipmentDate: '2024-11-27',
        weight: 500,
        status: 'In Transit',
      });
    shipmentId2 = response.body.shipmentId

  });

  test('GET /tripshipments should return an empty array initially', async () => {
    const response = await request(new_server).get('/tripshipments');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /tripshipments should create a new trip shipment', async () => {
    const response = await request(new_server)
      .post('/tripshipments')
      .send({
        tripId: tripId1,
        shipmentId: shipmentId1,
      });

    expect(response.status).toBe(201);
    expect(response.body.tripId).toBe(tripId1);
    expect(response.body.shipmentId).toBe(shipmentId1);
  });

  test('GET /tripshipments should return the created trip shipment', async () => {
    const response = await request(new_server).get('/tripshipments');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test('GET /tripshipments/:tripShipmentId should return a specific trip shipment', async () => {
    const tripShipmentsResponse = await request(new_server).get('/tripshipments');
    const tripShipmentId = tripShipmentsResponse.body[0].tripShipmentId;

    const response = await request(new_server).get(`/tripshipments/${tripShipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body.tripShipmentId).toBe(tripShipmentId);
  });

  test('PUT /tripshipments/:tripShipmentId should update a trip shipment', async () => {
    const tripShipmentsResponse = await request(new_server).get('/tripshipments');
    const tripShipmentId = tripShipmentsResponse.body[0].tripShipmentId;

    const response = await request(new_server)
      .put(`/tripshipments/${tripShipmentId}`)
      .send({
        tripId: tripId2,
        shipmentId: shipmentId2,
      });

    expect(response.status).toBe(200);
    expect(response.body.tripId).toBe(tripId2);
    expect(response.body.shipmentId).toBe(shipmentId2);
  });

  test('DELETE /tripshipments/:tripShipmentId should delete a trip shipment', async () => {
    const tripShipmentsResponse = await request(new_server).get('/tripshipments');
    const tripShipmentId = tripShipmentsResponse.body[0].tripShipmentId;

    const deleteResponse = await request(new_server).delete(`/tripshipments/${tripShipmentId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Trip shipment deleted successfully');

    const fetchResponse = await request(new_server).get(`/tripshipments/${tripShipmentId}`);
    expect(fetchResponse.status).toBe(404);
  });
});