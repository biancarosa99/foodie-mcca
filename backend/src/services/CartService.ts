import { Response } from "express";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import Cart from "../entities/Cart";

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const { tkUser } = req;
  try {
    const cart = await myDataSource.getRepository(Cart).find({
      where: {
        user: {
          id: tkUser.id,
        },
      },
      order: {
        cartItems: {
          product: {
            name: "ASC",
          },
        },
      },
    });

    return res.status(200).json({ cart });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

module.exports = {
  getCart,
};
