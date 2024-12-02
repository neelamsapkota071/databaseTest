// src/entity/TripShipment.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Trip } from './Trip';
import { Shipment } from './Shipment';

@Entity()
export class TripShipment {
  @PrimaryGeneratedColumn()
  tripShipmentId: number;

  @ManyToOne(() => Trip, (trip) => trip.tripId)
  tripId: Trip;

  @ManyToOne(() => Shipment, (shipment) => shipment.shipmentId)
  shipmentId: Shipment;
}
