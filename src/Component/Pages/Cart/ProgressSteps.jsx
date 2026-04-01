import React from "react";

export const ProgressSteps = ({ currentStep }) => {
  const primaryColor = "#C19A6B";

  const steps = [
    { id: 1, name: "Shipping" },
    { id: 2, name: "Payment" },
    { id: 3, name: "Review" },
  ];

  return (
    <div className="w-full py-12">
      <div className="flex items-center justify-center max-w-2xl mx-auto px-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center group relative cursor-default">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-700 ease-in-out border ${
                  currentStep >= step.id
                    ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-black/5"
                    : "bg-white border-gray-100 text-gray-300"
                }`}
                style={{
                  fontFamily: "'Passenger Display', serif",
                }}
              >
                {currentStep > step.id ? (
                  <span className="text-sm font-bold tracking-widest text-[#C19A6B]">DONE</span>
                ) : (
                  <span className={currentStep === step.id ? "italic" : ""}>0{step.id}</span>
                )}
              </div>
              
              <div className="absolute -bottom-8">
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap ${
                    currentStep >= step.id ? "text-gray-900" : "text-gray-300"
                  }`}
                >
                  {step.name}
                </span>
                {currentStep === step.id && (
                  <div className="h-[1px] bg-[#C19A6B] w-full mt-1 transform scale-x-100 transition-transform duration-500 origin-left"></div>
                )}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex-1 mx-8 h-[1px] bg-gray-100 relative overflow-hidden">
                <div
                  className="absolute inset-0 transition-all duration-1000 ease-in-out"
                  style={{
                    backgroundColor: "#C19A6B",
                    width: currentStep > step.id ? "100%" : "0%",
                  }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
