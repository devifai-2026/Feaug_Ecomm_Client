import React from "react";

export const ProgressSteps = ({ currentStep }) => {
  // Custom color definitions
  const primaryColor = '#C19A6B';
  const primaryLight = '#E8D4B9';

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center w-full max-w-2xl">
        {[1, 2, 3].map((step, idx) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step
                  ? "text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              style={currentStep >= step ? { backgroundColor: primaryColor } : {}}
            >
              {currentStep > step ? "✓" : step}
            </div>
            {idx < 2 && (
              <div
                className={`h-1 w-24 ${
                  currentStep > step ? "" : "bg-gray-200"
                }`}
                style={currentStep > step ? { backgroundColor: primaryColor } : {}}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Alternative with CSS classes (if you can add custom CSS globally)
export const ProgressStepsWithCSS = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center w-full max-w-2xl">
        {[1, 2, 3].map((step, idx) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {currentStep > step ? "✓" : step}
            </div>
            {idx < 2 && (
              <div
                className={`h-1 w-24 ${
                  currentStep > step ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

