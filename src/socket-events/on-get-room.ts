import { rooms, io } from "../server";

export const onGetRoom = (channelId: string) => {
  const room = rooms.find((r) => r.channelId === channelId);
  io.to(channelId).emit("get-room", room || null);
};
