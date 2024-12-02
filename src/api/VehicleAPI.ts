import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { Vehicle} from '../entity/Vehicle';

const router = Router();
const customerRepository = AppDataSource.getRepository(Vehicle);
export default router;

router.get('/vehicles/:vehicleId?', async (req, res): Promise<void> => {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const { vehicleId } = req.params;
  
    try {
      if (vehicleId) {
        const id = parseInt(vehicleId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid vehicle ID' });
          return;
        }
  
        const vehicle = await vehicleRepository.findOneBy({ vehicleId: id });
        if (!vehicle) {
          res.status(404).json({ message: 'Vehicle not found' });
          return;
        }
  
        res.json(vehicle);
      } else {
        const vehicles = await vehicleRepository.find();
        res.json(vehicles);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vehicles', error });
    }
  });
  
  router.post('/vehicles', async (req, res): Promise<void> => {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const { vehicleType, brand, loadCapacity, year, numRepairs } = req.body;
  
    try {
      const newVehicle = vehicleRepository.create({
        vehicleType,
        brand,
        loadCapacity,
        year,
        numRepairs
      });
      await vehicleRepository.save(newVehicle);
      res.status(201).json(newVehicle);
    } catch (error) {
      res.status(500).json({ message: 'Error creating vehicle', error });
    }
  });
  
  router.put('/vehicles/:vehicleId', async (req, res): Promise<void> => {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const { vehicleId } = req.params;
    const { vehicleType, brand, loadCapacity, year, numRepairs } = req.body;
  
    try {
      const id = parseInt(vehicleId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid vehicle ID' });
        return;
      }
  
      const vehicle = await vehicleRepository.findOneBy({ vehicleId: id });
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }
  
      vehicle.vehicleType = vehicleType;
      vehicle.brand = brand;
      vehicle.loadCapacity = loadCapacity;
      vehicle.year = year;
      vehicle.numRepairs = numRepairs;
  
      await vehicleRepository.save(vehicle);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: 'Error updating vehicle', error });
    }
  });
  
  router.delete('/vehicles/:vehicleId', async (req, res): Promise<void> => {
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const { vehicleId } = req.params;
  
    try {
      const id = parseInt(vehicleId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid vehicle ID' });
        return;
      }
  
      const vehicle = await vehicleRepository.findOneBy({ vehicleId: id });
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }
  
      await vehicleRepository.remove(vehicle);
      res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting vehicle', error });
    }
  });