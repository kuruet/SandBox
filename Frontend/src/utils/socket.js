import { io } from "socket.io-client";

let socket;

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"], // optional but recommended
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
