import React from "react";

export const ProgressSteps = ({ currentStep }) => (
  <div className="flex items-center justify-center">
    <div className="flex items-center w-full max-w-2xl">
      {[1, 2, 3].map((step, idx) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= step
                ? "bg-amber-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {currentStep > step ? "✓" : step}
          </div>
          {idx < 2 && (
            <div
              className={`h-1 w-24 ${
                currentStep > step ? "bg-amber-600" : "bg-gray-200"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);