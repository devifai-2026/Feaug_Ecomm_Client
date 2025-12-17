// Component/Pages/Cart/BillingComponent.jsx
import React from 'react';
import { BsCreditCard } from 'react-icons/bs';

const BillingComponent = ({
  sameAsShipping,
  setSameAsShipping,
  billingInfo,
  handleBillingChange,
  handleBlur,
  getFieldError,
  InputField,
  TextareaField,
  StateSelect
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Billing Address
        </h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label
            htmlFor="sameAsShipping"
            className="ml-2 block text-sm text-gray-900"
          >
            Same as shipping address
          </label>
        </div>
      </div>

      {!sameAsShipping && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            name="billing_firstName"
            value={billingInfo.firstName}
            onChange={handleBillingChange}
            onBlur={handleBlur}
            placeholder="Enter first name"
            error={getFieldError("billing_firstName")}
          />

          <InputField
            label="Last Name"
            name="billing_lastName"
            value={billingInfo.lastName}
            onChange={handleBillingChange}
            onBlur={handleBlur}
            placeholder="Enter last name"
            error={getFieldError("billing_lastName")}
          />

          <TextareaField
            label="Address"
            name="billing_address"
            value={billingInfo.address}
            onChange={handleBillingChange}
            onBlur={handleBlur}
            placeholder="Enter full address"
            error={getFieldError("billing_address")}
            className="md:col-span-2"
          />

          <InputField
            label="City"
            name="billing_city"
            value={billingInfo.city}
            onChange={handleBillingChange}
            onBlur={handleBlur}
            placeholder="Enter city"
            error={getFieldError("billing_city")}
          />

          <StateSelect
            label="State"
            name="billing_state"
            value={billingInfo.state}
            onChange={handleBillingChange}
            onBlur={handleBlur}
            error={getFieldError("billing_state")}
          />

          <InputField
            label="ZIP Code"
            name="billing_zipCode"
            value={billingInfo.zipCode}
            onChange={handleBillingChange}
            onBlur={handleBlur}
            placeholder="Enter 6-digit ZIP"
            error={getFieldError("billing_zipCode")}
          />
        </div>
      )}
    </div>
  );
};

export default BillingComponent;