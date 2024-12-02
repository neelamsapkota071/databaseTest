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
  App = app;
});

afterAll(async () => {
  server.close()

  await connection.destroy();
});

describe('Route Entity Tests', () => {
  test('should create and retrieve a route', async () => {
    const routeRepository = AppDataSource.getRepository(Route);

    const newRoute = routeRepository.create({
      origin: 'Toronto',
      destination: 'Vancouver',
    });

    await routeRepository.save(newRoute);

    const savedRoute = await routeRepository.findOneBy({
      routeId: newRoute.routeId,
    });

    expect(savedRoute).not.toBeNull();
    expect(savedRoute?.origin).toBe('Toronto');
    expect(savedRoute?.destination).toBe('Vancouver');
  });

  test('should update a route', async () => {
    const routeRepository = AppDataSource.getRepository(Route);

    const newRoute = routeRepository.create({
      origin: 'Montreal',
      destination: 'Calgary',
    });

    await routeRepository.save(newRoute);

    newRoute.destination = 'Edmonton';
    await routeRepository.save(newRoute);

    const updatedRoute = await routeRepository.findOneBy({
      routeId: newRoute.routeId,
    });

    expect(updatedRoute?.destination).toBe('Edmonton');
  });

  test('should delete a route', async () => {
    const routeRepository = AppDataSource.getRepository(Route);

    const newRoute = routeRepository.create({
      origin: 'Halifax',
      destination: 'Winnipeg',
    });

    await routeRepository.save(newRoute);

    await routeRepository.delete(newRoute.routeId);

    const deletedRoute = await routeRepository.findOneBy({
      routeId: newRoute.routeId,
    });

    expect(deletedRoute).toBeNull();
  });
});
