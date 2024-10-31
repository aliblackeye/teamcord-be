import { io, voiceChannels } from "../server";
import { Participant } from "../types";
export const onJoinVoiceChannel = ({
  channelId,
  participant,
}: {
  channelId: string;
  participant: Participant;
}) => {
  const alreadyJoinedVoiceChannel = voiceChannels.find((vc) =>
    vc.subscribers.some((s) => s.socketId === participant.socketId)
  );

  if (alreadyJoinedVoiceChannel) {
    return;
  }

  const existingVoiceChannel = voiceChannels.find(
    (vc) => vc.channelId === channelId
  );

  if (existingVoiceChannel) {
    console.log("existingVoiceChannel", existingVoiceChannel);
    const existingParticipant = existingVoiceChannel.subscribers.find(
      (s) => s.socketId === participant.socketId
    );

    if (existingParticipant) {
      return;
    }

    existingVoiceChannel.subscribers.push(participant);
    console.log("Sesli odaya katildi");
  } else {
    voiceChannels.push({
      channelId,
      subscribers: [participant],
      messages: [],
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
