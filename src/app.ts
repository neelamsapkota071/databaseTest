import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import { Customer } from './entity/Customer';
import { Employee } from './entity/Employee';
import { MechanicRepairRecord } from './entity/MechanicRepairRecord';
import { Vehicle } from './entity/Vehicle';
import { Route } from './entity/Route';
import { Shipment } from './entity/Shipment';
import { Trip } from './entity/Trip';
import { TripShipment } from './entity/TripShipment';

import express from 'express';
const app = express();

const port = 3000;

app.use(express.json());

// 
import customerAPI from './api/CustomerAPI';
import employeeAPI from './api/EmployeeAPI';
import mechanicRepairRecordAPI from './api/MeachanicRepairRecordsAPI';
import routeAPI from './api/RouteAPI';
import shipmentAPI from './api/ShipmentAPI';
import tripAPI from './api/TripAPI';
import tripShipmentAPI from './api/TripShipmentAPI';
import vehicleAPI from './api/VehicleAPI';

app.use('/', customerAPI);
app.use('/', employeeAPI);
app.use('/', mechanicRepairRecordAPI);
app.use('/', routeAPI);
app.use('/', shipmentAPI);
app.use('/', tripAPI);
app.use('/', tripShipmentAPI);
app.use('/', vehicleAPI);


//////////////////////////////////customer/////////////////////////////////////////////////////////////////

// app.get('/customers/:customerId?', async (req, res): Promise<void> => {
//   const customerRepository = AppDataSource.getRepository(Customer);
//   const { customerId } = req.params;

//   try {
//     if (customerId) {
//       const id = parseInt(customerId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid customer ID' });
//         return;
//       }

//       const customer = await customerRepository.findOneBy({ customerId: id });
//       if (!customer) {
//         res.status(404).json({ message: 'Customer not found' });
//         return;
//       }

//       res.json(customer);
//     } else {
//       const customers = await customerRepository.find();
//       res.json(customers);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching customers', error });
//   }
// });

// app.post('/customers', async (req, res): Promise<void> => {
//   const customerRepository = AppDataSource.getRepository(Customer);
//   const { name, address, phone1, phone2 } = req.body;

//   try {
//     const newCustomer = customerRepository.create({ name, address, phone1, phone2 });
//     await customerRepository.save(newCustomer);
//     res.status(201).json(newCustomer);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating customer', error });
//   }
// });

// app.put('/customers/:customerId', async (req, res): Promise<void> => {
//   const customerRepository = AppDataSource.getRepository(Customer);
//   const { customerId } = req.params;
//   const { name, address, phone1, phone2 } = req.body;

//   try {
//     const id = parseInt(customerId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid customer ID' });
//       return;
//     }

//     const customer = await customerRepository.findOneBy({ customerId: id });
//     if (!customer) {
//       res.status(404).json({ message: 'Customer not found' });
//       return;
//     }

//     customer.name = name;
//     customer.address = address;
//     customer.phone1 = phone1;
//     customer.phone2 = phone2;

//     await customerRepository.save(customer);
//     res.json(customer);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating customer', error });
//   }
// });

// app.delete('/customers/:customerId', async (req, res): Promise<void> => {
//   const customerRepository = AppDataSource.getRepository(Customer);
//   const { customerId } = req.params;

//   try {
//     const id = parseInt(customerId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid customer ID' });
//       return;
//     }

//     const customer = await customerRepository.findOneBy({ customerId: id });
//     if (!customer) {
//       res.status(404).json({ message: 'Customer not found' });
//       return;
//     }

//     await customerRepository.remove(customer);
//     res.json({ message: 'Customer deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting customer', error });
//   }
// });


///////////////////////////////////////////////Employee///////////////////////////////////////////////
// app.get('/employees/:employeeId?', async (req, res): Promise<void> => {
//   const employeeRepository = AppDataSource.getRepository(Employee);
//   const { employeeId } = req.params;

