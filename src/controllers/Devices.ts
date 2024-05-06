import { Request, Response } from "express";
import db from "../utils/db";
import WebSocket from "ws";

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
  const wss: WebSocket.Server = req.app.get("wss");
  try {
    await db.$transaction(async (db) => {
      const session = await db.session.findFirst({
        where: { deviceId: deviceId as string },
      });
      if (!session) {
        throw new Error("Session not found");
      }
      await db.session.delete({
        where: { id: session.id },
      });
      await db.device.delete({
        where: { id: deviceId as string },
      });
    });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "device_removed", deviceId }));
      }
    });
    return res.status(200).json({ message: "Device Removed Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error || "Internal Server Error" });
  }
};

export const checkDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.query;
  try {
    const check = await db.session.findFirst({
      where: {
        deviceId: deviceId as string,
      },
    });
    if (!check) return res.status(401).json({ message: "Session not found" });
    return res.status(200).json({ message: "Session found" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
