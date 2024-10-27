import { io, channels } from "../server";
import { Socket } from "socket.io";

export const onSubscribeChannel = async ({
  channelId,
  socketId,
  socket,
}: {
  channelId: string;
  socketId: string;
  socket: Socket;
}) => {
  const existingChannel = channels.find((c) => c.channelId === channelId);

  if (existingChannel) {
    existingChannel.subscribers.push({ socketId });
  } else {
    channels.push({ channelId, subscribers: [{ socketId }] });
  }

  console.log("channels:", channels);

  // Soketi odaya kat

  await socket.join(channelId);
  // Send channel to the same channel subscribers
  io.to(channelId).emit("get-channel-subscribers", channels);
};
