import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import CartItem from "./CartItem";
import Restaurant from "./Restaurant";
import Ingredient from "./Ingredient";

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: "float" })
  price: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  hasAllergens: boolean;

  @Column({ nullable: true, type: "float" })
  calories: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    onDelete: "CASCADE",
  })
  cartItems: CartItem[];

  @ManyToMany(() => Ingredient, { eager: true })
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant, { eager: true })
  restaurant: Restaurant;
}
