"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Document = {
  id: number;
  title: string;
  content: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      fetchDocuments(); // reload after create
    } catch (err) {
      console.error(err);
      setError("Error creating document");
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments(); // reload after delete
    } catch (err) {
      console.error(err);
      setError("Error deleting document");
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <form onSubmit={handleCreate} className="flex flex-col space-y-4 mb-8">
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
          className="p-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
        >
          Create Document
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">{doc.title}</h2>
            <p className="text-gray-700">{doc.content}</p>
            <button
              onClick={() => handleDelete(doc.id)}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}