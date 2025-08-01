import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import { CompareSection } from "./components/CompareSection";
import Howitworks from "./components/Howitworks";
import Footer from "./components/Footer";
import SavedMedicines from "./components/save";
import AIAssistant from "./components/AIAssistant";
import { AuthProvider } from "./components/authContext";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="relative">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <CompareSection />
                <Howitworks />
              </>
            }
          />
          <Route path="/saved" element={<SavedMedicines />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <AIAssistant />
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;


