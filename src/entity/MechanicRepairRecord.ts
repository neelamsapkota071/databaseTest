// src/entity/MechanicRepairRecord.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from './Employee';
import { Vehicle } from './Vehicle';

@Entity()
export class MechanicRepairRecord {
  @PrimaryGeneratedColumn()
  repairId: number;

  @ManyToOne(() => Employee, (employee) => employee.employeeId)
  mechanicId: Employee;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.vehicleId)
  vehicleId: Vehicle;

  @Column()
  estimatedRepairTimeDays: number;

  @Column()
  actualRepairTimeDays: number;
}
