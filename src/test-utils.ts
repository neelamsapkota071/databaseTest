import { DataSource } from 'typeorm';
import { Customer } from '../src/entity/Customer';
import { Employee } from '../src/entity/Employee';
import { MechanicRepairRecord } from '../src/entity/MechanicRepairRecord';
import { Route } from '../src/entity/Route';
import { Shipment } from '../src/entity/Shipment';
import { Trip } from '../src/entity/Trip';
import { TripShipment } from '../src/entity/TripShipment';
import { Vehicle } from '../src/entity/Vehicle';

export const setupTestDataSource = async (): Promise<DataSource> => {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'neelam',
    password: 'password',
    database: 'neelam-db',
    synchronize: true,
    dropSchema: true,
    entities: [Customer, Employee, MechanicRepairRecord,Route, Shipment, Trip,TripShipment,Vehicle],
    logging: false,
  });

  await AppDataSource.initialize();
  return AppDataSource;

  };
