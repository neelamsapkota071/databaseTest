import { DataSource, ServerDescription } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import { Customer } from '../entity/Customer';

let AppDataSource: DataSource;

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
});

afterAll(async () => {
  if (AppDataSource) {
    await AppDataSource.destroy();
  }

});


describe('Customer Entity Tests', () => {
  test('should create and retrieve a customer', async () => {
    const customerRepository = AppDataSource.getRepository(Customer);

    const newCustomer = customerRepository.create({
      name: 'John Doe',
      address: '123 Elm Street',
      phone1: '555-1234',
      phone2: '555-5678',
    });

    await customerRepository.save(newCustomer);

    const savedCustomer = await customerRepository.findOneBy({
      customerId: newCustomer.customerId,
    });

    expect(savedCustomer).not.toBeNull();
    expect(savedCustomer?.name).toBe('John Doe');
    expect(savedCustomer?.address).toBe('123 Elm Street');
    expect(savedCustomer?.phone1).toBe('555-1234');
    expect(savedCustomer?.phone2).toBe('555-5678');
  });

  test('should update a customer', async () => {
    const customerRepository = AppDataSource.getRepository(Customer);

    const newCustomer = customerRepository.create({
      name: 'Jane Smith',
      address: '456 Oak Avenue',
      phone1: '555-1111',
      phone2: '555-2222',
    });

    await customerRepository.save(newCustomer);

    newCustomer.address = '789 Pine Road';
    await customerRepository.save(newCustomer);

    const updatedCustomer = await customerRepository.findOneBy({
      customerId: newCustomer.customerId,
    });

    expect(updatedCustomer?.address).toBe('789 Pine Road');
  });

  test('should delete a customer', async () => {
    const customerRepository = AppDataSource.getRepository(Customer);

    const newCustomer = customerRepository.create({
      name: 'Alice Brown',
      address: '101 Maple Lane',
      phone1: '555-3333',
      phone2: '555-4444',
    });

    await customerRepository.save(newCustomer);

    await customerRepository.delete(newCustomer.customerId);

    const deletedCustomer = await customerRepository.findOneBy({
      customerId: newCustomer.customerId,
    });

    expect(deletedCustomer).toBeNull();
  });
});
