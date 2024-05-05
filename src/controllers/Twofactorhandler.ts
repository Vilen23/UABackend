import { Request, Response } from "express";
import db from "../utils/db";
import "dotenv/config";

const speakeasy = require("speakeasy");

function generate_secret_key() {
  const secretKey = speakeasy.generateSecret({ length: 20 });
  return secretKey;
}

export const Twofactorhandler = async (req: Request, res: Response) => {
  const secretkey = generate_secret_key();
  const { id } = req.body;
  try {
    const checkToken = await db.twofactor.findFirst({
      where: {
        userId: id,
      },
    });
    if (checkToken) {
      const updateToken = await db.twofactor.update({
        where: {
          id: checkToken.id,
        },
        data: {
          code: secretkey.base32,
          user: {
            connect: {
              id,
            },
          },
        },
      });
      return res.status(200).json({ secretkey });
    }
    const add2Fa = await db.twofactor.create({
      data: {
        code: secretkey.base32,
        user: {
          connect: {
            id,
          },
        },
      },
    });
    const updateUser = await db.user.update({
      where: {
        id,
      },
      data: {
        Twofactor: true,
      },
    });
    return res.status(200).json({ secretkey });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const check2Fa = async (req: Request, res: Response) => {
 const {id} = req.query;
 try {
  const existingUser = await db.user.findFirst({
    where:{
      id:id as string
    }
  })
  if(existingUser?.Twofactor){
    return res.status(200).json({message:"2fa enabled"});
  }
  return res.status(301).json({message:"2fa not enabled"});
 } catch (error) {
  return res.status(500).json({error:"Internal server error"});
 }
};

export const getToken = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const token = await db.twofactor.findFirst({
      where: {
        userId: id as string,
      },
    });
    if (!token) return res.status(301).json({ error: "Token not found" });
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


