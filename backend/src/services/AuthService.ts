import { isEmail, isEmpty } from "class-validator";
import { Request, Response } from "express";
import { Role } from "../../utils/role.enum";
import { myDataSource } from "../app-data-source";
import User from "../entities/User";
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import Cart from "../entities/Cart";

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phoneNumber,
    role,
  } = req.body;

  let errors: any = {};
  let isEmailAvailable: User;

  if (isEmpty(email)) errors.email = "Email can not be empty!";
  if (isEmpty(password)) errors.password = "Password can not be empty!";
  if (isEmpty(confirmPassword))
    errors.confirmPassword = "Confirm paswword can not be empty!";
  if (isEmpty(firstName)) errors.firstName = "Firstname can not be empty!";
  if (isEmpty(lastName)) errors.lastName = "Lastname can not be empty!";
  if (isEmpty(phoneNumber))
    errors.phoneNumber = "Phone number can not be empty!";
  if (!isEmail(email)) errors.email = "A valid email is required";
  if (!Object.values<string>(Role).includes(role))
    errors.role = "A valid role is required";

  isEmailAvailable = await myDataSource.getRepository(User).findOne({
    where: {
      email,
    },
  });

  if (isEmailAvailable) errors.email = "Email already taken";

  if (password !== confirmPassword)
    errors.confirmPassword = "Password and ConfirmPassword must match!";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const user = myDataSource.getRepository(User).create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
    });
    
    const result = await user.save();

    const cart = myDataSource.getRepository(Cart).create({
      user: {
        id: user.id,
      },
    });

    await cart.save();

    const createdCart = await myDataSource.getRepository(Cart).findOne({
      where: { id: cart.id },
    });

    user.cart = createdCart;
    await user.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let errors: any = {};

  if (isEmpty(email)) errors.email = "Email must not be empty";
  if (isEmpty(password)) errors.password = "Password must not be empty";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const user = await myDataSource.getRepository(User).findOneBy({ email });
    if (!user) return res.status(400).json("Invalid email");

    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) return res.status(401).json("Invalid password");

    const id = user.id;
    const role = user.role;
    const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET);
    const cart = await myDataSource.getRepository(Cart).findOne({
      where: {
        user: { id: user.id },
      },
    });

    user.cart = cart;
    return res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { login, register };
