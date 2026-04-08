import React, { useState, useEffect } from "react";
import {
  BsTruck,
  BsPlus,
  BsCheck,
  BsPencil,
  BsStarFill,
} from "react-icons/bs";
import { INDIAN_STATES, validateShippingField } from "../../utils/Validation";
import userApi from "../../../apis/user/userApi";
import toast from "react-hot-toast";

const InputField = ({ label, name, value, onChange, onBlur, type = "text", placeholder, error, maxLength }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
      {label}
    </label>
    <div className="relative">
      <input
        name={name} type={type} value={value} onChange={onChange} onBlur={onBlur}
        placeholder={placeholder} maxLength={maxLength}
        className={`w-full px-6 py-5 bg-gray-50 border transition-all duration-300 text-sm focus:bg-white ${
          error ? "border-red-200 bg-red-50" : "border-gray-100 focus:border-gray-900"
        } outline-none placeholder:text-gray-200`}
      />
      {error && <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-red-500">{error}</p>}
    </div>
  </div>
);

const ShippingComponent = ({
  data, setData, errors, setErrors, touched, setTouched,
  saveInfo, setSaveInfo, savedAddresses: fetchedAddresses,
  refreshAddresses, page, totalPages, totalAddresses, onPageChange
}) => {
  const primaryColor = "#C19A6B";
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fetchedAddresses && fetchedAddresses.length > 0) {
      setSavedAddresses(fetchedAddresses);
      if (!selectedAddressId) {
        const defaultAddr = fetchedAddresses.find((addr) => addr.isDefault) || fetchedAddresses[0];
        if (defaultAddr) { setSelectedAddressId(defaultAddr._id); setData(defaultAddr); }
      } else {
        const currentAddr = fetchedAddresses.find((addr) => addr._id === selectedAddressId);
        if (currentAddr) setData(currentAddr);
      }
    }
  }, [fetchedAddresses, setData, selectedAddressId]);

  const handleSelectAddress = (address) => {
    const addressId = address._id || address.id;
    setSelectedAddressId(addressId);
    setData({ ...address, _id: addressId });
    setIsAddingNewAddress(false);
    setIsEditing(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "phone") finalValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "zipCode") finalValue = value.replace(/\D/g, "").slice(0, 6);
    
    setData({ ...data, [name]: finalValue });
    if (touched[name]) setErrors({ ...errors, [name]: validateShippingField(name, finalValue, data) });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateShippingField(name, value, data) });
  };

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true);
    setIsEditing(false);
    setSelectedAddressId(null);
    setData({
      firstName: "", lastName: "", email: "", phone: "",
      address: "", city: "", state: "", zipCode: "", country: "India",
      label: "", type: "home", _id: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleSaveAddress = async () => {
    const validationErrors = {};
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    requiredFields.forEach((field) => {
      const error = validateShippingField(field, data[field], data);
      if (error) validationErrors[field] = error;
    });

    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      const addressPayload = {
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        phone: data.phone, address: data.address, addressLine1: data.address,
        city: data.city, state: data.state, pincode: data.zipCode,
        country: data.country || "India", addressType: data.type || "home", isDefault: data.isDefault || false,
      };

      const response = isEditing && data._id ? await userApi.updateAddress(data._id, addressPayload) : await userApi.addAddress(addressPayload);
      if (response.status === "success") {
        toast.success(isEditing ? "Updated" : "Added");
        const updated = await refreshAddresses();
        if (updated) {
          const match = isEditing ? updated.find((a) => a._id === data._id) : updated[updated.length - 1];
          if (match) { setSelectedAddressId(match._id); setData(match); }
        }
        setIsAddingNewAddress(false);
        setIsEditing(false);
      }
    } catch (error) { toast.error("Failed to save address"); } finally { setLoading(false); }
  };

  const handleCancel = () => {
    if (savedAddresses.length > 0) {
      const selection = savedAddresses.find((addr) => addr._id === selectedAddressId) || savedAddresses[0];
      if (selection) { setSelectedAddressId(selection._id); setData(selection); }
    }
    setIsAddingNewAddress(false);
    setIsEditing(false);
  };

  const isFormValid = () => {
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    return requiredFields.every(field => {
      const value = data[field];
      if (!value || value.trim() === "") return false;
      const error = validateShippingField(field, value, data);
      return !error;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div>
           <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
             Destination <BsTruck className="text-[#C19A6B]" />
           </h2>
           <p className="text-3xl md:text-5xl font-medium tracking-tight text-gray-900 leading-none">
             Where should we <br /><span className="italic text-[#C19A6B]">send your selection?</span>
           </p>
        </div>
        {!isAddingNewAddress && (
          <button onClick={handleAddNewAddress} className="group flex items-center gap-3 px-6 py-4 border border-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
             <BsPlus className="text-lg" /> Add Address
          </button>
        )}
      </div>

      {!isAddingNewAddress ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {savedAddresses.map((address) => (
              <div
                key={address._id || address.id}
                onClick={() => handleSelectAddress(address)}
                className={`relative p-10 border transition-all duration-700 ease-out cursor-pointer group ${
                  selectedAddressId === (address._id || address.id)
                    ? "border-gray-900 bg-white shadow-2xl shadow-black/5 -translate-y-2"
                    : "border-gray-50 hover:border-gray-200 hover:bg-gray-50/50"
                }`}
              >
                {selectedAddressId === (address._id || address.id) && (
                  <div className="absolute top-0 right-0 p-4">
                     <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">
                        <BsCheck />
                     </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-10">
                   <span className="text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-gray-900 transition-colors">
                     {address.label || address.type}
                   </span>
                   {address.isDefault && (
                     <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C19A6B] flex items-center gap-2">
                       <BsStarFill className="text-[8px]" /> Default
                     </span>
                   )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-medium text-gray-900 tracking-tight">
                    {address.firstName} {address.lastName}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
                    {address.address}, {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pt-6">
                    {address.phone}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsAddingNewAddress(true); setData(address); }} className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 underline underline-offset-8">Edit Record</button>
                </div>
              </div>
            ))}
          </div>

          {totalAddresses > 4 && (
            <div className="flex items-center justify-center gap-12 pt-12">
               <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 hover:text-gray-900 disabled:opacity-0 transition-all translate-y-0 hover:-translate-y-1">Previous</button>
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-900">0{page} / 0{totalPages}</span>
               <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 hover:text-gray-900 disabled:opacity-0 transition-all translate-y-0 hover:-translate-y-1">Next</button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-20 p-12 bg-gray-50/50 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-bottom-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <InputField label="First Name" name="firstName" value={data.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="Given Name" error={errors.firstName} />
            <InputField label="Last Name" name="lastName" value={data.lastName} onChange={handleChange} onBlur={handleBlur} placeholder="Surname" error={errors.lastName} />
            <InputField label="Email Address" name="email" value={data.email} onChange={handleChange} onBlur={handleBlur} placeholder="name@domain.com" error={errors.email} />
            <InputField label="Phone Number" name="phone" value={data.phone} onChange={handleChange} onBlur={handleBlur} placeholder="10 Digit Number" error={errors.phone} />
            <div className="md:col-span-2">
              <InputField label="Shipping Address" name="address" value={data.address} onChange={handleChange} onBlur={handleBlur} placeholder="Full physical address" error={errors.address} />
            </div>
            <InputField label="City" name="city" value={data.city} onChange={handleChange} onBlur={handleBlur} placeholder="Your City" error={errors.city} />
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">State / Region</label>
              <select name="state" value={data.state} onChange={handleChange} onBlur={handleBlur} className="w-full px-6 py-5 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-gray-900 focus:bg-white transition-all cursor-pointer appearance-none">
                <option value="">Choose State</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <InputField label="Pincode" name="zipCode" value={data.zipCode} onChange={handleChange} onBlur={handleBlur} placeholder="6 Digits" maxLength="6" error={errors.zipCode} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-12 border-t border-gray-200/50">
            <button onClick={handleCancel} className="w-full sm:w-auto px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100 hover:border-gray-900 hover:text-gray-900 transition-all">Cancel Entry</button>
            <button onClick={handleSaveAddress} disabled={loading || !isFormValid()} className="w-full sm:w-auto px-12 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C19A6B] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900">
               {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
               {isEditing ? "Refine Address" : "Save Destination"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingComponent;
