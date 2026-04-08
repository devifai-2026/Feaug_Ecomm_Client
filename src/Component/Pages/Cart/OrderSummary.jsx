import React from "react";
import { BsShieldCheck } from "react-icons/bs";

export const OrderSummary = ({
  subtotal = 0,
  shippingCost = 0,
  tax = 0,
  total = 0,
  discountAmount = 0,
  cartItems = [],
  appliedPromo,
}) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
    {/* The Receipt Card */}
    <div className="bg-gray-50/50 rounded-3xl p-10 border border-gray-100 shadow-2xl shadow-black/5 group">
       <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-12 flex items-center justify-between">
         Summary <span>Ref: ORD-MANIFEST</span>
       </h2>

       <div className="space-y-6">
          <div className="flex justify-between items-end">
             <span className="text-sm font-medium text-gray-400 tracking-tight">Curated Subtotal</span>
             <span className="text-xl font-bold text-gray-900 tabular-nums tracking-tighter">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          {discountAmount > 0 && (
             <div className="flex justify-between items-end text-green-600">
                <span className="text-sm font-medium tracking-tight">Luxury Privilege — {appliedPromo?.code}</span>
                <span className="text-xl font-bold tabular-nums tracking-tighter">-₹{discountAmount.toLocaleString("en-IN")}</span>
             </div>
          )}

          <div className="flex justify-between items-end">
             <span className="text-sm font-medium text-gray-400 tracking-tight">Shipping & Handling</span>
             <span className="text-xl font-bold text-gray-900 tabular-nums tracking-tighter">
               {shippingCost > 0 ? `₹${shippingCost}` : "Complementary"}
             </span>
          </div>

          <div className="flex justify-between items-end pb-12 border-b border-dashed border-gray-200">
             <span className="text-sm font-medium text-gray-400 tracking-tight">GST</span>
             <span className="text-xl font-bold text-gray-900 tabular-nums tracking-tighter">₹{tax.toLocaleString("en-IN")}</span>
          </div>

          <div className="pt-12 flex flex-col gap-4">
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Grand Total</span>
                <span className="text-5xl font-bold text-gray-900 tracking-tighter tabular-nums">
                  ₹{total.toLocaleString("en-IN")}
                </span>
             </div>
             <div className="flex items-center gap-3 text-green-600 justify-end">
                <BsShieldCheck className="text-sm" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-green-500">Secure Payment Terminal</span>
             </div>
          </div>
       </div>
    </div>

    {/* Items List - Compact Editorial Style */}
    <div className="space-y-10 group">
       <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 border-b border-gray-50 pb-4">Selections ({cartItems.length})</h3>
       <div className="max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="grid gap-12">
             {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-center group/item transition-all duration-500">
                   <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover/item:border-gray-900 group-hover/item:scale-105 transition-all duration-700">
                      <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest truncate">{item.title}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Quantity: 0{item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900 mt-2">₹{((item.price || item.sellingPrice) * item.quantity).toLocaleString("en-IN")}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  </div>
);
