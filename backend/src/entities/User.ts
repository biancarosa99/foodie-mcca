import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Validate, IsEmail, Length } from "class-validator";
import bcrypt = require("bcrypt");
import { Role } from "../../utils/role.enum";
import { ValidateRole } from "../../utils/validateRole";
import Order from "./Order";
import Restaurant from "./Restaurant";
import Cart from "./Cart";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Length(1, 50, { message: "firstname can not be empty" })
  @Column()
  firstName: string;

  @Length(1, 50, { message: "lastname can not be empty" })
  @Column()
  lastName: string;

  @IsEmail(undefined, { message: "must be a valid email" })
  @Length(1, 254, { message: "email can not be empty" })
  @Column({ nullable: false, unique: true })
  email: string;

  @Length(6, 24, { message: "must be between 6 and 24 characters" })
  @Column({ nullable: false })
  password: string;

  @Length(1, 30, { message: "phone number can not be empty" })
  @Column()
  phoneNumber: string;

  @Validate(ValidateRole)
  @Column()
  role: Role;
  
  @OneToOne(() => Cart)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.customer, {
    onDelete: "CASCADE",
  })
  orders: Order[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner, {
    onDelete: "CASCADE",
  })
  restaurants: Restaurant[];

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }
}
