// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_BASE = (process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000")
  .replace("/api/v1", "");

let _socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (_socket?.connected) return _socket;
  _socket = io(`${SOCKET_BASE}/chat`, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });
  return _socket;
};

export const getSocket = (): Socket | null => _socket;

export const disconnectSocket = (): void => {
  _socket?.disconnect();
  _socket = null;
};
