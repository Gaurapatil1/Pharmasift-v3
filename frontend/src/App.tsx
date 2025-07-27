import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import  {CompareSection}  from "./components/CompareSection";

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CompareSection />
    </div>
  );
};

export default App;




