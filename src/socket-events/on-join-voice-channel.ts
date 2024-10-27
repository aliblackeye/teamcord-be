import { io, voiceChannels } from "../server";
import { Participant } from "../types";
export const onJoinVoiceChannel = ({
  channelId,
  participant,
}: {
  channelId: string;
  participant: Participant;
}) => {
  const existingVoiceChannel = voiceChannels.find(
    (vc) => vc.channelId === channelId
  );

  if (existingVoiceChannel) {
    existingVoiceChannel.subscribers.push(participant);
  } else {
    voiceChannels.push({
      channelId,
      subscribers: [participant],
    });
  }

  io.to(channelId).emit(
    "get-voice-channel",
    existingVoiceChannel
      ? existingVoiceChannel
      : voiceChannels.find((vc) => vc.channelId === channelId)
  );

  console.log(
    existingVoiceChannel
      ? existingVoiceChannel
      : voiceChannels.find((vc) => vc.channelId === channelId)
  );
};
