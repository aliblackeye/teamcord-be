import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// Tüm originlere izin ver
app.use(
  cors({
    origin: "*", // Tüm originlere izin ver
    methods: ["GET", "POST"], // İzin verilen HTTP metodları
    credentials: true, // Kimlik bilgilerini içeren istekleri kabul et
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Tüm originlere izin ver
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`Client ${username} joined room: ${roomId}`);
    // Odaya katılan diğer kullanıcılara bildirim gönder
    socket.to(roomId).emit("user-joined", { id: socket.id, username });
    // Odadaki mevcut kullanıcıları yeni katılan kullanıcıya bildir
    const roomClients = io.sockets.adapter.rooms.get(roomId);
    if (roomClients) {
      const existingUsers = Array.from(roomClients).filter(
        (id) => id !== socket.id
      );
      socket.emit("existing-users", existingUsers);
    }
  });

  socket.on("offer", (offer, roomId, targetId) => {
    console.log(`Offer from ${socket.id} to ${targetId} in room ${roomId}`);
    socket.to(targetId).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, roomId, targetId) => {
    console.log(`Answer from ${socket.id} to ${targetId} in room ${roomId}`);
    socket.to(targetId).emit("answer", answer, socket.id);
  });

  socket.on("ice-candidate", (candidate, roomId, targetId) => {
    console.log(
      `ICE candidate from ${socket.id} to ${targetId} in room ${roomId}`
    );
    socket.to(targetId).emit("ice-candidate", candidate, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Odaya katılan diğer kullanıcılara bildirim gönder
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("user-left", { id: socket.id });
    });
  });
});

server.listen(5000, () => console.log("Server is running on port 5000"));
