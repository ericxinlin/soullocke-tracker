import { useEffect, useRef, useState } from "react";
import { UpdateRunDto } from "../models/run";

interface WebSocketMessage {
  event: string;
  data?: any;
}

export interface IWebSocketContext {
  messages: WebSocketMessage[];
  sendMessage: (data: UpdateRunDto) => void;
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
      console.log(event);
      const message: WebSocketMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message);
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
      console.log("Sending payload: ", JSON.stringify(data));
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not open");
    }
  };

  return { messages, sendMessage, socket: socketRef.current };
}
