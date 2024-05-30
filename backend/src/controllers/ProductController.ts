import express = require("express");
const router = express.Router();
import {
  createProduct,
  getRestaurantProducts,
} from "../services/ProductService";
import { verifyToken } from "../middleware/verifyToken";

router.post("/admin/product/:restaurantId", verifyToken, createProduct); // create a product
router.get("/product/:restaurantId", getRestaurantProducts); // get products of a restaurant

module.exports = router;
