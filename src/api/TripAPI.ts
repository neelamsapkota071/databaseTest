import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { Trip} from '../entity/Trip';

const router = Router();
const customerRepository = AppDataSource.getRepository(Trip);
export default router;

router.get('/trips/:tripId?', async (req, res): Promise<void> => {
    const tripRepository = AppDataSource.getRepository(Trip);
    const { tripId } = req.params;
  
    try {
      if (tripId) {
        const id = parseInt(tripId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid trip ID' });
          return;
        }
  
        const trip = await tripRepository.findOneBy({ tripId: id });
        if (!trip) {
          res.status(404).json({ message: 'Trip not found' });
          return;
        }
  
        res.json(trip);
      } else {
        const trips = await tripRepository.find();
        res.json(trips);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching trips', error });
    }
  });
  
  router.post('/trips', async (req, res): Promise<void> => {
    const tripRepository = AppDataSource.getRepository(Trip);
    const { routeId, vehicleId, driver1Id, driver2Id } = req.body;
  
    try {
      const newTrip = tripRepository.create({
        routeId,
        vehicleId,
        driver1Id,
        driver2Id
      });
      await tripRepository.save(newTrip);
      res.status(201).json(newTrip);
    } catch (error) {
      res.status(500).json({ message: 'Error creating trip', error });
    }
  });
  
  router.put('/trips/:tripId', async (req, res): Promise<void> => {
    const tripRepository = AppDataSource.getRepository(Trip);
    const { tripId } = req.params;
    const { routeId, vehicleId, driver1Id, driver2Id } = req.body;
  
    try {
      const id = parseInt(tripId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid trip ID' });
        return;
      }
  
      const trip = await tripRepository.findOneBy({ tripId: id });
      if (!trip) {
        res.status(404).json({ message: 'Trip not found' });
        return;
      }
  
      trip.routeId = routeId;
      trip.vehicleId = vehicleId;
      trip.driver1Id = driver1Id;
      trip.driver2Id = driver2Id;
  
      await tripRepository.save(trip);
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: 'Error updating trip', error });
    }
  });
  
  router.delete('/trips/:tripId', async (req, res): Promise<void> => {
    const tripRepository = AppDataSource.getRepository(Trip);
    const { tripId } = req.params;
  
    try {
      const id = parseInt(tripId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid trip ID' });
        return;
      }
  
      const trip = await tripRepository.findOneBy({ tripId: id });
      if (!trip) {
        res.status(404).json({ message: 'Trip not found' });
        return;
      }
  
      await tripRepository.remove(trip);
      res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting trip', error });
    }
  });