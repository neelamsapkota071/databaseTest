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
      name: 'Srusti Patel',
      address: '485 Queen St',
      phone1: '748-547-8521',
      phone2: '897-524-9685',
    });

    await customerRepository.save(newCustomer);

    const savedCustomer = await customerRepository.findOneBy({
      customerId: newCustomer.customerId,
    });

    expect(savedCustomer).not.toBeNull();
    expect(savedCustomer?.name).toBe('Srusti Patel');
    expect(savedCustomer?.address).toBe('485 Queen St');
    expect(savedCustomer?.phone1).toBe('748-547-8521');
    expect(savedCustomer?.phone2).toBe('897-524-9685');
  });

  test('should update a customer', async () => {
    const customerRepository = AppDataSource.getRepository(Customer);

    const newCustomer = customerRepository.create({
      name: 'Rama Sakota',
      address: '458 Islington St',
      phone1: '984-594-4100',
      phone2: '986-611-0003',
    });

    await customerRepository.save(newCustomer);

    newCustomer.address = '458 Islington St';
    await customerRepository.save(newCustomer);

    const updatedCustomer = await customerRepository.findOneBy({
      customerId: newCustomer.customerId,
    });

    expect(updatedCustomer?.address).toBe('458 Islington St');
  });

  test('should delete a customer', async () => {
    const customerRepository = AppDataSource.getRepository(Customer);

    const newCustomer = customerRepository.create({
      name: 'Aayush Basnet',
      address: '192 Lear Gate',
      phone1: '857-658-7596',
      phone2: '859-854-7896',
    });

    await customerRepository.save(newCustomer);

    await customerRepository.delete(newCustomer.customerId);

    const deletedCustomer = await customerRepository.findOneBy({
      customerId: newCustomer.customerId,
    });

    expect(deletedCustomer).toBeNull();
  });
});
