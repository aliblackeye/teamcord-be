import { Socket } from "socket.io";

export const onPing = (socket: Socket) => {
  socket.on("ping", (callback) => {
    callback();
  });
};
