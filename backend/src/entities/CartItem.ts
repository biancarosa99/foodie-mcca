import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import Cart from "./Cart";
import Product from "./Product";
import { IsInt, Min, Max } from "class-validator";
import Order from "./Order";

@Entity()
export default class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart, { eager: true })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product, { eager: true })
  product: Product;

  @ManyToOne(() => Order, (order) => order, { eager: true })
  order: Order;
}
