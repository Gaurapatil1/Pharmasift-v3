import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/src/assets/logopharma.jpg"
            alt="PharmaSift"
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-red-700">PharmaSift</h1>
        </div>

        {/* Navigation */}
        <nav
          className={`md:flex space-x-6 text-lg font-medium ${isOpen
              ? "block absolute top-full left-0 w-full bg-white px-4 py-4 md:static md:w-auto md:bg-transparent"
              : "hidden"
            }`}
        >
          <Link
            to="/"
            className="block md:inline hover:text-blue-500 transition transform hover:scale-110"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="block md:inline hover:text-blue-500 transition transform hover:scale-110"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block md:inline hover:text-blue-500 transition transform hover:scale-110"
          >
            Signup
          </Link>
          <a
            href="#stepsContainer"
            className="block md:inline hover:text-blue-500 transition transform hover:scale-110"
          >
            How It Works
          </a>

          <Link
            to="/saved"
            className="block md:inline hover:text-blue-500 transition transform hover:scale-110"
          >
            Save
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          id="menu-toggle"
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
