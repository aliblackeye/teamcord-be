import { io, rooms } from "../server";
import { User } from "../types";

export const onLeaveRoom = ({
  channelId,
  user,
}: {
  channelId: string;
  user: User;
}) => {
  // kullanıcıyı room'ın subscribers'ından sil
  const room = rooms.find((vc) => vc.channelId === channelId);
  if (room) {
    room.users = room.users.filter((s) => s.socketId !== user.socketId);
  }

  // room boş ise, rooms'dan sil
  if (room?.users.length === 0) {
    const index = rooms.findIndex((vc) => vc.channelId === channelId);
    if (index !== -1) {
      rooms.splice(index, 1);
    }
  }

  io.to(channelId).emit("get-room", room);
};
