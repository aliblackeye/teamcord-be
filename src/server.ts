import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { onJoinRoom } from "./socket-events/on-join-room";
import { onSubscribeChannel } from "./socket-events/on-subscribe-channel";

import { onGetRoom } from "./socket-events/on-get-room";
import { onLeaveRoom } from "./socket-events/on-leave-room";
import { Channel, Room } from "./types";
import dotenv from "dotenv";
import { onWebRTCSignal } from "./socket-events/on-webrtc-signal";
import { onDisconnect } from "./socket-events/on-disconnect";
import { onNewRoomMessage } from "./socket-events/on-new-room-message";
dotenv.config();

const hostname = "localhost";
const port = process.env.PORT || 5000;

export let rooms: Room[] = [];
export let channels: Channel[] = [];

const app = express();
app.use(cors());

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

httpServer
  .once("error", (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });

io.on("connection", (socket) => {
  console.log("client connected...", socket.id);

  socket.on("subscribe-channel", (data) =>
    onSubscribeChannel({ ...data, socket })
  );

  socket.on("get-room", onGetRoom);

  socket.on("join-room", onJoinRoom);

  socket.on("leave-room", onLeaveRoom);

  socket.on("new-room-message", onNewRoomMessage);

  socket.on("webrtc-signal", onWebRTCSignal);

  socket.on("disconnect", () => onDisconnect(socket));
});