//   try {
//     if (employeeId) {
//       const id = parseInt(employeeId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid employee ID' });
//         return;
//       }

//       const employee = await employeeRepository.findOneBy({ employeeId: id });
//       if (!employee) {
//         res.status(404).json({ message: 'Employee not found' });
//         return;
//       }

//       res.json(employee);
//     } else {
//       const employees = await employeeRepository.find();
//       res.json(employees);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching employees', error });
//   }
// });

// app.post('/employees', async (req, res): Promise<void> => {
//   const employeeRepository = AppDataSource.getRepository(Employee);
//   const { firstName, lastName, seniority, isMechanic, certifiedVehicleTypes } = req.body;

//   try {
//     const newEmployee = employeeRepository.create({
//       firstName,
//       lastName,
//       seniority,
//       isMechanic,
//       certifiedVehicleTypes
//     });
//     await employeeRepository.save(newEmployee);
//     res.status(201).json(newEmployee);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating employee', error });
//   }
// });

// app.put('/employees/:employeeId', async (req, res): Promise<void> => {
//   const employeeRepository = AppDataSource.getRepository(Employee);
//   const { employeeId } = req.params;
//   const { firstName, lastName, seniority, isMechanic, certifiedVehicleTypes } = req.body;

//   try {
//     const id = parseInt(employeeId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid employee ID' });
//       return;
//     }

//     const employee = await employeeRepository.findOneBy({ employeeId: id });
//     if (!employee) {
//       res.status(404).json({ message: 'Employee not found' });
//       return;
//     }

//     employee.firstName = firstName;
//     employee.lastName = lastName;
//     employee.seniority = seniority;
//     employee.isMechanic = isMechanic;
//     employee.certifiedVehicleTypes = certifiedVehicleTypes;

//     await employeeRepository.save(employee);
//     res.json(employee);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating employee', error });
//   }
// });

// app.delete('/employees/:employeeId', async (req, res): Promise<void> => {
//   const employeeRepository = AppDataSource.getRepository(Employee);
//   const { employeeId } = req.params;

//   try {
//     const id = parseInt(employeeId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid employee ID' });
//       return;
//     }

//     const employee = await employeeRepository.findOneBy({ employeeId: id });
//     if (!employee) {
//       res.status(404).json({ message: 'Employee not found' });
//       return;
//     }

//     await employeeRepository.remove(employee);
//     res.json({ message: 'Employee deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting employee', error });
//   }
// });

// ////////////////////////////////////vehicle/////////////////////////////////////////////////////////////
// app.get('/vehicles/:vehicleId?', async (req, res): Promise<void> => {
//   const vehicleRepository = AppDataSource.getRepository(Vehicle);
//   const { vehicleId } = req.params;

//   try {
//     if (vehicleId) {
//       const id = parseInt(vehicleId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid vehicle ID' });
//         return;
//       }

//       const vehicle = await vehicleRepository.findOneBy({ vehicleId: id });
//       if (!vehicle) {
//         res.status(404).json({ message: 'Vehicle not found' });
//         return;
//       }

//       res.json(vehicle);
//     } else {
//       const vehicles = await vehicleRepository.find();
//       res.json(vehicles);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching vehicles', error });
//   }
// });

// app.post('/vehicles', async (req, res): Promise<void> => {
//   const vehicleRepository = AppDataSource.getRepository(Vehicle);
//   const { vehicleType, brand, loadCapacity, year, numRepairs } = req.body;

//   try {
//     const newVehicle = vehicleRepository.create({
//       vehicleType,
//       brand,
//       loadCapacity,
//       year,
//       numRepairs
//     });
//     await vehicleRepository.save(newVehicle);
//     res.status(201).json(newVehicle);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating vehicle', error });
//   }
// });

// app.put('/vehicles/:vehicleId', async (req, res): Promise<void> => {
//   const vehicleRepository = AppDataSource.getRepository(Vehicle);
//   const { vehicleId } = req.params;
//   const { vehicleType, brand, loadCapacity, year, numRepairs } = req.body;

