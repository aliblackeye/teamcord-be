import { io, voiceChannels } from "../server";
import { Participant } from "../types";

export const onLeaveVoiceChannel = ({
  channelId,
  participant,
}: {
  channelId: string;
  participant: Participant;
}) => {
  // kullanıcıyı voiceChannel'ın subscribers'ından sil
  const voiceChannel = voiceChannels.find((vc) => vc.channelId === channelId);
  if (voiceChannel) {
    voiceChannel.subscribers = voiceChannel.subscribers.filter(
      (s) => s.socketId !== participant.socketId
    );
  }

  // voiceChannel boş ise, voiceChannels'dan sil
  if (voiceChannel?.subscribers.length === 0) {
    const index = voiceChannels.findIndex((vc) => vc.channelId === channelId);
    if (index !== -1) {
      voiceChannels.splice(index, 1);
    }
  }

  io.to(channelId).emit("get-voice-channel", voiceChannel);
};
