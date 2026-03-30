import React from "react";
import { INDIAN_STATES, validateBillingField } from "../../utils/Validation";

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

const BillingComponent = ({
  data, setData, sameAsShipping, setSameAsShipping, errors, setErrors, touched, setTouched
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (touched[name]) setErrors({ ...errors, [name]: validateBillingField(name, value, data) });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateBillingField(name, value, data) });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6">
      <div className="flex items-center justify-between mb-12">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 pb-2 border-b border-gray-100">
          Billing Information
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-gray-100 rounded-full peer peer-checked:bg-[#C19A6B] transition-all duration-500"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 peer-checked:translate-x-4"></div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">
            Same as shipping
          </span>
        </label>
      </div>

      {!sameAsShipping && (
        <div className="space-y-20 p-12 bg-gray-50/50 rounded-3xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <InputField label="First Name" name="firstName" value={data.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="Given Name" error={errors.firstName} />
            <InputField label="Last Name" name="lastName" value={data.lastName} onChange={handleChange} onBlur={handleBlur} placeholder="Surname" error={errors.lastName} />
            <div className="md:col-span-2">
              <InputField label="Billing Address" name="address" value={data.address} onChange={handleChange} onBlur={handleBlur} placeholder="Full physical address" error={errors.address} />
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
        </div>
      )}
    </div>
  );
};

export default BillingComponent;