import { Request, Response } from "express";
import db from "../utils/db";

export const getDevices = async (req: Request, res: Response) => {
  const { id } = req.query;
  console.log(id);
  try {
    const devices = await db.device.findMany({
      where: {
        userId: id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!devices)
      return res.status(401).json({ message: "No device logged in" });
    return res.status(200).json({ Devices: devices });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.query;
  try {
    const remove = await db.device.delete({
      where: {
        id: deviceId as string,
      },
    });
    return res.status(200).json({ message: "Device Removed Successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server Error" });
  }
};
