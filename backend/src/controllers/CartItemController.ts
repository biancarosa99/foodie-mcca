import express = require("express");
const router = express.Router();
import {
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItems,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  deleteCartItems,
} from "../services/CartItemService";
import { verifyToken } from "../middleware/verifyToken";

router.post("/cart/item", createCartItem); // add a product to cart
router.patch("cart/2/item", verifyToken, updateCartItem); // update quantity of item
router.delete("/cart/item/:cartItemId", deleteCartItem); //delete cart item
router.get("/cart/items/:cartId", getCartItems);
router.put("/cart/item/increment/:cartItemId", incrementCartItemQuantity);
router.put("/cart/item/decrement/:cartItemId", decrementCartItemQuantity);
router.delete("/cart/items/:cartId", deleteCartItems);

module.exports = router;
