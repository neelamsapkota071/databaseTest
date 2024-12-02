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
let App: any; // Express app instance
let connection: DataSource;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  App = app; // Assuming your app is exported as `App`
});

afterAll(async () => {
  server.close()
  await connection.destroy();
});

describe('Vehicle API Tests', () => {
  test('should create a new vehicle', async () => {
    const response = await request(app)
      .post('/vehicles')
      .send({
        vehicleType: 'Truck',
        brand: 'Ford',
        loadCapacity: 1500,
        year: 2020,
        numRepairs: 2,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      vehicleType: 'Truck',
      brand: 'Ford',
      loadCapacity: 1500,
      year: 2020,
      numRepairs: 2,
    });
  });

  test('should fetch all vehicles', async () => {
    const response = await request(app).get('/vehicles');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should fetch a single vehicle by ID', async () => {
    const newVehicle = AppDataSource.getRepository(Vehicle).create({
      vehicleType: 'Van',
      brand: 'Toyota',
      loadCapacity: 1200,
      year: 2019,
      numRepairs: 1,
    });
    await AppDataSource.getRepository(Vehicle).save(newVehicle);

    const response = await request(app).get(`/vehicles/${newVehicle.vehicleId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      vehicleId: newVehicle.vehicleId,
      vehicleType: 'Van',
      brand: 'Toyota',
      loadCapacity: 1200,
      year: 2019,
      numRepairs: 1,
    });
  });

  test('should update a vehicle', async () => {
    const newVehicle = AppDataSource.getRepository(Vehicle).create({
      vehicleType: 'SUV',
      brand: 'Honda',
      loadCapacity: 1000,
      year: 2018,
      numRepairs: 0,
    });
    await AppDataSource.getRepository(Vehicle).save(newVehicle);

    const response = await request(app)
      .put(`/vehicles/${newVehicle.vehicleId}`)
      .send({
        vehicleType: 'SUV',
        brand: 'Honda',
        loadCapacity: 1200,
        year: 2018,
        numRepairs: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      vehicleId: newVehicle.vehicleId,
      vehicleType: 'SUV',
      brand: 'Honda',
      loadCapacity: 1200,
      year: 2018,
      numRepairs: 2,
    });
  });

  test('should delete a vehicle', async () => {
    const newVehicle = AppDataSource.getRepository(Vehicle).create({
      vehicleType: 'Sedan',
      brand: 'Chevrolet',
      loadCapacity: 800,
      year: 2017,
      numRepairs: 3,
    });
    await AppDataSource.getRepository(Vehicle).save(newVehicle);

    const response = await request(app).delete(`/vehicles/${newVehicle.vehicleId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: 'Vehicle deleted successfully' });

    const deletedVehicle = await AppDataSource.getRepository(Vehicle).findOneBy({
      vehicleId: newVehicle.vehicleId,
    });
    expect(deletedVehicle).toBeNull();
  });

  test('should handle invalid vehicle ID', async () => {
    const response = await request(app).get('/vehicles/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: 'Invalid vehicle ID' });
  });

  test('should return 404 for non-existent vehicle', async () => {
    const response = await request(app).get('/vehicles/9999');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Vehicle not found' });
  });
});

