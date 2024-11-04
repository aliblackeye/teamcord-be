import { io, rooms } from "../server";
import { User } from "../types";
export const onJoinCall = ({
  channelId,
  user,
}: {
  channelId: string;
  user: User;
}) => {
  const alreadyJoinedRoom = rooms.find((r) =>
    r.users.some((s) => s.socketId === user.socketId)
  );

  if (alreadyJoinedRoom) {
    return;
  }

  const existingRoom = rooms.find((r) => r.channelId === channelId);

  if (existingRoom) {
    console.log("existingRoom", existingRoom);
    const existingParticipant = existingRoom.users.find(
      (s) => s.socketId === user.socketId
    );

    if (existingParticipant) {
      return;
    }

    existingRoom.users.push(user);
    console.log("Sesli odaya katildi");
  } else {
    rooms.push({
      channelId,
      users: [],
      usersInCall: [user],
      messages: [],
    });
    console.log("Yeni sesli oda olusturuldu");
  }

  io.to(channelId).emit(
    "get-room",
    existingRoom ? existingRoom : rooms.find((r) => r.channelId === channelId)
  );
};
