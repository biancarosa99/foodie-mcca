import express = require("express");
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken";
import {
  createRestaurant,
  getRestaurant,
  getRestaurantByOwnerId,
  getRestaurants,
} from "../services/RestaurantService";

router.post("/admin/restaurant", verifyToken, createRestaurant); // create a restaurant
router.get("/restaurant", getRestaurants); // get all the restaurants
router.get("/restaurant/:restaurantId", getRestaurant);
router.get("/owner/restaurant/:ownerId", getRestaurantByOwnerId); // get all the restaurants

module.exports = router;
