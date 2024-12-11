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

describe('Customer API Routes', () => {
  test('GET /customers should return an empty array initially', async () => {
    const response = await request(new_server).get('/customers');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

test('POST /customers should create a new customer', async () => {
  const response = await request(new_server)
    .post('/customers')
     .send({
         name: 'Satnam Singh',
         address: '5250 Dundas St',
         phone1: '854-265-7496',
         phone2: '481-947-5267',
       });

     expect(response.status).toBe(201);
     expect(response.body.name).toBe('Satnam Singh');
     expect(response.body.address).toBe('5250 Dundas St');
     expect(response.body.phone1).toBe('854-265-7496');
     expect(response.body.phone2).toBe('481-947-5267');
   });

   test('GET /customers should return the created customer', async () => {
     const response = await request(new_server).get('/customers');
     expect(response.status).toBe(200);
     expect(response.body.length).toBe(1);
     expect(response.body[0].name).toBe('Satnam Singh');
   });

   test('GET /customers/:customerId should return a specific customer', async () => {
     const customersResponse = await request(new_server).get('/customers');
     const customerId = customersResponse.body[0].customerId;

     const response = await request(new_server).get(`/customers/${customerId}`);
     expect(response.status).toBe(200);
     expect(response.body.name).toBe('Satnam Singh');
   });

   test('PUT /customers/:customerId should update a customer', async () => {
     const customersResponse = await request(new_server).get('/customers');
     const customerId = customersResponse.body[0].customerId;

     const response = await request(new_server)
       .put(`/customers/${customerId}`)
       .send({
         name: 'Satnam Updated',
         address: '5251 Updated St',
         phone1: '854-265-7496',
         phone2: '482-948-5267',
       });

     expect(response.status).toBe(200);
     expect(response.body.name).toBe('Satnam Updated');
     expect(response.body.address).toBe('5251 Updated St');
     expect(response.body.phone2).toBe('482-948-5267');
   });

   test('DELETE /customers/:customerId should delete a customer', async () => {
     const customersResponse = await request(new_server).get('/customers');
     const customerId = customersResponse.body[0].customerId;

     const deleteResponse = await request(new_server).delete(`/customers/${customerId}`);
     expect(deleteResponse.status).toBe(200);

     const fetchResponse = await request(new_server).get(`/customers/${customerId}`);
     expect(fetchResponse.status).toBe(404);
   });
});
