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
let tripId1: number;
let tripId2: number;
let shipmentId1: number;
let shipmentId2: number;


describe('TripShipment API Routes', () => {

  beforeAll(async () => {
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

    const response = await request(app)
      .post('/trips')
      .send({
        routeId: routeId1,
        vehicleId: vehicleId1,
        driver1Id: employeeId1,
        driver2Id: employeeId2,
      });
    tripId1 = response.body.tripId

    const response7 = await request(app)
      .post('/trips')
      .send({
        routeId: routeId1,
        vehicleId: vehicleId1,
        driver1Id: employeeId1,
        driver2Id: employeeId2,
      });
    tripId2 = response.body.tripId

    const response8 = await request(app)
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

    const response9 = await request(app)
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
    const response = await request(app).get('/tripshipments');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /tripshipments should create a new trip shipment', async () => {
    const response = await request(app)
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
    const response = await request(app).get('/tripshipments');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    // expect(response.body[0].tripId).toBe(tripId1);
    // expect(response.body[0].shipmentId).toBe(shipmentId1);
  });

  test('GET /tripshipments/:tripShipmentId should return a specific trip shipment', async () => {
    const tripShipmentsResponse = await request(app).get('/tripshipments');
    const tripShipmentId = tripShipmentsResponse.body[0].tripShipmentId;

    const response = await request(app).get(`/tripshipments/${tripShipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body.tripShipmentId).toBe(tripShipmentId);
    // expect(response.body.tripId).toBe(tripId1);
    // expect(response.body.shipmentId).toBe(shipmentId1);
  });

  test('PUT /tripshipments/:tripShipmentId should update a trip shipment', async () => {
    const tripShipmentsResponse = await request(app).get('/tripshipments');
    const tripShipmentId = tripShipmentsResponse.body[0].tripShipmentId;

    const response = await request(app)
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
    const tripShipmentsResponse = await request(app).get('/tripshipments');
    const tripShipmentId = tripShipmentsResponse.body[0].tripShipmentId;

    const deleteResponse = await request(app).delete(`/tripshipments/${tripShipmentId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Trip shipment deleted successfully');

    const fetchResponse = await request(app).get(`/tripshipments/${tripShipmentId}`);
    expect(fetchResponse.status).toBe(404);
  });

  test('DELETE /tripshipments/:tripShipmentId with invalid ID should return 400', async () => {
    const response = await request(app).delete('/tripshipments/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid trip shipment ID');
  });
});