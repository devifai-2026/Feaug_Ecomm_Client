// Component/Pages/Cart/ShippingComponent.jsx
import React from 'react';
import { BsTruck } from 'react-icons/bs';

const ShippingComponent = ({
  shippingInfo,
  handleShippingChange,
  handleBlur,
  getFieldError,
  InputField,
  TextareaField,
  StateSelect,
  saveInfo,
  setSaveInfo
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <BsTruck className="text-2xl text-amber-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Shipping Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="First Name"
          name="firstName"
          value={shippingInfo.firstName}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          placeholder="Enter first name"
          error={getFieldError("firstName")}
        />

        <InputField
          label="Last Name"
          name="lastName"
          value={shippingInfo.lastName}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          placeholder="Enter last name"
          error={getFieldError("lastName")}
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={shippingInfo.email}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
          error={getFieldError("email")}
          className="md:col-span-2"
        />

        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={shippingInfo.phone}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          placeholder="Enter 10-digit phone number"
          error={getFieldError("phone")}
          className="md:col-span-2"
        />

        <TextareaField
          label="Address"
          name="address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          placeholder="Enter full address with house number, street, etc."
          error={getFieldError("address")}
          className="md:col-span-2"
        />

        <InputField
          label="City"
          name="city"
          value={shippingInfo.city}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          placeholder="Enter city"
          error={getFieldError("city")}
        />

        <StateSelect
          label="State"
          name="state"
          value={shippingInfo.state}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          error={getFieldError("state")}
        />

        <InputField
          label="ZIP Code"
          name="zipCode"
          value={shippingInfo.zipCode}
          onChange={handleShippingChange}
          onBlur={handleBlur}
          placeholder="Enter 6-digit ZIP"
          error={getFieldError("zipCode")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            name="country"
            value={shippingInfo.country}
            onChange={handleShippingChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-gray-400"
          >
            <option value="India">India</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <input
          type="checkbox"
          id="saveInfo"
          checked={saveInfo}
          onChange={(e) => setSaveInfo(e.target.checked)}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
        <label
          htmlFor="saveInfo"
          className="ml-2 block text-sm text-gray-900"
        >
          Save this information for next time
        </label>
      </div>
    </div>
  );
};

export default ShippingComponent;