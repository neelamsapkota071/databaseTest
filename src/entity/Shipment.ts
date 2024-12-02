// src/entity/Shipment.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './Customer';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  shipmentId: number;

  @ManyToOne(() => Customer, (customer) => customer.customerId)
  customerId: Customer;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column('date')
  shipmentDate: Date;

  @Column('float')
  weight: number;

  @Column()
  status: string; // e.g., "Pending", "In Transit", "Delivered"
}
