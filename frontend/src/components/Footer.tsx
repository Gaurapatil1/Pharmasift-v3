import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="text-center sm:text-left">
          &copy; 2025 PharmaSift. All rights reserved.
        </div>
        <div className="space-x-4 text-center">
          <a href="#" className="hover:text-blue-500 transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors duration-300">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
