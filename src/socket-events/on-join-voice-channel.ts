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
    console.log("existingVoiceChannel", existingVoiceChannel);
    if (
      existingVoiceChannel.subscribers.some(
        (s) => s.socketId === participant.socketId
      )
    )
      return;

    existingVoiceChannel.subscribers.push(participant);
    console.log("Sesli odaya katildi");
  } else {
    voiceChannels.push({
      channelId,
      subscribers: [participant],
    });
    console.log("Yeni sesli oda olusturuldu");
  }

  io.to(channelId).emit(
    "get-voice-channel",
    existingVoiceChannel
      ? existingVoiceChannel
      : voiceChannels.find((vc) => vc.channelId === channelId)
  );
};
