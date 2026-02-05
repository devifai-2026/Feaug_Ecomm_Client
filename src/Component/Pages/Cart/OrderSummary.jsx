import { BsCurrencyRupee } from "react-icons/bs";

export const OrderSummary = ({
  subtotal,
  shippingCost,
  tax,
  total,
  discountAmount,
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
  </div>
);
