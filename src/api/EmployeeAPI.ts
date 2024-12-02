import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { Employee} from '../entity/Employee';

const router = Router();
const customerRepository = AppDataSource.getRepository(Employee);
export default router;



router.get('/employees/:employeeId?', async (req, res): Promise<void> => {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const { employeeId } = req.params;
  
    try {
      if (employeeId) {
        const id = parseInt(employeeId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid employee ID' });
          return;
        }
  
        const employee = await employeeRepository.findOneBy({ employeeId: id });
        if (!employee) {
          res.status(404).json({ message: 'Employee not found' });
          return;
        }
  
        res.json(employee);
      } else {
        const employees = await employeeRepository.find();
        res.json(employees);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employees', error });
    }
  });
  
  router.post('/employees', async (req, res): Promise<void> => {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const { firstName, lastName, seniority, isMechanic, certifiedVehicleTypes } = req.body;
  
    try {
      const newEmployee = employeeRepository.create({ 
        firstName, 
        lastName, 
        seniority, 
        isMechanic, 
        certifiedVehicleTypes 
      });
      await employeeRepository.save(newEmployee);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error creating employee', error });
    }
  });
  
  router.put('/employees/:employeeId', async (req, res): Promise<void> => {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const { employeeId } = req.params;
    const { firstName, lastName, seniority, isMechanic, certifiedVehicleTypes } = req.body;
  
    try {
      const id = parseInt(employeeId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid employee ID' });
        return;
      }
  
      const employee = await employeeRepository.findOneBy({ employeeId: id });
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
  
      employee.firstName = firstName;
      employee.lastName = lastName;
      employee.seniority = seniority;
      employee.isMechanic = isMechanic;
      employee.certifiedVehicleTypes = certifiedVehicleTypes;
  
      await employeeRepository.save(employee);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee', error });
    }
  });
  
  router.delete('/employees/:employeeId', async (req, res): Promise<void> => {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const { employeeId } = req.params;
  
    try {
      const id = parseInt(employeeId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid employee ID' });
        return;
      }
  
      const employee = await employeeRepository.findOneBy({ employeeId: id });
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
  
      await employeeRepository.remove(employee);
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting employee', error });
    }
  });