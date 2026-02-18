import { BsCurrencyRupee } from "react-icons/bs";

export const OrderSummary = ({
  subtotal = 0,
  shippingCost = 0,
  tax = 0,
  total = 0,
  discountAmount = 0,
  cartItems = [],
  appliedPromo,
}) => (
  <div className="sticky top-24 space-y-6">
    <div className="bg-white shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b">
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium flex items-center">
            <BsCurrencyRupee className="text-sm mr-1" />
            {subtotal.toFixed(2)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              Discount {appliedPromo && `(${appliedPromo.code})`}
            </span>
            <span className="font-medium flex items-center">
              -<BsCurrencyRupee className="text-sm mr-1" />
              {discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium flex items-center">
            <BsCurrencyRupee className="text-sm mr-1" />
            {shippingCost.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax (3% GST)</span>
          <span className="font-medium flex items-center">
            <BsCurrencyRupee className="text-sm mr-1" />
            {tax.toFixed(2)}
          </span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="flex items-center">
              <BsCurrencyRupee className="text-base mr-1" />
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
        <p>🔒 100% Secure Payment</p>
      </div>
    </div>

    {/* Cart Items Details */}
    {cartItems && cartItems.length > 0 && (
      <div className="bg-white shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b">
          In Your Cart ({cartItems.length})
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {cartItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3
                      className="line-clamp-1 text-sm pointer-events-none"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">Qty {item.quantity}</p>
                  <div className="flex font-medium text-gray-900">
                    <BsCurrencyRupee className="text-sm mt-1" />
                    {(
                      (item.price || item.sellingPrice) * item.quantity
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