//   try {
//     const id = parseInt(vehicleId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid vehicle ID' });
//       return;
//     }

//     const vehicle = await vehicleRepository.findOneBy({ vehicleId: id });
//     if (!vehicle) {
//       res.status(404).json({ message: 'Vehicle not found' });
//       return;
//     }

//     vehicle.vehicleType = vehicleType;
//     vehicle.brand = brand;
//     vehicle.loadCapacity = loadCapacity;
//     vehicle.year = year;
//     vehicle.numRepairs = numRepairs;

//     await vehicleRepository.save(vehicle);
//     res.json(vehicle);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating vehicle', error });
//   }
// });

// app.delete('/vehicles/:vehicleId', async (req, res): Promise<void> => {
//   const vehicleRepository = AppDataSource.getRepository(Vehicle);
//   const { vehicleId } = req.params;

//   try {
//     const id = parseInt(vehicleId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid vehicle ID' });
//       return;
//     }

//     const vehicle = await vehicleRepository.findOneBy({ vehicleId: id });
//     if (!vehicle) {
//       res.status(404).json({ message: 'Vehicle not found' });
//       return;
//     }

//     await vehicleRepository.remove(vehicle);
//     res.json({ message: 'Vehicle deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting vehicle', error });
//   }
// });


// // //////////////////////////////////////////////////////MechanicRepairRecord//////////////////////////////////////
// app.get('/repairRecords/:repairId?', async (req, res): Promise<void> => {
//   const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
//   const { repairId } = req.params;

//   try {
//     if (repairId) {
//       const id = parseInt(repairId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid repair ID' });
//         return;
//       }

//       const repairRecord = await repairRepository.findOne({
//         where: { repairId: id },
//         relations: ['mechanicId', 'vehicleId'] // Load related employee and vehicle data
//       });
//       if (!repairRecord) {
//         res.status(404).json({ message: 'Repair record not found' });
//         return;
//       }

//       res.json(repairRecord);
//     } else {
//       const repairRecords = await repairRepository.find({ relations: ['mechanicId', 'vehicleId'] });
//       res.json(repairRecords);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching repair records', error });
//   }
// });

// app.post('/repairRecords', async (req, res): Promise<void> => {
//   const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
//   const { mechanicId, vehicleId, estimatedRepairTimeDays, actualRepairTimeDays } = req.body;

//   try {
//     const mechanic = await AppDataSource.getRepository(Employee).findOneBy({ employeeId: mechanicId });
//     const vehicle = await AppDataSource.getRepository(Vehicle).findOneBy({ vehicleId });

//     if (!mechanic || !vehicle) {
//       res.status(400).json({ message: 'Invalid mechanic or vehicle ID' });
//       return;
//     }

//     const newRepairRecord = repairRepository.create({
//       mechanicId: mechanic,
//       vehicleId: vehicle,
//       estimatedRepairTimeDays,
//       actualRepairTimeDays
//     });
//     await repairRepository.save(newRepairRecord);
//     res.status(201).json(newRepairRecord);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating repair record', error });
//   }
// });

// app.put('/repairRecords/:repairId', async (req, res): Promise<void> => {
//   const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
//   const { repairId } = req.params;
//   const { mechanicId, vehicleId, estimatedRepairTimeDays, actualRepairTimeDays } = req.body;

//   try {
//     const id = parseInt(repairId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid repair ID' });
//       return;
//     }

//     const repairRecord = await repairRepository.findOne({
//       where: { repairId: id },
//       relations: ['mechanicId', 'vehicleId']
//     });
//     if (!repairRecord) {
//       res.status(404).json({ message: 'Repair record not found' });
//       return;
//     }

//     const mechanic = await AppDataSource.getRepository(Employee).findOneBy({ employeeId: mechanicId });
//     const vehicle = await AppDataSource.getRepository(Vehicle).findOneBy({ vehicleId });

