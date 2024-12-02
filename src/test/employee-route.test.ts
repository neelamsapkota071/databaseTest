import request from 'supertest';
import { setupTestDataSource } from '../test-utils';
import { DataSource } from 'typeorm';

import  {app, server}  from '../app';
let AppDataSource: DataSource;

beforeAll(async () => {
  // import { app, server } from '../app'; // Import your Express app
;
  AppDataSource = await setupTestDataSource();
});

afterAll(async () => {
  if (AppDataSource) {
    server.close()
    await AppDataSource.destroy();
  }
});


describe('Employee API Routes', () => {
  test('GET /employees should return an empty array initially', async () => {
    expect(true).toBe(true)
  });

  test('POST /employees should create a new employee', async () => {

    const response = await request(app)
      .post('/employees')
      .send({
        firstName: 'Alice',
        lastName: 'Johnson',
        seniority: 5,
        isMechanic: true,
        certifiedVehicleTypes: ['Car', 'Truck'],
      });

    expect(response.status).toBe(201);
    expect(response.body.firstName).toBe('Alice');
    expect(response.body.lastName).toBe('Johnson');
    expect(response.body.seniority).toBe(5);
    expect(response.body.isMechanic).toBe(true);
    expect(response.body.certifiedVehicleTypes).toEqual(['Car', 'Truck']);
  });

  test('GET /employees should return the created employee', async () => {
    const response = await request(app).get('/employees');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Alice');
  });

  test('GET /employees/:employeeId should return a specific employee', async () => {
    const employeesResponse = await request(app).get('/employees');
    const employeeId = employeesResponse.body[0].employeeId;

    const response = await request(app).get(`/employees/${employeeId}`);
    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe('Alice');
  });

  test('PUT /employees/:employeeId should update an employee', async () => {
    const employeesResponse = await request(app).get('/employees');
    const employeeId = employeesResponse.body[0].employeeId;

    const response = await request(app)
      .put(`/employees/${employeeId}`)
      .send({
        firstName: 'Alice',
        lastName: 'Smith',
        seniority: 6,
        isMechanic: false,
        certifiedVehicleTypes: ['Bike'],
      });

    expect(response.status).toBe(200);
    expect(response.body.lastName).toBe('Smith');
    expect(response.body.seniority).toBe(6);
    expect(response.body.isMechanic).toBe(false);
    expect(response.body.certifiedVehicleTypes).toEqual(['Bike']);
  });

  test('DELETE /employees/:employeeId should delete an employee', async () => {
    const employeesResponse = await request(app).get('/employees');
    const employeeId = employeesResponse.body[0].employeeId;

    const deleteResponse = await request(app).delete(`/employees/${employeeId}`);
    expect(deleteResponse.status).toBe(200);

    const fetchResponse = await request(app).get(`/employees/${employeeId}`);
    expect(fetchResponse.status).toBe(404);
  });
});
