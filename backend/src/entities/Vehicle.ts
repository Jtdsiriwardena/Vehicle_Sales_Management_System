import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  engineSize?: string;

  @Column({ nullable: true })
  year?: number;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  price!: number;

  @Column("text", { nullable: true })
  description?: string; // AI generated + editable

  @Column("simple-array", { nullable: true })
  images?: string[]; // store URLs or file paths

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
