import React from "react";
import { BsCreditCard, BsShieldCheck, BsLock } from "react-icons/bs";

const PaymentComponent = ({ data = {}, setData, total }) => {
  const primaryColor = "#C19A6B";
  const paymentData = { method: "online", ...data };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div>
           <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
             Payment Method <BsLock className="text-[#C19A6B]" />
           </h2>
           <p className="text-3xl md:text-5xl font-medium tracking-tight text-gray-900 leading-none">
             Choose your <br /><span className="italic text-[#C19A6B]">secure transaction handler</span>
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="group relative p-12 bg-white border border-gray-900 shadow-2xl shadow-black/5 transition-all duration-700 overflow-hidden">
           {/* Razorpay Badge */}
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BsCreditCard className="text-[12rem]" />
           </div>

           <div className="flex flex-col md:flex-row items-start justify-between gap-12 relative z-10">
              <div className="space-y-8 max-w-lg">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl shadow-black/20">
                       <BsCreditCard className="text-2xl" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-2xl font-medium text-gray-900 tracking-tight">Express Checkout</h3>
                       <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C19A6B]">Powered by Razorpay</p>
                    </div>
                 </div>

                 <p className="text-sm text-gray-400 leading-relaxed uppercase tracking-tight">
                   Experience a seamless transaction. Pay securely with your Credit or Debit Card, UPI, Wallets, or Netbanking. All details are encrypted and handled exclusively by Razorpay.
                 </p>
              </div>

              <div className="w-full md:w-auto min-w-[280px] p-10 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col justify-center text-center md:text-right group-hover:bg-white transition-colors duration-700">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Total Amount to Settle</h4>
                 <p className="text-5xl font-bold text-gray-900 mb-6 tabular-nums tracking-tighter">
                   ₹{total.toLocaleString("en-IN")}
                 </p>
                 <div className="flex items-center justify-center md:justify-end gap-3 text-green-600">
                    <BsShieldCheck className="text-sm" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">PCI DSS Compliant Secure</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-8 border border-dashed border-gray-200 rounded-3xl text-center text-gray-400 italic text-sm tracking-tight">
          "The jewelry will be reserved for you upon successful completion of the payment journey."
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
