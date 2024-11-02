import { io, rooms } from "../server";
import { Participant } from "../types";
export const onJoinRoom = ({
  channelId,
  participant,
}: {
  channelId: string;
  participant: Participant;
}) => {
  const alreadyJoinedRoom = rooms.find((r) =>
    r.subscribers.some((s) => s.socketId === participant.socketId)
  );

  if (alreadyJoinedRoom) {
    return;
  }

  const existingRoom = rooms.find((r) => r.channelId === channelId);

  if (existingRoom) {
    console.log("existingRoom", existingRoom);
    const existingParticipant = existingRoom.subscribers.find(
      (s) => s.socketId === participant.socketId
    );

    if (existingParticipant) {
      return;
    }

    existingRoom.subscribers.push(participant);
    console.log("Sesli odaya katildi");
  } else {
    rooms.push({
      channelId,
      subscribers: [],
      usersInCall: [participant],
      messages: [],
    });
    console.log("Yeni sesli oda olusturuldu");
  }

  io.to(channelId).emit(
    "get-room",
    existingRoom ? existingRoom : rooms.find((r) => r.channelId === channelId)
  );
};
