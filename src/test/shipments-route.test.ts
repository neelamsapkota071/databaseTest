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

let customerId1: number;
let customerId2: number;

describe('Shipment API Routes', () => {
  beforeAll(async () => {
    // Create a mechanic
    const response = await request(app)
      .post('/customers')
      .send({
      name: 'Aayush Basnet',
      address: '192 Lear Gate',
      phone1: '857-658-7596',
      phone2: '859-854-7896',
      });

    const response2 = await request(app)
      .post('/customers')
      .send({
      name: 'Rama Sakota',
      address: '458 Islington St',
      phone1: '984-594-4100',
      phone2: '986-611-0003',
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
        origin: 'Kathmandu',
        destination: 'Bhaktapur',
        shipmentDate: '2024-11-27',
        weight: 500,
        status: 'In Transit',
      });


    expect(response.status).toBe(201);
    expect(response.body.customerId).toBe(1);
    expect(response.body.origin).toBe('Kathmandu');
    expect(response.body.destination).toBe('Bhaktapur');
    expect(response.body.shipmentDate).toBe('2024-11-27');
    expect(response.body.weight).toBe(500);
    expect(response.body.status).toBe('In Transit');
  });

  test('GET /shipments should return the created shipment', async () => {
    const response = await request(app).get('/shipments');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].origin).toBe('Kathmandu');
  });

  test('GET /shipments/:shipmentId should return a specific shipment', async () => {
    const shipmentsResponse = await request(app).get('/shipments');
    const shipmentId = shipmentsResponse.body[0].shipmentId;

    const response = await request(app).get(`/shipments/${shipmentId}`);
    expect(response.status).toBe(200);
    expect(response.body.shipmentId).toBe(shipmentId);
    expect(response.body.origin).toBe('Kathmandu');
  });

  test('PUT /shipments/:shipmentId should update a shipment', async () => {
    const shipmentsResponse = await request(app).get('/shipments');
    const shipmentId = shipmentsResponse.body[0].shipmentId;

    const response = await request(app)
      .put(`/shipments/${shipmentId}`)
      .send({
        customerId: customerId2,
        origin: 'Butwal',
        destination: 'Pokhara',
        shipmentDate: '2024-11-28',
        weight: 600,
        status: 'Delivered',
      });

    expect(response.status).toBe(200);
    expect(response.body.customerId).toBe(customerId2);
    expect(response.body.origin).toBe('Butwal');
    expect(response.body.destination).toBe('Pokhara');
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
});
