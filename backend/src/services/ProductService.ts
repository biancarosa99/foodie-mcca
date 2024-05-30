import { Response, Request } from "express";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import Product from "../entities/Product";
import Restaurant from "../entities/Restaurant";
import Ingredient from "../entities/Ingredient";

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { name, price, image, calories, hasAllergens, ingredients } = req.body;
  const { restaurantId } = req.params;

  const restaurant = await myDataSource.getRepository(Restaurant).findOne({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    return res.status(404).json("Restaurant not found");
  }

  if (tkUser.role !== "admin" || restaurant.owner.id !== tkUser.id) {
    return res
      .status(403)
      .json("User does not have permission for this action");
  }

  try {
    const product = new Product();
    product.name = name;
    product.price = price;
    product.image = image;
    product.calories = calories;
    product.hasAllergens = hasAllergens;
    product.restaurant = restaurant;

    // Find or create ingredients and associate them with the product
    const ingredientEntities: Ingredient[] = [];
    for (const ingredientName of ingredients) {
      let ingredient = await myDataSource
        .getRepository(Ingredient)
        .findOne({ where: { name: ingredientName } });
      if (!ingredient) {
        // If ingredient doesn't exist, create it
        ingredient = new Ingredient();
        ingredient.name = ingredientName;
        await ingredient.save();
      }
      ingredientEntities.push(ingredient);
    }

    product.ingredients = ingredientEntities;

    const result = await product.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getRestaurantProducts = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { minPrice, maxPrice, ingredients, hasAllergens } = req.query;

  const minPriceNumber = minPrice ? +minPrice : 0;
  const maxPriceNumber = maxPrice ? +maxPrice : Number.MAX_SAFE_INTEGER;
  const alergens = hasAllergens == "false";

  try {
    const productsQueryBuilder = myDataSource
      .getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.ingredients", "ingredient")
      .where("product.restaurantId = :restaurantId", { restaurantId })
      .andWhere("product.price BETWEEN :minPrice AND :maxPrice", {
        minPrice: minPriceNumber,
        maxPrice: maxPriceNumber,
      });

    if (hasAllergens) {
      productsQueryBuilder.andWhere("product.hasAllergens = :alergens", {
        alergens,
      });
    }

    if (ingredients) {
      const ingredientsArray = Array.isArray(ingredients)
        ? ingredients
        : [ingredients];

      productsQueryBuilder.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select("product.id")
            .from(Product, "product")
            .leftJoin("product.ingredients", "ingredient")
            .where("ingredient.name IN (:...ingredientsArray)", {
              ingredientsArray,
            })
            .groupBy("product.id")
            .having("COUNT(DISTINCT ingredient.name) = :ingredientCount")
            .getQuery();

          return "product.id IN " + subQuery;
        },
        { ingredientCount: ingredientsArray.length }
      );
    }

    // Execute the query
    const products = await productsQueryBuilder.getMany();

    const total = products.length;

    return res.status(200).json({ products, total });
  } catch (error) {
    console.log("Error:", error);
    return res.status(400).json("Something went wrong!");
  }
};

module.exports = {
  createProduct,
  getRestaurantProducts,
};
