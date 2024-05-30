const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import { Role } from "../../utils/role.enum";

export type AuthenticatedRequest = Request & {
  tkUser: {
    id: string;
    email: string;
    role: Role;
    iat: number;
  };
};

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      req.tkUser = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

export default { verifyToken };
