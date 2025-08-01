import { useState, useRef, useEffect } from "react";
import { useAuth } from "./authContext";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AIAssistantChat({ onClose }: { onClose: () => void }) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! Ask me about any medicine 💊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();
      const aiMsg = { role: "ai" as const, content: data.reply || "No response" };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Error: Could not get response from AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveChat = () => {
    const text = messages.map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chat.txt";
    link.click();
  };

  return (
    <div className="fixed bottom-24 right-8 bg-white rounded-xl shadow-2xl w-96 max-h-[75vh] flex flex-col z-50 border border-gray-200">
      <header className="p-4 font-semibold border-b text-blue-700 text-center select-none">
        💬 AI Medicine Assistant
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-2 space-y-3 text-sm scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md whitespace-pre-wrap break-words max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-100 text-right self-end"
                : "bg-gray-100 text-left self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="border-t p-2 flex flex-col space-y-2">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a medicine..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
            autoFocus
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "…" : "Send"}
          </button>
        </div>

        {/* Save and Close Buttons at Bottom */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={saveChat}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm font-medium"
          >
            Save Chat
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-medium"
          >
            Close Chat
          </button>
        </div>
      </footer>
    </div>
  );
}
