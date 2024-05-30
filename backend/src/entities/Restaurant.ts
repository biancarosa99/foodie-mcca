import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import User from "./User";
import Order from "./Order";
import Product from "./Product";

@Entity()
export default class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false, type: "float" })
  latitude: number;

  @Column({ nullable: false, type: "float" })
  longitude: number;

  @OneToMany(() => Order, (order) => order.restaurant, {
    onDelete: "CASCADE",
  })
  orders: Order[];

  @OneToMany(() => Product, (product) => product.restaurant, {
    onDelete: "CASCADE",
  })
  products: Product[];

  @ManyToOne(() => User, (user) => user, { eager: true })
  owner: User;
}
