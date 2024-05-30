import express = require("express");
const router = express.Router();

import { getAllIngredients } from "../services/IngredientService";

router.get("/ingredients/", getAllIngredients);

module.exports = router;
