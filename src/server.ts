import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// CORS'u yapılandırın
app.use(
  cors({
    origin: true, // Tüm origin'lere izin ver
    methods: ["GET", "POST"], // İzin verilen HTTP metodları
    credentials: true, // Kimlik bilgilerini içeren istekleri kabul et
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // Tüm origin'lere izin ver
    methods: ["GET", "POST"], // İzin verilen HTTP metodları
    credentials: true, // Kimlik bilgilerini içeren istekleri kabul et
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Client joined room: ${roomId}`);
  });

  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate, roomId) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => console.log("Server is running on port 5000"));
