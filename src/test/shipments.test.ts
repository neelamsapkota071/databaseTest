import 'reflect-metadata';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { app, server } from '../app'; // Assuming Express app is exported from this module
import { AppDataSource } from '../ormconfig';
import { MechanicRepairRecord } from '../entity/MechanicRepairRecord';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';
import { Customer } from '../entity/Customer';
import { Shipment } from '../entity/Shipment';

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

let customer1: Customer;
let customer2: Customer;

describe('Shipment Entity Tests', () => {
  beforeAll(async () => {
    const customerRepo = connection.getRepository(Customer);

    // create Customer 
    customer1 = await customerRepo.save({
      name: 'John Doe',
      address: '123 Elm Street',
      phone1: '555-1234',
      phone2: '555-5678',
    });
    customer2 = await customerRepo.save({
      name: 'John Doe',
      address: '123 Elm Street',
      phone1: '555-1234',
      phone2: '555-5678',
    });

  });

  test('should create and retrieve a shipment', async () => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);

    const newShipment = shipmentRepository.create({
      customerId: customer1,
      origin: 'New York',
      destination: 'Los Angeles',
      shipmentDate: new Date('2024-11-01'),
      weight: 200,
      status: 'In Transit',
    });

    await shipmentRepository.save(newShipment);

    const savedShipment = await shipmentRepository.findOneBy({
      shipmentId: newShipment.shipmentId,
    });

    expect(savedShipment).not.toBeNull();
    expect(savedShipment?.origin).toBe('New York');
    expect(savedShipment?.destination).toBe('Los Angeles');
    expect(savedShipment?.weight).toBe(200);
    expect(savedShipment?.status).toBe('In Transit');
  });

  test('should update a shipment', async () => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);

    const newShipment = shipmentRepository.create({
      customerId: customer1,
      origin: 'San Francisco',
      destination: 'Chicago',
      shipmentDate: new Date('2024-11-02'),
      weight: 300,
      status: 'Pending',
    });

    await shipmentRepository.save(newShipment);

    newShipment.status = 'Delivered';
    await shipmentRepository.save(newShipment);

    const updatedShipment = await shipmentRepository.findOneBy({
      shipmentId: newShipment.shipmentId,
    });

    expect(updatedShipment?.status).toBe('Delivered');
  });

  test('should delete a shipment', async () => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);

    const newShipment = shipmentRepository.create({
      customerId: customer2,
      origin: 'Houston',
      destination: 'Miami',
      shipmentDate: new Date('2024-11-03'),
      weight: 150,
      status: 'Pending',
    });

    await shipmentRepository.save(newShipment);

    await shipmentRepository.delete(newShipment.shipmentId);

    const deletedShipment = await shipmentRepository.findOneBy({
      shipmentId: newShipment.shipmentId,
    });

    expect(deletedShipment).toBeNull();
  });
});
