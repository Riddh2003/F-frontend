import React from "react";

const CustomProgress = ({ value, color, size }) => {
  
  // Set default values for props if not provided
  const progressValue = value || 0;
  const progressColor = color || "#00c6ff";
  const progressSize = size || "md";

  // Map size to corresponding CSS class
  const sizeClass = progressSize === "sm" ? "h-2" : progressSize === "lg" ? "h-6" : "h-4";

  // Define the styles for the progress bar
  const progressStyles = {
    width: `${progressValue}%`,
    backgroundColor: progressColor,
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full ${sizeClass}`}>
      <div className={`rounded-full ${sizeClass}`} style={progressStyles}></div>
    </div>
  );
};

export default CustomProgress;
