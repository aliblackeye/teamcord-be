import { voiceChannels, io } from "../server";

export const onGetVoiceChannel = (channelId: string) => {
  console.log("channelId", channelId);
  const voiceChannel = voiceChannels.find((vc) => vc.channelId === channelId);
  console.log("onGetVoiceChannel", voiceChannel);
  io.to(channelId).emit("get-voice-channel", voiceChannel || null);
};
