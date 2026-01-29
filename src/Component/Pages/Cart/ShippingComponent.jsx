import React, { useState, useEffect } from "react";
import {
  BsTruck,
  BsExclamationCircle,
  BsPlus,
  BsCheck,
  BsPencil,
  BsTrash,
  BsStar,
  BsStarFill,
} from "react-icons/bs";
import { INDIAN_STATES, validateShippingField } from "../../utils/Validation";

const InputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  error,
  maxLength,
}) => {
  const primaryColor = '#C19A6B';
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 ${error
          ? "border-red-500 focus:ring-red-500 bg-red-50"
          : "border-gray-300"
          }`}
        style={!error ? { '--tw-ring-color': primaryColor } : {}}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <BsExclamationCircle className="text-xs" />
          {error}
        </p>
      )}
    </div>
  );
};

const StateSelect = ({ label, name, value, onChange, onBlur, error }) => {
  const primaryColor = '#C19A6B';
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 ${error
          ? "border-red-500 focus:ring-red-500 bg-red-50"
          : "border-gray-300"
          }`}
        style={!error ? { '--tw-ring-color': primaryColor } : {}}
      >
        <option value="">Select a state</option>
        {INDIAN_STATES.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <BsExclamationCircle className="text-xs" />
          {error}
        </p>
      )}
    </div>
  );
};

