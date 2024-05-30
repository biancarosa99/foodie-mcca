import { Validate } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Status } from "../../utils/status.enum";
import { ValidateStatus } from "../../utils/validateStatus";
import CartItem from "./CartItem";
import Restaurant from "./Restaurant";
import User from "./User";

@Entity()
export default class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Validate(ValidateStatus)
  @Column()
  status: Status;

  @Column({ type: "timestamptz" })
  date: Date;

  @Column({ nullable: false })
  deliveryAddress: string;

  @Column()
  billingAddress: string;

  @ManyToOne(() => User, (user) => user, { eager: true })
  @JoinColumn()
  driver: User;

  @ManyToOne(() => User, (user) => user, { eager: true })
  customer: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant, { eager: true })
  restaurant: Restaurant;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    onDelete: "CASCADE",
  })
  cartItems: CartItem[];
}