//     if (!mechanic || !vehicle) {
//       res.status(400).json({ message: 'Invalid mechanic or vehicle ID' });
//       return;
//     }

//     repairRecord.mechanicId = mechanic;
//     repairRecord.vehicleId = vehicle;
//     repairRecord.estimatedRepairTimeDays = estimatedRepairTimeDays;
//     repairRecord.actualRepairTimeDays = actualRepairTimeDays;

//     await repairRepository.save(repairRecord);
//     res.json(repairRecord);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating repair record', error });
//   }
// });

// app.delete('/repairRecords/:repairId', async (req, res): Promise<void> => {
//   const repairRepository = AppDataSource.getRepository(MechanicRepairRecord);
//   const { repairId } = req.params;

//   try {
//     const id = parseInt(repairId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid repair ID' });
//       return;
//     }

//     const repairRecord = await repairRepository.findOne({
//       where: { repairId: id },
//       relations: ['mechanicId', 'vehicleId']
//     });
//     if (!repairRecord) {
//       res.status(404).json({ message: 'Repair record not found' });
//       return;
//     }

//     await repairRepository.remove(repairRecord);
//     res.json({ message: 'Repair record deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting repair record', error });
//   }
// });

// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });

// // //////////////////////////////////route//////////////////////////////////////////////////////////
// app.get('/routes/:routeId?', async (req, res): Promise<void> => {
//   const routeRepository = AppDataSource.getRepository(Route);
//   const { routeId } = req.params;

//   try {
//     if (routeId) {
//       const id = parseInt(routeId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid route ID' });
//         return;
//       }

//       const route = await routeRepository.findOneBy({ routeId: id });
//       if (!route) {
//         res.status(404).json({ message: 'Route not found' });
//         return;
//       }

//       res.json(route);
//     } else {
//       const routes = await routeRepository.find();
//       res.json(routes);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching routes', error });
//   }
// });

// app.post('/routes', async (req, res): Promise<void> => {
//   const routeRepository = AppDataSource.getRepository(Route);
//   const { origin, destination } = req.body;

//   try {
//     const newRoute = routeRepository.create({ origin, destination });
//     await routeRepository.save(newRoute);
//     res.status(201).json(newRoute);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating route', error });
//   }
// });

// app.put('/routes/:routeId', async (req, res): Promise<void> => {
//   const routeRepository = AppDataSource.getRepository(Route);
//   const { routeId } = req.params;
//   const { origin, destination } = req.body;

//   try {
//     const id = parseInt(routeId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid route ID' });
//       return;
//     }

//     const route = await routeRepository.findOneBy({ routeId: id });
//     if (!route) {
//       res.status(404).json({ message: 'Route not found' });
//       return;
//     }

//     route.origin = origin;
//     route.destination = destination;

//     await routeRepository.save(route);
//     res.json(route);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating route', error });
//   }
// });

// app.delete('/routes/:routeId', async (req, res): Promise<void> => {
//   const routeRepository = AppDataSource.getRepository(Route);
//   const { routeId } = req.params;

//   try {
//     const id = parseInt(routeId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid route ID' });
//       return;
//     }

//     const route = await routeRepository.findOneBy({ routeId: id });
//     if (!route) {
//       res.status(404).json({ message: 'Route not found' });
//       return;
//     }

//     await routeRepository.remove(route);
//     res.json({ message: 'Route deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting route', error });
//   }
// });

// /////////////////////////////////////////////Shipment//////////////////////////////////////////
// app.get('/shipments/:shipmentId?', async (req, res): Promise<void> => {
//   const shipmentRepository = AppDataSource.getRepository(Shipment);
//   const { shipmentId } = req.params;

//   try {
//     if (shipmentId) {
//       const id = parseInt(shipmentId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid shipment ID' });
//         return;
//       }

//       const shipment = await shipmentRepository.findOneBy({ shipmentId: id });
//       if (!shipment) {
//         res.status(404).json({ message: 'Shipment not found' });
//         return;
//       }

