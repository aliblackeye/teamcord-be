import { Socket } from "socket.io";
import { channels, io, voiceChannels } from "../server";

export const onDisconnect = (socket: Socket) => {
  console.log("ayrıldı");
  const joinedChannelIds = channels
    .filter((c) => c.subscribers.some((s) => s.socketId === socket.id))
    .map((c) => c.channelId);

  console.log("joinedChannelIds", joinedChannelIds);

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
  voiceChannels.splice(
    0,
    voiceChannels.length,
    ...voiceChannels.filter((vc) =>
      vc.subscribers.some((s) => s.socketId !== socket.id)
    )
  );

  // Aynı kanal abonelerine kanalları gönder
  joinedChannelIds.forEach((channelId) => {
    io.to(channelId).emit("get-channel-subscribers", channels);
  });

  // sesli odaları gönder
  const joinedVoiceChannels = voiceChannels.filter((vc) =>
    joinedChannelIds.includes(vc.channelId)
  );
  joinedVoiceChannels.forEach((vc) => {
    io.to(vc.channelId).emit("get-voice-channel", vc);
  });

  console.log("voiceChannels", voiceChannels);
};
