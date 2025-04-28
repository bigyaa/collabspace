"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

type Document = {
  id: number;
  title: string;
  content: string;
  shareId: string; // Added shareId for links
};

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [currentDocId, setCurrentDocId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";

  useEffect(() => {
    if (!token) return;

    const socket = io(apiUrl, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("receive-changes", (newContent: string) => {
      setContent(newContent);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, apiUrl]);

  useEffect(() => {
    if (!token) return;
    fetchDocuments();
  }, [token]);

  async function fetchDocuments() {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching documents");
    } finally {
      setLoading(false);
    }
  }

  async function createDocument(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to create document");

      setTitle("");
      setContent("");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError("Error creating document");
    }
  }

  async function deleteDocument(id: number) {
    try {
      const res = await fetch(`${apiUrl}/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete document");

      fetchDocuments();
      if (currentDocId === id) {
        setCurrentDocId(null);
        setContent("");
      }
    } catch (err) {
      console.error(err);
      setError("Error deleting document");
    }
  }

  function selectDocument(doc: Document) {
    setCurrentDocId(doc.id);
    setTitle(doc.title);
    setContent(doc.content);

    socketRef.current?.emit("join-document", doc.shareId); // Join by shareId now!
  }

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = e.target.value;
    setContent(newContent);

    if (socketRef.current && currentDocId !== null) {
      socketRef.current.emit("text-change", {
        documentId: getCurrentDocShareId(),
        content: newContent,
      });
    }
  }

  function getCurrentDocShareId() {
    const doc = documents.find((d) => d.id === currentDocId);
    return doc?.shareId;
  }

  function copyLink(shareId: string) {
    const url = `${window.location.origin}/doc/${shareId}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied!");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Your Documents</h2>
        {loading && <p>Loading documents...</p>}
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className={`p-2 rounded hover:bg-blue-100 flex justify-between items-center ${
                currentDocId === doc.id ? "bg-blue-200" : ""
              }`}
            >
              <span
                className="cursor-pointer font-medium"
                onClick={() => selectDocument(doc)}
              >
                {doc.title}
              </span>
              <button
                className="text-xs text-blue-600 hover:underline ml-2"
                onClick={() => copyLink(doc.shareId)}
              >
                Copy Link
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">
          {currentDocId ? "Editing Document" : "Create New Document"}
        </h1>

        <form onSubmit={createDocument} className="flex flex-col space-y-4 mb-6">
          <input
            type="text"
            placeholder="Title"
            className="p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            className="p-2 border rounded h-64 resize-none"
            value={content}
            onChange={handleContentChange}
            required
          />
          <div className="flex space-x-4">
            {!currentDocId && (
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Create
              </button>
            )}
            {currentDocId && (
              <button
                type="button"
                onClick={() => deleteDocument(currentDocId)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            )}
          </div>
        </form>

        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}