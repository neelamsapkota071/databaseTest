import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { MechanicRepairRecord} from '../entity/MechanicRepairRecord';
import { Employee} from '../entity/Employee';
import { Vehicle} from '../entity/Vehicle';

const router = Router();
const customerRepository = AppDataSource.getRepository(MechanicRepairRecord);
export default router;


router.get('/repairRecords/:repairId?', async (req, res): Promise<void> => {
    const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
    const { repairId } = req.params;
  
    try {
      if (repairId) {
        const id = parseInt(repairId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid repair ID' });
          return;
        }
  
        const repairRecord = await repairRepository.findOne({
          where: { repairId: id },
          relations: ['mechanicId', 'vehicleId'] // Load related employee and vehicle data
        });
        if (!repairRecord) {
          res.status(404).json({ message: 'Repair record not found' });
          return;
        }
  
        res.json(repairRecord);
      } else {
        const repairRecords = await repairRepository.find({ relations: ['mechanicId', 'vehicleId'] });
        res.json(repairRecords);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching repair records', error });
    }
  });
  
  router.post('/repairRecords', async (req, res): Promise<void> => {
    const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
    const { mechanicId, vehicleId, estimatedRepairTimeDays, actualRepairTimeDays } = req.body;
  
    try {
      const mechanic = await AppDataSource.getRepository(Employee).findOneBy({ employeeId: mechanicId });
      const vehicle = await AppDataSource.getRepository(Vehicle).findOneBy({ vehicleId });
  
      if (!mechanic || !vehicle) {
        res.status(400).json({ message: 'Invalid mechanic or vehicle ID' });
        return;
      }
  
      const newRepairRecord = repairRepository.create({
        mechanicId: mechanic,
        vehicleId: vehicle,
        estimatedRepairTimeDays,
        actualRepairTimeDays
      });
      await repairRepository.save(newRepairRecord);
      res.status(201).json(newRepairRecord);
    } catch (error) {
      res.status(500).json({ message: 'Error creating repair record', error });
    }
  });
  
  router.put('/repairRecords/:repairId', async (req, res): Promise<void> => {
    const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
    const { repairId } = req.params;
    const { mechanicId, vehicleId, estimatedRepairTimeDays, actualRepairTimeDays } = req.body;
  
    try {
      const id = parseInt(repairId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid repair ID' });
        return;
      }
  
      const repairRecord = await repairRepository.findOne({
        where: { repairId: id },
        relations: ['mechanicId', 'vehicleId']
      });
      if (!repairRecord) {
        res.status(404).json({ message: 'Repair record not found' });
        return;
      }
  
      const mechanic = await AppDataSource.getRepository(Employee).findOneBy({ employeeId: mechanicId });
      const vehicle = await AppDataSource.getRepository(Vehicle).findOneBy({ vehicleId });
  
      if (!mechanic || !vehicle) {
        res.status(400).json({ message: 'Invalid mechanic or vehicle ID' });
        return;
      }
  
      repairRecord.mechanicId = mechanic;
      repairRecord.vehicleId = vehicle;
      repairRecord.estimatedRepairTimeDays = estimatedRepairTimeDays;
      repairRecord.actualRepairTimeDays = actualRepairTimeDays;
  
      await repairRepository.save(repairRecord);
      res.json(repairRecord);
    } catch (error) {
      res.status(500).json({ message: 'Error updating repair record', error });
    }
  });
  
  router.delete('/repairRecords/:repairId', async (req, res): Promise<void> => {
    const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
    const { repairId } = req.params;
  
    try {
      const id = parseInt(repairId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid repair ID' });
        return;
      }
  
      const repairRecord = await repairRepository.findOne({
        where: { repairId: id },
        relations: ['mechanicId', 'vehicleId']
      });
      if (!repairRecord) {
        res.status(404).json({ message: 'Repair record not found' });
        return;
      }
  
      await repairRepository.remove(repairRecord);
      res.json({ message: 'Repair record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting repair record', error });
    }
  });