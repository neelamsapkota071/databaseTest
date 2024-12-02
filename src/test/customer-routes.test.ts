import request from 'supertest';
import { setupTestDataSource } from '../test-utils';
import { DataSource } from 'typeorm';

import  {app, server}  from '../app';

let AppDataSource: DataSource;

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
});

afterAll(async () => {
  if (AppDataSource) {
    server.close()
    await AppDataSource.destroy();
  }
});

describe('Customer API Routes', () => {
  test('GET /customers should return an empty array initially', async () => {
    const response = await request(app).get('/customers');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

test('POST /customers should create a new customer', async () => {
  const response = await request(app)
    .post('/customers')
     .send({
   name: 'John Doe',
         address: '123 Main St',
         phone1: '123-456-7890',
         phone2: '987-654-3210',
       });

     expect(response.status).toBe(201);
     expect(response.body.name).toBe('John Doe');
     expect(response.body.address).toBe('123 Main St');
     expect(response.body.phone1).toBe('123-456-7890');
     expect(response.body.phone2).toBe('987-654-3210');
   });

   test('GET /customers should return the created customer', async () => {
     const response = await request(app).get('/customers');
     expect(response.status).toBe(200);
     expect(response.body.length).toBe(1);
     expect(response.body[0].name).toBe('John Doe');
   });

   test('GET /customers/:customerId should return a specific customer', async () => {
     const customersResponse = await request(app).get('/customers');
     const customerId = customersResponse.body[0].customerId;

     const response = await request(app).get(`/customers/${customerId}`);
     expect(response.status).toBe(200);
     expect(response.body.name).toBe('John Doe');
   });

   test('PUT /customers/:customerId should update a customer', async () => {
     const customersResponse = await request(app).get('/customers');
     const customerId = customersResponse.body[0].customerId;

     const response = await request(app)
       .put(`/customers/${customerId}`)
       .send({
         name: 'Jane Doe',
         address: '456 Elm St',
         phone1: '123-456-7890',
         phone2: '111-222-3333',
       });

     expect(response.status).toBe(200);
     expect(response.body.name).toBe('Jane Doe');
     expect(response.body.address).toBe('456 Elm St');
     expect(response.body.phone2).toBe('111-222-3333');
   });

   test('DELETE /customers/:customerId should delete a customer', async () => {
     const customersResponse = await request(app).get('/customers');
     const customerId = customersResponse.body[0].customerId;

     const deleteResponse = await request(app).delete(`/customers/${customerId}`);
     expect(deleteResponse.status).toBe(200);

     const fetchResponse = await request(app).get(`/customers/${customerId}`);
     expect(fetchResponse.status).toBe(404);
   });
});
