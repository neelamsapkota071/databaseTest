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

let customerId1: number;
let customerId2: number;

describe('Shipment API Routes', () => {
  beforeAll(async () => {
    // Create a mechanic
    const response = await request(app)
      .post('/customers')
      .send({
        name: 'John Doe',
        address: '123 Main St',
        phone1: '123-456-7890',
        phone2: '987-654-3210',
      });

    const response2 = await request(app)
      .post('/customers')
      .send({
        name: 'John Doe',
        address: '123 Main St',
        phone1: '123-456-7890',
        phone2: '987-654-3210',
      });

    customerId1 = response.body.customerId;
    customerId2 = response.body.customerId;


  });




  test('GET /shipments should return an empty array initially', async () => {
    const response = await request(app).get('/shipments');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /shipments should create a new shipment', async () => {
    const response = await request(app)
      .post('/shipments')
      .send({
        customerId: customerId1,
        origin: 'San Francisco',
        destination: 'New York',
        shipmentDate: '2024-11-27',
        weight: 500,
        status: 'In Transit',
      });


    expect(response.status).toBe(201);
    expect(response.body.customerId).toBe(1);
    expect(response.body.origin).toBe('San Francisco');
    expect(response.body.destination).toBe('New York');
    expect(response.body.shipmentDate).toBe('2024-11-27');
    expect(response.body.weight).toBe(500);
    expect(response.body.status).toBe('In Transit');
  });

  test('GET /shipments should return the created shipment', async () => {
    const response = await request(app).get('/shipments');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].origin).toBe('San Francisco');
  });

  test('GET /shipments/:shipmentId should return a specific shipment', async () => {
    const shipmentsResponse = await request(app).get('/shipments');
    const shipmentId = shipmentsResponse.body[0].shipmentId;

    const response = await request(app).get(`/shipments/${shipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body.shipmentId).toBe(shipmentId);
    expect(response.body.origin).toBe('San Francisco');
  });

  test('PUT /shipments/:shipmentId should update a shipment', async () => {
    const shipmentsResponse = await request(app).get('/shipments');
    const shipmentId = shipmentsResponse.body[0].shipmentId;

    const response = await request(app)
      .put(`/shipments/${shipmentId}`)
      .send({
        customerId: customerId2,
        origin: 'Los Angeles',
        destination: 'Chicago',
        shipmentDate: '2024-11-28',
        weight: 600,
        status: 'Delivered',
      });

    expect(response.status).toBe(200);
    expect(response.body.customerId).toBe(customerId2);
    expect(response.body.origin).toBe('Los Angeles');
    expect(response.body.destination).toBe('Chicago');
    expect(response.body.shipmentDate).toBe('2024-11-28');
    expect(response.body.weight).toBe(600);
    expect(response.body.status).toBe('Delivered');
  });

  test('DELETE /shipments/:shipmentId should delete a shipment', async () => {
    const shipmentsResponse = await request(app).get('/shipments');
    const shipmentId = shipmentsResponse.body[0].shipmentId;

    const deleteResponse = await request(app).delete(`/shipments/${shipmentId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Shipment deleted successfully');

    const fetchResponse = await request(app).get(`/shipments/${shipmentId}`);
    expect(fetchResponse.status).toBe(404);
  });

  test('GET /shipments/:shipmentId with invalid ID should return 400', async () => {
    const response = await request(app).get('/shipments/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid shipment ID');
  });

  test('PUT /shipments/:shipmentId with invalid ID should return 400', async () => {
    const response = await request(app)
      .put('/shipments/invalid-id')
      .send({
        customerId: 3,
        origin: 'Invalid City',
        destination: 'Invalid Destination',
        shipmentDate: '2024-11-29',
        weight: 700,
        status: 'Invalid Status',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid shipment ID');
  });

  test('DELETE /shipments/:shipmentId with invalid ID should return 400', async () => {
    const response = await request(app).delete('/shipments/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid shipment ID');
  });
});
