import React from "react";
import { BsCreditCard, BsExclamationCircle } from "react-icons/bs";
import { INDIAN_STATES, validateBillingField } from "../../utils/validation";

const BillingComponent = ({
  data,
  setData,
  sameAsShipping,
  setSameAsShipping,
  errors,
  setErrors,
  touched,
  setTouched,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    if (touched[name]) {
      const error = validateBillingField(name, value, data);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateBillingField(name, value, data);
    setErrors({ ...errors, [name]: error });
  };

  if (sameAsShipping) return null;

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Billing Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["firstName", "lastName", "address", "city", "state", "zipCode"].map(
          (field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.replace(/([A-Z])/g, " $1").trim()}
                <span className="text-red-500">*</span>
              </label>
              {field === "address" ? (
                <textarea
                  name={field}
                  value={data[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="3"
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 md:col-span-2 ${
                    errors[field]
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-amber-500"
                  }`}
                />
              ) : field === "state" ? (
                <select
                  name={field}
                  value={data[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 ${
                    errors[field]
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-amber-500"
                  }`}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field === "zipCode" ? "text" : "text"}
                  name={field}
                  value={data[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={field === "zipCode" ? 6 : undefined}
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 ${
                    errors[field]
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-amber-500"
                  }`}
                />
              )}
              {errors[field] && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <BsExclamationCircle className="text-xs" />
                  {errors[field]}
                </p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

BillingComponent.validate = async (data, sameAsShipping) => {
  if (sameAsShipping) return true;

  const fields = ["firstName", "lastName", "address", "city", "state", "zipCode"];
  for (let field of fields) {
    if (validateBillingField(field, data[field], data)) {
      return false;
    }
  }
  return true;
};

export default BillingComponent;