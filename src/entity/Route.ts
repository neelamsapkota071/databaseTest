// src/entity/Route.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  routeId: number;

  @Column()
  origin: string;

  @Column()
  destination: string;
}
