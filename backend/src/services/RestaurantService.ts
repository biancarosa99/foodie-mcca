import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import Restaurant from "../entities/Restaurant";
import { AuthenticatedRequest } from "../middleware/verifyToken";

export const getRestaurants = async (req: Request, res: Response) => {
  const { latitude, longitude } = req.query;

  try {
    const restaurants = await myDataSource
      .getRepository(Restaurant)
      .createQueryBuilder("restaurant")
      .where(
        "distance(restaurant.latitude, restaurant.longitude, :latitude, :longitude) < 5000",
        {
          latitude,
          longitude,
        }
      )
      .getMany();

    return res.status(200).json({ restaurants });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getRestaurantByOwnerId = async (req: Request, res: Response) => {
  const { ownerId } = req.params;

  try {
    const restaurant = await myDataSource.getRepository(Restaurant).findOne({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    return res.status(200).json({ restaurant });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const createRestaurant = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { name, description, address, latitude, longitude } = req.body;

  if (tkUser.role !== "admin")
    return res
      .status(403)
      .json("User does not have permission for this action");

  try {
    const restaurant = myDataSource.getRepository(Restaurant).create({
      name,
      description,
      address,
      latitude,
      longitude,
      owner: {
        id: tkUser.id,
      },
    });

    const result = await restaurant.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getRestaurant = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await myDataSource.getRepository(Restaurant).findOne({
      where: {
        id: restaurantId,
      },
    });
    return res.json(restaurant);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  getRestaurants,
  createRestaurant,
  getRestaurant,
  getRestaurantByOwnerId,
};
