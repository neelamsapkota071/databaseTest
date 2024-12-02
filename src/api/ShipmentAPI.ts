import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { Shipment} from '../entity/Shipment';

const router = Router();
const customerRepository = AppDataSource.getRepository(Shipment);
export default router;


router.get('/shipments/:shipmentId?', async (req, res): Promise<void> => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);
    const { shipmentId } = req.params;
  
    try {
      if (shipmentId) {
        const id = parseInt(shipmentId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid shipment ID' });
          return;
        }
  
        const shipment = await shipmentRepository.findOneBy({ shipmentId: id });
        if (!shipment) {
          res.status(404).json({ message: 'Shipment not found' });
          return;
        }
  
        res.json(shipment);
      } else {
        const shipments = await shipmentRepository.find();
        res.json(shipments);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching shipments', error });
    }
  });
  
  router.post('/shipments', async (req, res): Promise<void> => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);
    const { customerId, origin, destination, shipmentDate, weight, status } = req.body;
  
    try {
      const newShipment = shipmentRepository.create({
        customerId,
        origin,
        destination,
        shipmentDate,
        weight,
        status
      });
      await shipmentRepository.save(newShipment);
      res.status(201).json(newShipment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating shipment', error });
    }
  });
  
  router.put('/shipments/:shipmentId', async (req, res): Promise<void> => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);
    const { shipmentId } = req.params;
    const { customerId, origin, destination, shipmentDate, weight, status } = req.body;
  
    try {
      const id = parseInt(shipmentId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid shipment ID' });
        return;
      }
  
      const shipment = await shipmentRepository.findOneBy({ shipmentId: id });
      if (!shipment) {
        res.status(404).json({ message: 'Shipment not found' });
        return;
      }
  
      shipment.customerId = customerId;
      shipment.origin = origin;
      shipment.destination = destination;
      shipment.shipmentDate = shipmentDate;
      shipment.weight = weight;
      shipment.status = status;
  
      await shipmentRepository.save(shipment);
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ message: 'Error updating shipment', error });
    }
  });
  
  router.delete('/shipments/:shipmentId', async (req, res): Promise<void> => {
    const shipmentRepository = AppDataSource.getRepository(Shipment);
    const { shipmentId } = req.params;
  
    try {
      const id = parseInt(shipmentId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid shipment ID' });
        return;
      }
  
      const shipment = await shipmentRepository.findOneBy({ shipmentId: id });
      if (!shipment) {
        res.status(404).json({ message: 'Shipment not found' });
        return;
      }
  
      await shipmentRepository.remove(shipment);
      res.json({ message: 'Shipment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting shipment', error });
    }
  });
  