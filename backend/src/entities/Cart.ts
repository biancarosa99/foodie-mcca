import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import User from "./User";
import CartItem from "./CartItem";

@Entity()
export default class Cart extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    onDelete: "CASCADE",
  })
  cartItems: CartItem[];
}
