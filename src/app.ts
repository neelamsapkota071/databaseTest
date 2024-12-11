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
const app = express();
export default app;
const port = 3000;

app.use(express.json());
app.use('/', customerAPI);
app.use('/', employeeAPI);
app.use('/', mechanicRepairRecordAPI);
app.use('/', routeAPI);
app.use('/', shipmentAPI);
app.use('/', tripAPI);
app.use('/', tripShipmentAPI);
app.use('/', vehicleAPI);

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