//       res.json(shipment);
//     } else {
//       const shipments = await shipmentRepository.find();
//       res.json(shipments);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching shipments', error });
//   }
// });

// app.post('/shipments', async (req, res): Promise<void> => {
//   const shipmentRepository = AppDataSource.getRepository(Shipment);
//   const { customerId, origin, destination, shipmentDate, weight, status } = req.body;

//   try {
//     const newShipment = shipmentRepository.create({
//       customerId,
//       origin,
//       destination,
//       shipmentDate,
//       weight,
//       status
//     });
//     await shipmentRepository.save(newShipment);
//     res.status(201).json(newShipment);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating shipment', error });
//   }
// });

// app.put('/shipments/:shipmentId', async (req, res): Promise<void> => {
//   const shipmentRepository = AppDataSource.getRepository(Shipment);
//   const { shipmentId } = req.params;
//   const { customerId, origin, destination, shipmentDate, weight, status } = req.body;

//   try {
//     const id = parseInt(shipmentId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid shipment ID' });
//       return;
//     }

//     const shipment = await shipmentRepository.findOneBy({ shipmentId: id });
//     if (!shipment) {
//       res.status(404).json({ message: 'Shipment not found' });
//       return;
//     }

//     shipment.customerId = customerId;
//     shipment.origin = origin;
//     shipment.destination = destination;
//     shipment.shipmentDate = shipmentDate;
//     shipment.weight = weight;
//     shipment.status = status;

//     await shipmentRepository.save(shipment);
//     res.json(shipment);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating shipment', error });
//   }
// });

// app.delete('/shipments/:shipmentId', async (req, res): Promise<void> => {
//   const shipmentRepository = AppDataSource.getRepository(Shipment);
//   const { shipmentId } = req.params;

//   try {
//     const id = parseInt(shipmentId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid shipment ID' });
//       return;
//     }

//     const shipment = await shipmentRepository.findOneBy({ shipmentId: id });
//     if (!shipment) {
//       res.status(404).json({ message: 'Shipment not found' });
//       return;
//     }

//     await shipmentRepository.remove(shipment);
//     res.json({ message: 'Shipment deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting shipment', error });
//   }
// });

// ///////////////////////////////////////////////Trip/////////////////////////////////////
// app.get('/trips/:tripId?', async (req, res): Promise<void> => {
//   const tripRepository = AppDataSource.getRepository(Trip);
//   const { tripId } = req.params;

//   try {
//     if (tripId) {
//       const id = parseInt(tripId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid trip ID' });
//         return;
//       }

//       const trip = await tripRepository.findOneBy({ tripId: id });
//       if (!trip) {
//         res.status(404).json({ message: 'Trip not found' });
//         return;
//       }

//       res.json(trip);
//     } else {
//       const trips = await tripRepository.find();
//       res.json(trips);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching trips', error });
//   }
// });

// app.post('/trips', async (req, res): Promise<void> => {
//   const tripRepository = AppDataSource.getRepository(Trip);
//   const { routeId, vehicleId, driver1Id, driver2Id } = req.body;

//   try {
//     const newTrip = tripRepository.create({
//       routeId,
//       vehicleId,
//       driver1Id,
//       driver2Id
//     });
//     await tripRepository.save(newTrip);
//     res.status(201).json(newTrip);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating trip', error });
//   }
// });

// app.put('/trips/:tripId', async (req, res): Promise<void> => {
//   const tripRepository = AppDataSource.getRepository(Trip);
//   const { tripId } = req.params;
//   const { routeId, vehicleId, driver1Id, driver2Id } = req.body;

//   try {
//     const id = parseInt(tripId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid trip ID' });
//       return;
//     }

//     const trip = await tripRepository.findOneBy({ tripId: id });
//     if (!trip) {
//       res.status(404).json({ message: 'Trip not found' });
//       return;
//     }

//     trip.routeId = routeId;
//     trip.vehicleId = vehicleId;
//     trip.driver1Id = driver1Id;
//     trip.driver2Id = driver2Id;

