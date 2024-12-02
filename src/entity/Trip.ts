// src/entity/Trip.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Route } from './Route';
import { Vehicle } from './Vehicle';
import { Employee } from './Employee';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  tripId: number;

  @ManyToOne(() => Route, (route) => route.routeId)
  routeId: Route;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.vehicleId)
  vehicleId: Vehicle;

  @ManyToOne(() => Employee, (employee) => employee.employeeId)
  driver1Id: Employee;

  @ManyToOne(() => Employee, (employee) => employee.employeeId)
  driver2Id: Employee;
}
