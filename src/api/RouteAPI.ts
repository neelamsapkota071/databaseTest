import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { Route } from '../entity/Route';

const router = Router();
const customerRepository = AppDataSource.getRepository(Route);
export default router;


router.get('/routes/:routeId?', async (req, res): Promise<void> => {
    const routeRepository = AppDataSource.getRepository(Route);
    const { routeId } = req.params;
  
    try {
      if (routeId) {
        const id = parseInt(routeId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid route ID' });
          return;
        }
  
        const route = await routeRepository.findOneBy({ routeId: id });
        if (!route) {
          res.status(404).json({ message: 'Route not found' });
          return;
        }
  
        res.json(route);
      } else {
        const routes = await routeRepository.find();
        res.json(routes);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching routes', error });
    }
  });
  
  router.post('/routes', async (req, res): Promise<void> => {
    const routeRepository = AppDataSource.getRepository(Route);
    const { origin, destination } = req.body;
  
    try {
      const newRoute = routeRepository.create({ origin, destination });
      await routeRepository.save(newRoute);
      res.status(201).json(newRoute);
    } catch (error) {
      res.status(500).json({ message: 'Error creating route', error });
    }
  });
  
  router.put('/routes/:routeId', async (req, res): Promise<void> => {
    const routeRepository = AppDataSource.getRepository(Route);
    const { routeId } = req.params;
    const { origin, destination } = req.body;
  
    try {
      const id = parseInt(routeId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid route ID' });
        return;
      }
  
      const route = await routeRepository.findOneBy({ routeId: id });
      if (!route) {
        res.status(404).json({ message: 'Route not found' });
        return;
      }
  
      route.origin = origin;
      route.destination = destination;
  
      await routeRepository.save(route);
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: 'Error updating route', error });
    }
  });
  
  router.delete('/routes/:routeId', async (req, res): Promise<void> => {
    const routeRepository = AppDataSource.getRepository(Route);
    const { routeId } = req.params;
  
    try {
      const id = parseInt(routeId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid route ID' });
        return;
      }
  
      const route = await routeRepository.findOneBy({ routeId: id });
      if (!route) {
        res.status(404).json({ message: 'Route not found' });
        return;
      }
  
      await routeRepository.remove(route);
      res.json({ message: 'Route deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting route', error });
    }
  });