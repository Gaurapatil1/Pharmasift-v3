// LoginModal.tsx
import { useState } from "react";
import { useAuth } from "./authContext";

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const endpoint = isSignup ? "/signup" : "/login";
    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Auth failed");

      if (!isSignup) {
        login(data.access_token);
        onClose();
      } else {
        alert("Signup successful! Now login.");
        setIsSignup(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
          onClick={handleSubmit}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <button
          className="w-full text-sm text-blue-500"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "No account? Sign up"}
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 mt-3 block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
