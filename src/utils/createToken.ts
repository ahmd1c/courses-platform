import { Response } from "express";
import { TUser } from "../types";
import jwt from "jsonwebtoken";

const createTokenAndCookie = (id: TUser["id"], res: Response) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });
  } catch (error) {
    console.log(error);
  }
};

export default createTokenAndCookie;
