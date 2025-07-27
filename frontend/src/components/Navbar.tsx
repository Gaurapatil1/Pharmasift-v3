import React from 'react';

const Navbar: React.FC = () => (
  <header className="bg-white shadow sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/assets/logopharma.jpg" alt="PharmaSift" className="w-10 h-10" />
        <h1 className="text-xl font-bold text-red-700">PharmaSift</h1>
      </div>
      <nav className="hidden md:flex space-x-6 text-lg font-medium">
        <a href="/" className="hover:text-blue-500 transition transform hover:scale-110">Home</a>
        <a href="#compare" className="hover:text-blue-500 transition transform hover:scale-110">Compare</a>
        <a href="#upload" className="hover:text-blue-500 transition transform hover:scale-110">Upload CSV</a>
        <a href="#how-it-works" className="hover:text-blue-500 transition transform hover:scale-110">How It Works</a>
        <a href="#about" className="hover:text-blue-500 transition transform hover:scale-110">About</a>
      </nav>
      <button id="menu-toggle" className="md:hidden focus:outline-none">
        {/* menu icon SVG */}
      </button>
    </div>
  </header>
);

export default Navbar;
