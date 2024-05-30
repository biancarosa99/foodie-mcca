import { Response, Request } from "express";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import Product from "../entities/Product";
import Restaurant from "../entities/Restaurant";
import Ingredient from "../entities/Ingredient";

export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await myDataSource.getRepository(Ingredient).find();

    return res.status(200).json({ ingredients });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

module.exports = {
  getAllIngredients,
};
