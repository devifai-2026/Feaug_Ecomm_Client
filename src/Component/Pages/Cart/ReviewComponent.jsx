import React from "react";
import { BsCheckCircle, BsShieldCheck } from "react-icons/bs";

export const ReviewComponent = ({
  shippingInfo,
  billingInfo,
  cartItems,
  subtotal,
  shippingCost,
  tax,
  total,
  discountAmount,
  appliedPromo,
}) => (
  <div className="animate-in fade-in slide-in-from-bottom-6">
    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
      <div>
         <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
           Order Review <BsCheckCircle className="text-[#C19A6B]" />
         </h2>
         <p className="text-3xl md:text-5xl font-medium tracking-tight text-gray-900 leading-none">
           A final look at <br /><span className="italic text-[#C19A6B]">your curated selection</span>
         </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* Manifest Items List */}
      <div className="space-y-12">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 border-b border-gray-100 pb-4">Order Manifest</h3>
        <div className="space-y-8">
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex gap-6 group">
              <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                <img src={item.image || item.product?.images?.[0]?.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#C19A6B]">Price Settled</span>
                  <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logistics & Payment Manifest */}
      <div className="space-y-12">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 border-b border-gray-100 pb-4">Logistics Summary</h3>
        
        <div className="p-10 border border-gray-100 bg-gray-50 rounded-3xl space-y-10 group hover:border-gray-900 transition-all duration-700">
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C19A6B]">Shipping Destination</h4>
             <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
                  {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} — {shippingInfo.zipCode}
                </p>
                <p className="text-[10px] font-bold text-gray-900 pt-2 tracking-widest">{shippingInfo.phone}</p>
             </div>
          </div>

          <div className="space-y-4 pt-10 border-t border-gray-200/50">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C19A6B]">Billing Record</h4>
             <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{billingInfo.firstName} {billingInfo.lastName}</p>
                <p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
                  {billingInfo.address}, {billingInfo.city}, {billingInfo.state} — {billingInfo.zipCode}
                </p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 pt-6 text-green-600">
             <BsShieldCheck className="text-sm" />
             <span className="text-[9px] font-bold uppercase tracking-widest">Details Verified</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
