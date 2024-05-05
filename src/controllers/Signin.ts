import "dotenv/config";
import bcrypt from "bcrypt";
import db from "../utils/db";
import DeviceDetector from "device-detector-js";
import { Request, Response } from "express";
import WebSocket from "ws";

export const Signin = async (req: Request, res: Response) => {
  const { credentials } = req.body;
  const deviceDetector = new DeviceDetector();
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36";
  const Device = deviceDetector.parse(userAgent);
  const wss: WebSocket.Server = req.app.get("wss");

  const hashedpassword = await bcrypt.hash(credentials.password, 10);
  try {
    let user = await db.user.findFirst({
      where: {
        name: credentials.name,
      },
    });
    if (user) {
      const check = await bcrypt.compare(credentials.password, user.password);
      if (!check) return res.status(401).json({ error: "Invalid credentials" });
    } else {
      user = await db.user.create({
        data: {
          name: credentials.name,
          password: hashedpassword,
          email: credentials.email,
        },
      });
    }
    const device = await db.device.create({
      data: {
        name: `${Device.client?.name} on ${Device.os?.name}`,
        type: Device.device?.type || "Unknown",
        userId: user.id,
      },
    });
    const session = await db.session.create({
      data: {
        userId: user.id,
        deviceId: device.id,
      },
    });
    const { password, ...userWithoutPassword } = user;
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "device_added", device }));
      }
    });
    return res.status(200).json({userWithoutPassword,session});
  } catch (error) {
    console.log(error);
  }
  return res.status(500).json({ error: "Something went wrong" });
};
