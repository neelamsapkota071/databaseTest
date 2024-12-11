import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import customerAPI from './api/CustomerAPI';
import employeeAPI from './api/EmployeeAPI';
import mechanicRepairRecordAPI from './api/MeachanicRepairRecordsAPI';
import routeAPI from './api/RouteAPI';
import shipmentAPI from './api/ShipmentAPI';
import tripAPI from './api/TripAPI';
import tripShipmentAPI from './api/TripShipmentAPI';
import vehicleAPI from './api/VehicleAPI';
import { Server } from 'http';

import express from 'express';
const test_app = express();
export default test_app;
const port = 3000;

test_app.use(express.json());
test_app.use('/', customerAPI);
test_app.use('/', employeeAPI);
test_app.use('/', mechanicRepairRecordAPI);
test_app.use('/', routeAPI);
test_app.use('/', shipmentAPI);
test_app.use('/', tripAPI);
test_app.use('/', tripShipmentAPI);
test_app.use('/', vehicleAPI);

// AppDataSource.initialize()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   })
//   .catch((error) => console.log(error));
