import { io, voiceChannels } from "../server";
import { NewMessage } from "../types";
import { v4 as uuidv4 } from "uuid";

export const onNewRoomMessage = ({
  channelId,
  message,
}: {
  channelId: string;
  message: NewMessage;
}) => {
  const voiceChannel = voiceChannels.find((vc) => vc.channelId === channelId);
  if (voiceChannel) {
    voiceChannel.messages.push({
      ...message,
      id: uuidv4(),
      createdAt: new Date(),
    });
  }

  console.log("new-room-message", message);
  console.log("channelId", channelId);
  io.to(channelId).emit("new-room-message", message);
};
