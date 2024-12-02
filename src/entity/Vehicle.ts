// src/entity/Vehicle.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  vehicleId: number;

  @Column()
  vehicleType: string;

  @Column()
  brand: string;

  @Column('float')
  loadCapacity: number;

  @Column()
  year: number;

  @Column()
  numRepairs: number;
}
