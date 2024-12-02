import 'reflect-metadata';
import { Router } from 'express';
import { AppDataSource } from '../ormconfig';
import { Customer } from '../entity/Customer';

const router = Router();
const customerRepository = AppDataSource.getRepository(Customer);

export default router;

//////////////////////////////////customer/////////////////////////////////////////////////////////////////

router.get('/customers/:customerId?', async (req, res): Promise<void> => {
    const customerRepository = AppDataSource.getRepository(Customer);
    const { customerId } = req.params;
  
    try {
      if (customerId) {
        const id = parseInt(customerId, 10); // Convert string to number
        if (isNaN(id)) {
          res.status(400).json({ message: 'Invalid customer ID' });
          return;
        }
  
        const customer = await customerRepository.findOneBy({ customerId: id });
        if (!customer) {
          res.status(404).json({ message: 'Customer not found' });
          return;
        }
  
        res.json(customer);
      } else {
        const customers = await customerRepository.find();
        res.json(customers);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers', error });
    }
  });
  
  router.post('/customers', async (req, res): Promise<void> => {
    const customerRepository = AppDataSource.getRepository(Customer);
    const { name, address, phone1, phone2 } = req.body;
  
    try {
      const newCustomer = customerRepository.create({ name, address, phone1, phone2 });
      await customerRepository.save(newCustomer);
      res.status(201).json(newCustomer);
    } catch (error) {
      res.status(500).json({ message: 'Error creating customer', error });
    }
  });
  
  router.put('/customers/:customerId', async (req, res): Promise<void> => {
    const customerRepository = AppDataSource.getRepository(Customer);
    const { customerId } = req.params;
    const { name, address, phone1, phone2 } = req.body;
  
    try {
      const id = parseInt(customerId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid customer ID' });
        return;
      }
  
      const customer = await customerRepository.findOneBy({ customerId: id });
      if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
  
      customer.name = name;
      customer.address = address;
      customer.phone1 = phone1;
      customer.phone2 = phone2;
  
      await customerRepository.save(customer);
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating customer', error });
    }
  });
  
  router.delete('/customers/:customerId', async (req, res): Promise<void> => {
    const customerRepository = AppDataSource.getRepository(Customer);
    const { customerId } = req.params;
  
    try {
      const id = parseInt(customerId, 10); // Convert string to number
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid customer ID' });
        return;
      }
  
      const customer = await customerRepository.findOneBy({ customerId: id });
      if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
  
      await customerRepository.remove(customer);
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting customer', error });
    }
  });
  