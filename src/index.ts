import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";
import Authentication from "./routes/Authentication";
import DeviceHandler from "./routes/DeviceHandler";
var useragent = require("express-useragent");

const app = express();
const corsOptions = {
  origin: "https://user-activity-client.vercel.app/history",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(useragent.express());
app.use(express.json());
app.use(cors(corsOptions));

const httpServer = app.listen(8000);

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", function (ws) {
  ws.on("error", console.error);
  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
  ws.send(JSON.stringify({ type: "message", content: "WebSocket started" }));
});

app.set("wss", wss);
app.use("/api/auth", Authentication);
app.use("/api/devices", DeviceHandler);
