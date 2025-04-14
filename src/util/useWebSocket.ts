import { useEffect, useRef, useState } from "react";
import { UpdateRunDto } from "../models/run";

interface WebSocketMessage {
  data: UpdateRunDto;
}

export interface IWebSocketContext {
  messages: WebSocketMessage[];
  sendMessage: (data: UpdateRunDto) => void;
  clearMessages: () => void;
  socket: WebSocket | null;
}

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WS connected");
    };

    socket.onmessage = (event) => {
      let data: UpdateRunDto;
      try {
        data = JSON.parse(event.data);
        if (!data) return;
      } catch (e) {
        console.error("Failed to parse message:", e);
        return;
      }
      const message: WebSocketMessage = { data: data };
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (data: UpdateRunDto) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not open");
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return { messages, sendMessage, clearMessages, socket: socketRef.current };
}
