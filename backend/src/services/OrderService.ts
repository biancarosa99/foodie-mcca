import { Request, Response } from "express";
import { In, Not } from "typeorm";
import { Status } from "../../utils/status.enum";
import { myDataSource } from "../app-data-source";
import CartItem from "../entities/CartItem";
import Order from "../entities/Order";
import { AuthenticatedRequest } from "../middleware/verifyToken";

export const getUserOrders = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const [orders, total] = await myDataSource
      .getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.restaurant", "restaurant")
      .where("order.customer.id = :customerId", { customerId })
      .orderBy("order.date", "DESC")
      .getManyAndCount();

    return res.status(200).json({ orders, total });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getRestaurantOrders = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const orders = await myDataSource.getRepository(Order).find({
      where: {
        restaurant: {
          id: restaurantId,
        },
        status: Not(
          In([Status.Delivered, Status.OnTheWay, Status.ReadyForDelivery])
        ),
      },
      order: {
        date: "DESC",
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getRestaurantOrdersByStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { restaurnantId } = req.params;
  const { status } = req.body;

  if (tkUser.role !== "admin")
    return res
      .status(403)
      .json("User does not have permission for this action");
  try {
    const [orders, total] = await myDataSource
      .getRepository(Order)
      .findAndCount({
        where: {
          restaurant: {
            id: restaurnantId,
          },
          status: status,
        },
        order: {
          date: "DESC",
        },
      });

    return res.status(200).json({ orders, total });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getDriverOrders = async (req: Request, res: Response) => {
  const { latitude, longitude } = req.query;

  try {
    const orders = await myDataSource
      .getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.restaurant", "restaurant")
      .leftJoinAndSelect("order.cartItems", "cartItems")
      // .where(
      //   "distance(restaurant.latitude, restaurant.longitude, :latitude, :longitude) < 2000",
      //   {
      //     latitude,
      //     longitude,
      //   }
      // )
      .andWhere(`order.status = :status`, { status: Status.ReadyForDelivery })
      .getMany();

    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await myDataSource.getRepository(Order).findOneBy({
      id: orderId,
    });

    const cartItems = await myDataSource.getRepository(CartItem).find({
      where: {
        order: {
          id: orderId,
        },
      },
    });

    order.cartItems = cartItems;

    return res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { date, deliveryAddress, billingAddress, restaurantId, customerId } =
    req.body;

  try {
    const order = myDataSource.getRepository(Order).create({
      status: Status.Placed,
      date,
      deliveryAddress,
      billingAddress,
      restaurant: {
        id: restaurantId,
      },
      customer: {
        id: customerId,
      },
    });
    const result = await order.save();

    const cartItems = await myDataSource.getRepository(CartItem).find({
      where: {
        cart: {
          user: { id: customerId },
        },
      },
    });

    cartItems.forEach(async (cartItem) => {
      await myDataSource
        .getRepository(CartItem)
        .update(cartItem.id, { cart: { id: null }, order: { id: order.id } });
    });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const assignOrderToDriver = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { driverId } = req.body;

  try {
    const result = await myDataSource
      .getRepository(Order)
      .update(id, { status: Status.OnTheWay, driver: { id: driverId } });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const restaurantUpdateOrderStatus = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await myDataSource
      .getRepository(Order)
      .update(id, { status: status });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const driverUpdateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await myDataSource
      .getRepository(Order)
      .update(id, { status: status });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getDriverAssignedOrders = async (req: Request, res: Response) => {
  const { driverId } = req.params;
  try {
    const orders = await myDataSource.getRepository(Order).findAndCount({
      where: {
        driver: {
          id: driverId,
        },
      },
      order: {
        date: "DESC",
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

module.exports = {
  getUserOrders,
  getRestaurantOrders,
  getDriverOrders,
  getOrder,
  createOrder,
  assignOrderToDriver,
  getRestaurantOrdersByStatus,
  restaurantUpdateOrderStatus,
  driverUpdateOrderStatus,
  getDriverAssignedOrders,
};
