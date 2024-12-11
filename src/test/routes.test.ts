import { DataSource } from 'typeorm';
import { setupTestDataSource } from '../test-utils';
import { Trip } from '../entity/Trip';
import request from 'supertest';
import { Employee } from '../entity/Employee';
import { Vehicle } from '../entity/Vehicle';
import { Route } from '../entity/Route';
import { rootCertificates } from 'tls';
import { connect } from 'http2';

let AppDataSource: DataSource;

beforeAll(async () => {
  AppDataSource = await setupTestDataSource();
});

afterAll(async () => {
  if (AppDataSource) {
    await AppDataSource.destroy();
  }
});

describe('Route Entity Tests', () => {
  test('should create and retrieve a route', async () => {
    const routeRepository = AppDataSource.getRepository(Route);

    const newRoute = routeRepository.create({
      origin: 'Milton',
      destination: 'Mississauga',
    });

    await routeRepository.save(newRoute);

    const savedRoute = await routeRepository.findOneBy({
      routeId: newRoute.routeId,
    });

    expect(savedRoute).not.toBeNull();
    expect(savedRoute?.origin).toBe('Milton');
    expect(savedRoute?.destination).toBe('Mississauga');
  });

  test('should update a route', async () => {
    const routeRepository = AppDataSource.getRepository(Route);

    const newRoute = routeRepository.create({
      origin: 'Nepal',
      destination: 'Dubai',
    });

    await routeRepository.save(newRoute);

    newRoute.destination = 'Dubai Updated';
    await routeRepository.save(newRoute);

    const updatedRoute = await routeRepository.findOneBy({
      routeId: newRoute.routeId,
    });

    expect(updatedRoute?.destination).toBe('Dubai Updated');
  });

  test('should delete a route', async () => {
    const routeRepository = AppDataSource.getRepository(Route);

    const newRoute = routeRepository.create({
      origin: 'Butwal',
      destination: 'Pokhara',
    });

    await routeRepository.save(newRoute);

    await routeRepository.delete(newRoute.routeId);

    const deletedRoute = await routeRepository.findOneBy({
      routeId: newRoute.routeId,
    });

    expect(deletedRoute).toBeNull();
  });
});
