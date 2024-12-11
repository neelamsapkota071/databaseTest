import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import request from 'supertest';
import { Vehicle } from '../entity/Vehicle';
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

describe('Vehicle API Tests', () => {
  test('should create a new vehicle', async () => {
    const response = await request(new_server)
      .post('/vehicles')
      .send({
        vehicleType: 'Truck',
        brand: 'Tesla',
        loadCapacity: 1500,
        year: 2020,
        numRepairs: 2,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      vehicleType: 'Truck',
      brand: 'Tesla',
      loadCapacity: 1500,
      year: 2020,
      numRepairs: 2,
    });
  });

  test('should fetch all vehicles', async () => {
    const response = await request(new_server).get('/vehicles');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should fetch a single vehicle by ID', async () => {
    const newVehicle = AppDataSource.getRepository(Vehicle).create({
      vehicleType: 'Van',
      brand: 'BYD',
      loadCapacity: 1200,
      year: 2019,
      numRepairs: 1,
    });
    await AppDataSource.getRepository(Vehicle).save(newVehicle);

    const response = await request(new_server).get(`/vehicles/${newVehicle.vehicleId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      vehicleId: newVehicle.vehicleId,
      vehicleType: 'Van',
      brand: 'BYD',
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

    const response = await request(new_server)
      .put(`/vehicles/${newVehicle.vehicleId}`)
      .send({
        vehicleType: 'SUV',
        brand: 'Neta',
        loadCapacity: 1200,
        year: 2018,
        numRepairs: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      vehicleId: newVehicle.vehicleId,
      vehicleType: 'SUV',
      brand: 'Neta',
      loadCapacity: 1200,
      year: 2018,
      numRepairs: 2,
    });
  });

  test('should delete a vehicle', async () => {
    const newVehicle = AppDataSource.getRepository(Vehicle).create({
      vehicleType: 'Sedan',
      brand: 'Tata',
      loadCapacity: 800,
      year: 2017,
      numRepairs: 3,
    });
    await AppDataSource.getRepository(Vehicle).save(newVehicle);

    const response = await request(new_server).delete(`/vehicles/${newVehicle.vehicleId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: 'Vehicle deleted successfully' });

    const deletedVehicle = await AppDataSource.getRepository(Vehicle).findOneBy({
      vehicleId: newVehicle.vehicleId,
    });
    expect(deletedVehicle).toBeNull();
  });
});

