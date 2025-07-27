import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="text-center py-16 bg-gray-100">
      <h2 className="text-4xl font-bold text-blue-600">Welcome to PharmaSift</h2>
      <p className="mt-4 text-lg text-gray-700">
        The smarter way to compare and manage your medicine data.
      </p>
    </section>
  );
};

export default HeroSection;
