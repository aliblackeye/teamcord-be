import { createServer } from "node:http";
import { Server } from "socket.io";
import { onJoinVoiceChannel } from "./socket-events/on-join-voice-channel";
import { onSubscribeChannel } from "./socket-events/on-subscribe-channel";

import { onGetVoiceChannel } from "./socket-events/on-get-voice-channel";
import { onLeaveVoiceChannel } from "./socket-events/on-leave-voice-channel";
import { Channel, VoiceChannel } from "./types";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

export const voiceChannels: VoiceChannel[] = [];
export let channels: Channel[] = [];
const httpServer = createServer();
export const io = new Server(httpServer);

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

  socket.on("get-voice-channel", onGetVoiceChannel);

  socket.on("join-voice-channel", onJoinVoiceChannel);

  socket.on("leave-voice-channel", onLeaveVoiceChannel);

  socket.on("disconnect", () => {
    const channelIds = channels
      .filter((c) => c.subscribers.some((s) => s.socketId === socket.id))
      .map((c) => c.channelId);

    // Kullanıcıyı kanallardan çıkar
    channels = channels
      .map((c) => ({
        ...c,
        subscribers: c.subscribers.filter((s) => s.socketId !== socket.id),
      }))
      .filter((c) => c.subscribers.length > 0);

    // Aynı kanal abonelerine kanalları gönder
    io.to(channelIds).emit("get-channel-subscribers", channels);
  });
});
