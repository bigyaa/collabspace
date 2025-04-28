"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function DocumentPage() {
  const { shareId } = useParams() as { shareId: string };
  const [content, setContent] = useState("");
  const socketRef = useRef<Socket | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";

  useEffect(() => {
    if (!shareId || !token) return;

    const socket = io(apiUrl, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.emit("join-document", shareId);

    socket.on("receive-changes", (newContent: string) => {
      setContent(newContent);
    });

    return () => {
      socket.disconnect();
    };
  }, [shareId, token, apiUrl]);

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = e.target.value;
    setContent(newContent);

    if (socketRef.current) {
      socketRef.current.emit("text-change", {
        documentId: shareId,
        content: newContent,
      });
    }
  }

  return (
    <main className="p-8 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Collaborative Document</h1>
      <textarea
        className="w-full h-96 p-4 border rounded resize-none"
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing..."
      />
    </main>
  );
}