// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const initSocket = () => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
//       transports: ["websocket"],
//     });
//   }
//   return socket;
// };

// export function useChat(roomId: string) {
//   const [messages, setMessages] = useState<any[]>([]);

//   useEffect(() => {
//     const s = initSocket();
//     s.emit("join", roomId);
//     s.on("message", (msg: any) => setMessages((prev) => [...prev, msg]));
//     return () => {
//       s.emit("leave", roomId);
//       s.off("message");
//     };
//   }, [roomId]);

//   const send = (text: string) => {
//     const s = socket;
//     s?.emit("message", { room: roomId, text });
//   };

//   return { messages, send };
// }
