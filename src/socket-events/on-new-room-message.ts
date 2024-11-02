import { io, rooms } from "../server";
import { NewMessage } from "../types";
import { v4 as uuidv4 } from "uuid";

export const onNewRoomMessage = ({
  channelId,
  message,
}: {
  channelId: string;
  message: NewMessage;
}) => {
  const room = rooms.find((r) => r.channelId === channelId);
  if (room) {
    room.messages.push({
      ...message,
      id: uuidv4(),
      createdAt: new Date(),
    });
  }

  io.to(channelId).emit("new-room-message", message);
};
