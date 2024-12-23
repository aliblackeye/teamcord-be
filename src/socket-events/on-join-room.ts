import { io, rooms } from "../server";
import { User } from "../types";
export const onJoinRoom = ({
  channelId,
  user,
}: {
  channelId: string;
  user: User;
}) => {
  console.log("odaya giriş yapıldı");
  const existingRoom = rooms.find((r) => r.channelId === channelId);

  if (existingRoom) {
    if (existingRoom.users.some((s) => s.socketId === user.socketId)) {
      console.warn("user already in room");
      return;
    }

    existingRoom.users.push(user);
  } else {
    rooms.push({
      channelId,
      users: [user],
      usersInCall: [],
      messages: [],
    });
  }

  io.to(channelId).emit(
    "get-room",
    existingRoom ? existingRoom : rooms.find((r) => r.channelId === channelId)
  );
};