//     await tripRepository.save(trip);
//     res.json(trip);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating trip', error });
//   }
// });

// app.delete('/trips/:tripId', async (req, res): Promise<void> => {
//   const tripRepository = AppDataSource.getRepository(Trip);
//   const { tripId } = req.params;

//   try {
//     const id = parseInt(tripId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid trip ID' });
//       return;
//     }

//     const trip = await tripRepository.findOneBy({ tripId: id });
//     if (!trip) {
//       res.status(404).json({ message: 'Trip not found' });
//       return;
//     }

//     await tripRepository.remove(trip);
//     res.json({ message: 'Trip deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting trip', error });
//   }
// });

// //////////////////////////////Trip Shipment//////////////////////////////////////////////////////
// app.get('/tripshipments/:tripShipmentId?', async (req, res): Promise<void> => {
//   const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
//   const { tripShipmentId } = req.params;

//   try {
//     if (tripShipmentId) {
//       const id = parseInt(tripShipmentId, 10); // Convert string to number
//       if (isNaN(id)) {
//         res.status(400).json({ message: 'Invalid trip shipment ID' });
//         return;
//       }

//       const tripShipment = await tripShipmentRepository.findOneBy({ tripShipmentId: id });
//       if (!tripShipment) {
//         res.status(404).json({ message: 'Trip shipment not found' });
//         return;
//       }

//       res.json(tripShipment);
//     } else {
//       const tripShipments = await tripShipmentRepository.find();
//       res.json(tripShipments);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching trip shipments', error });
//   }
// });

// app.post('/tripshipments', async (req, res): Promise<void> => {
//   const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
//   const { tripId, shipmentId } = req.body;

//   try {
//     const newTripShipment = tripShipmentRepository.create({ tripId, shipmentId });
//     await tripShipmentRepository.save(newTripShipment);
//     res.status(201).json(newTripShipment);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating trip shipment', error });
//   }
// });

// app.put('/tripshipments/:tripShipmentId', async (req, res): Promise<void> => {
//   const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
//   const { tripShipmentId } = req.params;
//   const { tripId, shipmentId } = req.body;

//   try {
//     const id = parseInt(tripShipmentId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid trip shipment ID' });
//       return;
//     }

//     const tripShipment = await tripShipmentRepository.findOneBy({ tripShipmentId: id });
//     if (!tripShipment) {
//       res.status(404).json({ message: 'Trip shipment not found' });
//       return;
//     }

//     tripShipment.tripId = tripId;
//     tripShipment.shipmentId = shipmentId;

//     await tripShipmentRepository.save(tripShipment);
//     res.json(tripShipment);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating trip shipment', error });
//   }
// });

// app.delete('/tripshipments/:tripShipmentId', async (req, res): Promise<void> => {
//   const tripShipmentRepository = AppDataSource.getRepository(TripShipment);
//   const { tripShipmentId } = req.params;

//   try {
//     const id = parseInt(tripShipmentId, 10); // Convert string to number
//     if (isNaN(id)) {
//       res.status(400).json({ message: 'Invalid trip shipment ID' });
//       return;
//     }

//     const tripShipment = await tripShipmentRepository.findOneBy({ tripShipmentId: id });
//     if (!tripShipment) {
//       res.status(404).json({ message: 'Trip shipment not found' });
//       return;
//     }

//     await tripShipmentRepository.remove(tripShipment);
//     res.json({ message: 'Trip shipment deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting trip shipment', error });
//   }
// });


import { Server } from 'http';

let server: Server;
AppDataSource.initialize()
  .then(() => {
    server = app.listen(0, () => { 
      const address = server.address(); 
      if (address && typeof address === 'object') {
        console.log(`Server is running on http://localhost:${address.port}`);
      } else {
        console.log('Server started, but unable to retrieve the port');
      }
    });
  })
  .catch((error) => console.log(error));

export {app, server} ;
