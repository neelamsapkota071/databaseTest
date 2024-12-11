import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import { Employee } from '../entity/Employee';

let AppDataSource: DataSource;

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
});

afterAll(async () => {
  if (AppDataSource) {
    await AppDataSource.destroy();
  }
});

describe('Employee Entity Tests', () => {
  test('should create and retrieve an employee', async () => {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const newEmployee = employeeRepository.create({
      firstName: 'test',
      lastName: 'test',
      seniority: 5,
      isMechanic: true,
      certifiedVehicleTypes: ['Car', 'Truck'],
    });

    await employeeRepository.save(newEmployee);

    const savedEmployee = await employeeRepository.findOneBy({
      employeeId: newEmployee.employeeId,
    });

    expect(savedEmployee).not.toBeNull();
    expect(savedEmployee?.firstName).toBe('test');
    expect(savedEmployee?.lastName).toBe('test');
    expect(savedEmployee?.seniority).toBe(5);
    expect(savedEmployee?.isMechanic).toBe(true);
    expect(savedEmployee?.certifiedVehicleTypes).toEqual(['Car', 'Truck']);
  });

  test('should update an employee', async () => {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const newEmployee = employeeRepository.create({
      firstName: 'test1',
      lastName: 'test2',
      seniority: 3,
      isMechanic: false,
      certifiedVehicleTypes: ['Bike'],
    });

    await employeeRepository.save(newEmployee);

    newEmployee.seniority = 4;
    newEmployee.isMechanic = true;
    await employeeRepository.save(newEmployee);

    const updatedEmployee = await employeeRepository.findOneBy({
      employeeId: newEmployee.employeeId,
    });

    expect(updatedEmployee?.seniority).toBe(4);
    expect(updatedEmployee?.isMechanic).toBe(true);
  });

  test('should delete an employee', async () => {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const newEmployee = employeeRepository.create({
      firstName: 'neelam',
      lastName: 'sapkota',
      seniority: 2,
      isMechanic: false,
      certifiedVehicleTypes: ['Scooter'],
    });

    await employeeRepository.save(newEmployee);

    await employeeRepository.delete(newEmployee.employeeId);

    const deletedEmployee = await employeeRepository.findOneBy({
      employeeId: newEmployee.employeeId,
    });

    expect(deletedEmployee).toBeNull();
  });
});
