// @ts-nocheck
import { useEffect, useState, useRef, useCallback } from "react";

const useSocket = (url: string, reconnect: boolean = true) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const reconnectRef = useRef(reconnect);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("🔌 WebSocket Connected");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("⚠️ WebSocket Disconnected");

      if (reconnectRef.current) {
        setTimeout(() => {
          console.log("🔄 Reconnecting...");
          setSocket(new WebSocket(url));
        }, 3000);
      }
    };

    return () => ws.close();
  }, [url]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.warn("⚠️ WebSocket not connected!");
      }
    },
    [socket]
  );

  return { socket, isConnected, messages, sendMessage };
};

export default useSocket;
