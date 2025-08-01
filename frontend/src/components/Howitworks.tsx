import React, { useState } from "react";

const stepsData = [
  {
    id: 1,
    title: "Search Medicine",
    description: "Enter the branded medicine name you want to compare.",
    imgSrc: "/src/assets/search_6-removebg-preview.png",
    bgColor: "bg-emerald-50",
    alt: "Search Medicine",
  },
  {
    id: 2,
    title: "AI Suggestion",
    description: "We suggest the closest generic or government alternatives using AI.",
    imgSrc: "src/assets/compare-icon-2.png",
    bgColor: "bg-indigo-50",
    alt: "AI Suggestion",
  },
  {
    id: 3,
    title: "Save",
    description: "Save your preferred medicines and reduce your healthcare expenses.",
    imgSrc: "src/assets/save_icon_3_-_Copy-removebg-preview.png",
    bgColor: "bg-rose-50",
    alt: "Save",
  },
];

const HowitWorks: React.FC = () => {
  // Track active and hovered steps by id
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const handlePointerEnter = (id: number) => {
    setHoveredStep(id);
  };

  const handlePointerLeave = () => {
    setHoveredStep(null);
  };

  const handleClick = (id: number) => {
    setActiveStep(id);
  };

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8">
        How It Works
      </h2>
      <p className="text-base sm:text-lg text-gray-600 mb-10 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto">
        We simplify the process of comparing medicine prices for you.
      </p>

      <div
        id="stepsContainer"
        className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 sm:gap-10"
        onMouseLeave={handlePointerLeave}
      >
        {stepsData.map(({ id, title, description, imgSrc, bgColor, alt }) => {
          // Determine classes based on active/hover states
          const isActive = activeStep === id;
          const isHovered = hoveredStep === id;

          // When a step is hovered or active, other steps get dimmed
          const dimOther = (activeStep !== null || hoveredStep !== null) && !isActive && !isHovered;

          const baseClasses =
            "how-step rounded-xl p-6 sm:p-8 shadow-md cursor-pointer border border-gray-200 flex-1 min-w-[260px] max-w-[300px] sm:max-w-[320px] mx-auto transition-all duration-300";

          // Compose the color + base classes
          let className = `${baseClasses} ${bgColor}`;

          if (dimOther) className += " opacity-50 scale-95"; // dim-step
          if (isHovered) className += " scale-105"; // hover-preview
          if (isActive) className += " opacity-100 scale-110 filter brightness-90 shadow-lg"; // active-step

          return (
            <div
              key={id}
              className={className}
              onPointerEnter={() => handlePointerEnter(id)}
              onClick={() => handleClick(id)}
            >
              <img
                src={imgSrc}
                alt={alt}
                className="mx-auto mb-5 sm:mb-6 w-20 sm:w-24 h-20 sm:h-24 object-contain transition-transform duration-500 ease-in-out"
                draggable={false}
              />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-800">{title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowitWorks;
