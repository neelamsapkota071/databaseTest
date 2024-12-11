import 'reflect-metadata';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { MechanicRepairRecord } from '../entity/MechanicRepairRecord';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';
import { Customer } from '../entity/Customer';
import { Shipment } from '../entity/Shipment';
import { setupTestDataSource } from '../test-utils';

let AppDataSource: DataSource;

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
});

afterAll(async () => {
  if (AppDataSource) {
    await AppDataSource.destroy();
  }
});

let customer1: Customer;
let customer2: Customer;

describe('Shipment Entity Tests', () => {
  beforeAll(async () => {
    const customerRepo = AppDataSource.getRepository(Customer);

    // create Customer 
    customer1 = await customerRepo.save({
      name: 'Aayush Basnet',
      address: '192 Lear Gate',
      phone1: '857-658-7596',
      phone2: '859-854-7896',
    });
    customer2 = await customerRepo.save({
      name: 'Rama Sakota',
      address: '458 Islington St',
      phone1: '984-594-4100',
      phone2: '986-611-0003',
    });

  });

  test('should create and retrieve a shipment', async () => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);

    const newShipment = shipmentRepository.create({
      customerId: customer1,
      origin: 'Kusuma',
      destination: 'Mustang',
      shipmentDate: new Date('2024-11-01'),
      weight: 200,
      status: 'In Transit',
    });

    await shipmentRepository.save(newShipment);

    const savedShipment = await shipmentRepository.findOneBy({
      shipmentId: newShipment.shipmentId,
    });

    expect(savedShipment).not.toBeNull();
    expect(savedShipment?.origin).toBe('Kusuma');
    expect(savedShipment?.destination).toBe('Mustang');
    expect(savedShipment?.weight).toBe(200);
    expect(savedShipment?.status).toBe('In Transit');
  });

  test('should update a shipment', async () => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);

    const newShipment = shipmentRepository.create({
      customerId: customer1,
      origin: 'Nepalgunj',
      destination: 'Pokhara',
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
      origin: 'Pokhara',
      destination: 'Lumbini',
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
