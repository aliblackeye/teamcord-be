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
  console.log("kanala abone oldu", channelId);
  const existingChannel = channels.find((c) => c.channelId === channelId);

  if (existingChannel) {
    if (existingChannel.subscribers.some((s) => s.socketId === socketId)) {
      return;
    }

    existingChannel.subscribers.push({ socketId });
  } else {
    channels.push({ channelId, subscribers: [{ socketId }] });
  }

  // Soketi odaya kat

  await socket.join(channelId);
  // Send channel to the same channel subscribers
  io.to(channelId).emit(
    "get-channel-subscribers",
    existingChannel
      ? existingChannel
      : channels.find((c) => c.channelId === channelId)
  );
};
