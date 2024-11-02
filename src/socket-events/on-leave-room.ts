import { io, rooms } from "../server";
import { Participant } from "../types";

export const onLeaveRoom = ({
  channelId,
  participant,
}: {
  channelId: string;
  participant: Participant;
}) => {
  // kullanıcıyı room'ın subscribers'ından sil
  const room = rooms.find((vc) => vc.channelId === channelId);
  if (room) {
    room.subscribers = room.subscribers.filter(
      (s) => s.socketId !== participant.socketId
    );
  }

  // room boş ise, rooms'dan sil
  if (room?.subscribers.length === 0) {
    const index = rooms.findIndex((vc) => vc.channelId === channelId);
    if (index !== -1) {
      rooms.splice(index, 1);
    }
  }

  io.to(channelId).emit("get-room", room);
};
