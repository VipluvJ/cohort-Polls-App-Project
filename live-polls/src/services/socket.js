import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const SOCKET_URL = API_URL.replace(/\/api\/polls\/?$/, "");
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
