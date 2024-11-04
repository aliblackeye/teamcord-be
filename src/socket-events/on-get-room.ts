import { rooms, io } from "../server";

export const onGetRoom = (channelId: string) => {
  console.log("get-room", channelId);

  const room = rooms.find((r) => r.channelId === channelId);

  io.to(channelId).emit("get-room", room || null);
};
