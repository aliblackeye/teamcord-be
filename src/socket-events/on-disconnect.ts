import { Socket } from "socket.io";
import { channels, io, rooms } from "../server";

export const onDisconnect = (socket: Socket) => {
  const joinedChannelIds = channels
    .filter((c) => c.subscribers.some((s) => s.socketId === socket.id))
    .map((c) => c.channelId);

  // Kullanıcıyı kanallardan çıkar
  channels.splice(
    0,
    channels.length,
    ...channels
      .map((c) => ({
        ...c,
        subscribers: c.subscribers.filter((s) => s.socketId !== socket.id),
      }))
      .filter((c) => c.subscribers.length > 0)
  );

  // kullanıcıyı sesli odalardan çıkar
  rooms.splice(
    0,
    rooms.length,
    ...rooms.map((r) => ({
      ...r,
      users: r.users.filter((s) => s.socketId !== socket.id),
    }))
  );

  // Aynı kanal abonelerine kanalı gönder
  joinedChannelIds.forEach((channelId) => {
    io.to(channelId).emit(
      "get-channel-subscribers",
      channels.find((c) => c.channelId === channelId)
    );
  });

  // sesli odaları gönder
  const joinedRooms = rooms.filter((r) =>
    joinedChannelIds.includes(r.channelId)
  );

  joinedRooms.forEach((room) => {
    io.to(room.channelId).emit("get-room", room);
  });
};
