import express = require("express");
const router = express.Router();
import { getCart } from "../services/CartService";
import { verifyToken } from "../middleware/verifyToken";

router.get("/cart/user", verifyToken, getCart); // get user cart

module.exports = router;
