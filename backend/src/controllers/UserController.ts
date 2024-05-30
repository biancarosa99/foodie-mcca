import express = require("express");
const router = express.Router();
import { getAdminUsers, getUser } from "../services/UserService";
import { verifyToken } from "../middleware/verifyToken";

router.get("/user/", verifyToken, getUser); // get user
router.get("/user/admin/", getAdminUsers);

module.exports = router;
