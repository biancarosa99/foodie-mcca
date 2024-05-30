import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import Order from "./Order";

@Entity()
export default class Payment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "float" })
  amount: number;

  @Column({ type: "timestamptz" })
  date: Date;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;
}
