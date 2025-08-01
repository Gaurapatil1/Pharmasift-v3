import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section
      className="flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-6 py-12 sm:py-16 max-w-7xl mx-auto gap-10 md:gap-0"
    >
      {/* TEXT SECTION */}
      <div className="text-center md:text-left space-y-6 w-full md:w-1/2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Compare <span className="text-red-600 animate-pulse">Generic</span> and{" "}
          <span className="text-blue-600 animate-pulse">Branded</span> Medicine Prices
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
          Enter a branded medicine and we'll suggest cheaper{" "}
          <strong>Jan Aushadhi</strong> or generic alternatives using AI.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
          <button
            id="compare-btn"
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 text-center"
          >
            Compare Now
          </button>
          <button
            id="howitworks-btn"
            className="bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition-transform duration-300 transform hover:scale-105 text-center"
          >
            How It Works
          </button>
        </div>
      </div>

      {/* VIDEO SECTION */}
      <div className="flex items-center justify-center w-full md:w-1/2">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg shadow-lg"
        >
          <source src="/src/assets/medicine-lottie.json.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default HeroSection;

