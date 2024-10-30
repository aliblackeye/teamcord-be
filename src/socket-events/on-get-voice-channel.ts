import { voiceChannels, io } from "../server";

export const onGetVoiceChannel = (channelId: string) => {
  const voiceChannel = voiceChannels.find((vc) => vc.channelId === channelId);
  io.to(channelId).emit("get-voice-channel", voiceChannel || null);
};
