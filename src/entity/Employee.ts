// src/entity/Employee.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employeeId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  seniority: number;

  @Column('boolean')
  isMechanic: boolean;

  @Column('simple-array') // stores as comma-separated string in DB
  certifiedVehicleTypes: string[];
}
