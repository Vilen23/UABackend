import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../utils/db";
import "dotenv/config";

export const Signin = async (req: Request, res: Response) => {
  const { credentials } = req.body;
  const hashedpassword = await bcrypt.hash(credentials.password, 10);

  try {
    const existingUser = await db.user.findFirst({
      where: {
        name: credentials.name,
      },
    });
    if (existingUser) {
      const check = await bcrypt.compare(
        credentials.password,
        existingUser.password
      );
      if (!check) return res.status(401).json({ error: "Invalid credentials" });
      const { password, ...userWithoutPassword } = existingUser;
      return res.status(200).json(userWithoutPassword);
    }
    const user = await db.user.create({
      data: {
        name: credentials.name,
        password: hashedpassword,
        email: credentials.email,
      },
    });
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
  }
  return res.status(500).json({ error: "Something went wrong" });
};
