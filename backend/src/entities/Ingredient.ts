import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import Product from "./Product";

@Entity()
export default class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Product, (product) => product.ingredients)
  products: Product[];
}
