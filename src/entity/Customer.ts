// src/entity/Customer.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone1: string;

  @Column({ nullable: true }) // Allows null values
  phone2: string;
}
