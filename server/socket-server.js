import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(socket.id, "joined", room);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
  });

  socket.on("message", (msg) => {
    // msg: { room, text, user }
    if (msg.room) io.to(msg.room).emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected", socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
server.listen(PORT, () => console.log("Socket server listening on", PORT));
