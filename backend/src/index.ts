import { myDataSource } from "./app-data-source";
import * as dotenv from "dotenv";

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
dotenv.config();

import authRoutes = require("./controllers/AuthController");
import cartRoutes = require("./controllers/CartController");
import cartItemRoutes = require("./controllers/CartItemController");
import orderRoutes = require("./controllers/OrderController");
import productRoutes = require("./controllers/ProductController");
import restaurantRoutes = require("./controllers/RestaurantController");
import userRoutes = require("./controllers/UserController");
import ingredientRoutes = require("./controllers/IngredientController");

myDataSource
  .initialize()
  .then(() => {
    app.use(express.json());
    app.use(cors({ origin: "*", optionSuccessStatus: 200 }));

    app.use(authRoutes);
    app.use(cartRoutes);
    app.use(cartItemRoutes);
    app.use(orderRoutes);
    app.use(productRoutes);
    app.use(restaurantRoutes);
    app.use(userRoutes);
    app.use(ingredientRoutes);

    app.listen(port, function () {
      console.log(`Backend server running on port ${port}`);
    });
  })
  .catch((e: any) => {
    console.log(e);
  });
