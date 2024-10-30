import { WebRTCSignal } from "../types";
import { io } from "../server";

export const onWebRTCSignal = async (data: WebRTCSignal) => {
  const socketId = data.participant.socketId;
  if (socketId) {
    io.to(socketId).emit("webrtc-signal", data);
  }
};
