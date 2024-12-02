import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { TripShipment} from '../entity/TripShipment';

const router = Router();
const customerRepository = AppDataSource.getRepository(TripShipment);
export default router;

router.get('/tripshipments/:tripShipmentId?', async (req, res): Promise<void> => {
    const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
    const { tripShipmentId } = req.params;
  
    try {
      if (tripShipmentId) {
        const id = parseInt(tripShipmentId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid trip shipment ID' });
          return;
        }
  
        const tripShipment = await tripShipmentRepository.findOneBy({ tripShipmentId: id });
        if (!tripShipment) {
          res.status(404).json({ message: 'Trip shipment not found' });
          return;
        }
  
        res.json(tripShipment);
      } else {
        const tripShipments = await tripShipmentRepository.find();
        res.json(tripShipments);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching trip shipments', error });
    }
  });
  
  router.post('/tripshipments', async (req, res): Promise<void> => {
    const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
    const { tripId, shipmentId } = req.body;
  
    try {
      const newTripShipment = tripShipmentRepository.create({ tripId, shipmentId });
      await tripShipmentRepository.save(newTripShipment);
      res.status(201).json(newTripShipment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating trip shipment', error });
    }
  });
  
  router.put('/tripshipments/:tripShipmentId', async (req, res): Promise<void> => {
    const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
    const { tripShipmentId } = req.params;
    const { tripId, shipmentId } = req.body;
  
    try {
      const id = parseInt(tripShipmentId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid trip shipment ID' });
        return;
      }
  
      const tripShipment = await tripShipmentRepository.findOneBy({ tripShipmentId: id });
      if (!tripShipment) {
        res.status(404).json({ message: 'Trip shipment not found' });
        return;
      }
  
      tripShipment.tripId = tripId;
      tripShipment.shipmentId = shipmentId;
  
      await tripShipmentRepository.save(tripShipment);
      res.json(tripShipment);
    } catch (error) {
      res.status(500).json({ message: 'Error updating trip shipment', error });
    }
  });
  
  router.delete('/tripshipments/:tripShipmentId', async (req, res): Promise<void> => {
    const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
    const { tripShipmentId } = req.params;
  
    try {
      const id = parseInt(tripShipmentId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid trip shipment ID' });
        return;
      }
  
      const tripShipment = await tripShipmentRepository.findOneBy({ tripShipmentId: id });
      if (!tripShipment) {
        res.status(404).json({ message: 'Trip shipment not found' });
        return;
      }
  
      await tripShipmentRepository.remove(tripShipment);
      res.json({ message: 'Trip shipment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting trip shipment', error });
    }
  });