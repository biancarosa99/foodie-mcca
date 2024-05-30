import { Request, Response } from "express";
import User from "../entities/User";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import Order from "../entities/Order";
import { Role } from "../../utils/role.enum";

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const { tkUser } = req;
  try {
    const user = await myDataSource.getRepository(User).findOne({
      where: {
        id: tkUser.id,
      },
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getAdminUsers = async (req: Request, res: Response) => {
  try {
    const adminUsers = await myDataSource.getRepository(User).find({
      where: {
        role: Role.Admin,
      },
    });
    return res.json(adminUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  getUser,
  getAdminUsers,
};
