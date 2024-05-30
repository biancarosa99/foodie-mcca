import express = require("express");
const router = express.Router();
import {
  assignOrderToDriver,
  createOrder,
  driverUpdateOrderStatus,
  getDriverAssignedOrders,
  getDriverOrders,
  getOrder,
  getRestaurantOrders,
  getUserOrders,
  restaurantUpdateOrderStatus,
} from "../services/OrderService";

router.get("/order/user/:customerId", getUserOrders); // get all the orders a user has placed
router.get("/order/driver", getDriverOrders); // get the orders a driver can take
router.get("/order/restaurant/:restaurantId", getRestaurantOrders); // get the orders from a restaurant
router.get("/order/:orderId", getOrder); // get specific order
router.patch("/order/assign-driver/:id", assignOrderToDriver); // assign driver to order
router.patch(
  "/order/restaurant-update-status/:id",
  restaurantUpdateOrderStatus
); // restaurant update status
router.patch("/order/driver-update-status/:id", driverUpdateOrderStatus); // driver update status
router.get("/order/driver/all/:driverId", getDriverAssignedOrders); // get driver orders where he is assigned

router.post("/order", createOrder); // make an order

module.exports = router;