const ShippingComponent = ({
  data,
  setData,
  errors,
  setErrors,
  touched,
  setTouched,
  saveInfo,
  setSaveInfo,
  savedAddresses: fetchedAddresses, // Rename prop to avoid conflict with state
}) => {
  // Custom color definitions
  const primaryColor = '#C19A6B';
  const primaryLight = '#E8D4B9';
  const primaryDark = '#A07A4B';

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sync with fetched addresses
  useEffect(() => {
    if (fetchedAddresses && fetchedAddresses.length > 0) {
      setSavedAddresses(fetchedAddresses);

      // Auto-select (prefer default, otherwise first)
      const defaultAddr = fetchedAddresses.find(addr => addr.isDefault) || fetchedAddresses[0];
      if (defaultAddr && !selectedAddressId) {
        setSelectedAddressId(defaultAddr._id);
        setData(defaultAddr);
      }
    }
  }, [fetchedAddresses, setData]); // Careful with dependencies

  // Handle saved address selection
  const handleSelectAddress = (address) => {
    console.log(address)
    setSelectedAddressId(address._id);
    setData(address);
    setIsAddingNewAddress(false);
    setIsEditing(false);
    // Clear errors when selecting saved address
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format phone and zipcode
    if (name === "phone") {
      const formatted = value.replace(/\D/g, "").slice(0, 10);
      setData({ ...data, [name]: formatted });
    } else if (name === "zipCode") {
      const formatted = value.replace(/\D/g, "").slice(0, 6);
      setData({ ...data, [name]: formatted });
    } else {
      setData({ ...data, [name]: value });
    }

    // Validate if field was touched
    if (touched[name]) {
      const error = validateShippingField(name, value, data);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateShippingField(name, value, data);
    setErrors({ ...errors, [name]: error });
  };

  // Add new address
  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true);
    setIsEditing(false);
    setSelectedAddressId(null);
    // Reset form for new address
    setData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      label: "",
      type: "home",
    });
    setErrors({});
    setTouched({});
  };

  // Save address (new or edit)
  const handleSaveAddress = () => {
    // Validate all fields
    const validationErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    requiredFields.forEach((field) => {
      const error = validateShippingField(field, data[field], data);
      if (error) validationErrors[field] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newAddress = {
      ...data,
      id: isEditing ? data.id : `addr_${Date.now()}`,
      isDefault: savedAddresses.length === 0 ? true : false,
    };

    if (isEditing) {
      // Update existing address
      const updatedAddresses = savedAddresses.map((addr) =>
        addr.id === data.id ? newAddress : addr
      );
      setSavedAddresses(updatedAddresses);
    } else {
      // Add new address
      setSavedAddresses([...savedAddresses, newAddress]);
    }

    // Select the newly saved address
    setSelectedAddressId(newAddress._id);
    setIsAddingNewAddress(false);
    setIsEditing(false);
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    if (savedAddresses.length <= 1) {
      alert("You must have at least one saved address");
      return;
    }

    const updatedAddresses = savedAddresses.filter((addr) => addr.id !== id);
    setSavedAddresses(updatedAddresses);

    if (selectedAddressId === id) {
      const defaultAddress = updatedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setData(defaultAddress);
      } else if (updatedAddresses.length > 0) {
        setSelectedAddressId(updatedAddresses[0]._id);
        setData(updatedAddresses[0]);
      } else {
        handleAddNewAddress();
      }
    }
  };

  // Set as default address
  const handleSetDefaultAddress = (id) => {
    const updatedAddresses = savedAddresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === id,
    }));
    setSavedAddresses(updatedAddresses);
    setSelectedAddressId(id);
  };

  // Edit address
  const handleEditAddress = (address) => {
    setData(address);
    setIsAddingNewAddress(true);
    setIsEditing(true);
    setSelectedAddressId(null);
  };

  // Cancel add/edit
  const handleCancel = () => {
    if (savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setData(defaultAddress);
      }
    }
    setIsAddingNewAddress(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
      <style>{`
        .custom-radio:checked {
          background-color: ${primaryColor};
          border-color: ${primaryColor};
        }
        .custom-checkbox:checked {
          background-color: ${primaryColor};
          border-color: ${primaryColor};
        }
        .custom-focus:focus {
          --tw-ring-color: ${primaryColor};
        }
      `}</style>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-3">
          <BsTruck className="text-2xl" style={{ color: primaryColor }} />
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">
            Shipping Information
          </h2>
        </div>
        {!isAddingNewAddress && (
          <button
            onClick={handleAddNewAddress}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 font-medium hover:opacity-90 transition-colors text-nowrap"
            style={{
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            <BsPlus className="text-lg" />
            Add New Address
          </button>
        )}
      </div>

      {/* Saved Addresses List */}
      {!isAddingNewAddress ? (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Select Delivery Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((address, index) => (
              <div
                key={address.id || index}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address.id
                  ? "border-2"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
                style={selectedAddressId === address.id ? {
                  borderColor: primaryColor,
                  backgroundColor: primaryLight + '20'
                } : {}}
                onClick={() => handleSelectAddress(address)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded"
                      style={{
                        backgroundColor: primaryLight,
                        color: primaryDark
                      }}
                    >
                      {address.label || address.type}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded flex items-center gap-1">
                        <BsStarFill className="text-xs" /> Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="p-1 text-gray-500 hover:text-amber-600"
                    >
                      <BsPencil />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600"
                      disabled={savedAddresses.length <= 1}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{address.address}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} - {address.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                    <p className="text-sm text-gray-600">Email: {address.email}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefaultAddress(address.id);
                    }}
                    className={`text-xs flex items-center gap-1 ${address.isDefault
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-amber-600"
                      }`}
                    style={address.isDefault ? { color: primaryColor } : {}}
                  >
                    {address.isDefault ? (
                      <BsStarFill className="text-xs" />
                    ) : (
                      <BsStar className="text-xs" />
                    )}
                    {address.isDefault ? "Default" : "Set as default"}
                  </button>
                  {selectedAddressId === address.id && (
                    <BsCheck className="text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Add/Edit Address Form */
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address Type/Label */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Label
              </label>
              <div className="flex gap-4">
                {["home", "work", "other"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={data.type === type}
                      onChange={handleChange}
                      className="h-4 w-4 custom-radio"
                    />
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <InputField
              label="First Name"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John"
              error={errors.firstName}
            />

            <InputField
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Doe"
              error={errors.lastName}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={data.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 ${errors.email
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-300"
                  } custom-focus`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <BsExclamationCircle className="text-xs" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="9876543210"
                  maxLength="10"
                  className={`w-full pl-14 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 ${errors.phone
                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                    : "border-gray-300"
                    } custom-focus`}
                />
                {data.phone && (
                  <span
                    className={`absolute right-3 top-2.5 text-sm ${data.phone.length === 10
                      ? "text-green-600"
                      : "text-yellow-600"
                      }`}
                  >
                    {data.phone.length}/10
                  </span>
                )}
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={data.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="House/Flat No., Building, Street, Area"
                rows="3"
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 ${errors.address
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-300"
                  } custom-focus`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <InputField
              label="City"
              name="city"
              value={data.city}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Bangalore"
              error={errors.city}
            />

            <StateSelect
              label="State"
              name="state"
              value={data.state}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.state}
            />

            <InputField
              label="ZIP Code"
              name="zipCode"
              value={data.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="560001"
              maxLength="6"
              error={errors.zipCode}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                name="country"
                value={data.country}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 custom-focus"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAddress}
              className="px-6 py-2 font-medium hover:opacity-90 transition-colors flex items-center gap-2"
              style={{
                backgroundColor: primaryColor,
                color: 'white'
              }}
            >
              <BsCheck />
              {isEditing ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* Save for future checkbox */}
      {!isAddingNewAddress && selectedAddressId && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveInfo"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="h-4 w-4 custom-checkbox"
            />
            <label
              htmlFor="saveInfo"
              className="ml-2 block text-sm text-gray-900"
            >
              Save this address for future use
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This address will be added to your saved addresses list
          </p>
        </div>
      )}
    </div>
  );
};

ShippingComponent.validate = async (data) => {
  const fields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "zipCode",
  ];
  let hasError = false;

  for (let field of fields) {
    if (validateShippingField(field, data[field], data)) {
      hasError = true;
      break;
    }
  }

  return !hasError;
};

export default ShippingComponent;