import { useState } from "react";
import { useAuth } from "./authContext";
import LoginModal from "./LoginModal";
import AIAssistantChat from "./AIAssistantChat";

export default function AIAssistant() {
  const { token } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [floatingVisible, setFloatingVisible] = useState(true); // 💬 button visibility

  const handleClick = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      setShowChat(true);
      setFloatingVisible(false); // hide 💬 when chat opens
    }
  };

  const closeChat = () => {
    setShowChat(false);
    setFloatingVisible(true); // show 💬 when chat closes
  };

  return (
    <>
      {/* AI Chatbox */}
      {token && showChat && <AIAssistantChat onClose={closeChat} />}

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* 💬 Floating Button */}
      {floatingVisible && (
        <button
          onClick={handleClick}
          aria-label="Open AI Assistant Chat"
          title="AI Assistant"
          className="fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 text-white px-6 py-5 rounded-full shadow-xl text-2xl hover:scale-110 transition-transform duration-300 z-50 focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          💬
        </button>
      )}
    </>
  );
}
