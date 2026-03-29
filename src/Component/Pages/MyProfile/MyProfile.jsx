import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaLock,
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaUserCircle,
  FaCamera,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import userApi from "../../../apis/user/userApi";
import { INDIAN_STATES } from "../../utils/Validation";

const MyProfile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("tab") || "overview";

  const setActiveSection = (sectionId) => {
    setSearchParams({ tab: sectionId });
  };

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempData, setTempData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressData, setAddressData] = useState({
    type: "home",
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [addressPage, setAddressPage] = useState(1);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedAddresses, setPaginatedAddresses] = useState([]);
  const ADDRESSES_PER_PAGE = 4;

  // Helper to get initials
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  // Fetch paginated addresses
  const fetchPaginatedAddresses = async (page) => {
    try {
      const response = await userApi.getAddresses(page, ADDRESSES_PER_PAGE);
      if (response.status === "success") {
        setPaginatedAddresses(response.data.addresses);
        setTotalAddresses(response.total);
        setTotalPages(response.totalPages);

        // If current page is empty and we're not on page 1, go to previous page
        if (response.data.addresses.length === 0 && page > 1) {
          setAddressPage(page - 1);
        }
      }
    } catch (error) {
      console.error("Error fetching paginated addresses:", error);
    }
  };

  useEffect(() => {
    if (activeSection === "addresses") {
      fetchPaginatedAddresses(addressPage);
    }
  }, [activeSection, addressPage]);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userApi.isAuthenticated()) {
        toast.error("Please login to view your profile");
        navigate("/login");
        return;
      }

      setLoading(true);

      try {
        const response = await userApi.getCurrentUser();

        if (response.status === "success" && response.data) {
          const user = response.data.user || response.data;
          const defaultAddress =
            user.addresses?.find((addr) => addr.isDefault) ||
            user.addresses?.[0];

          setUserData({
            id: user._id || user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
            email: user.email || "",
            phone: user.phone || "",
            address: defaultAddress
              ? `${defaultAddress.addressLine1 || ""}, ${defaultAddress.city || ""}, ${defaultAddress.state || ""} - ${defaultAddress.pincode || ""}`
              : "No address saved",
            dob: user.dateOfBirth || "",
            joinDate: user.createdAt || new Date().toISOString(),
            gender: user.gender || "prefer_not_to_say",
            profileImage: user.profileImage || null,
            isEmailVerified: user.isEmailVerified || false,
            addresses: user.addresses || [],
          });
        } else {
          const storedUser = userApi.getStoredUser();
          if (storedUser) {
            setUserData({
              id: storedUser._id || storedUser.id,
              firstName: storedUser.firstName || "",
              lastName: storedUser.lastName || "",
              name:
                `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim() ||
                "User",
              email: storedUser.email || "",
              phone: storedUser.phone || "",
              address: "No address saved",
              dob: storedUser.dateOfBirth || "",
              joinDate: storedUser.createdAt || new Date().toISOString(),
              gender: storedUser.gender || "prefer_not_to_say",
              profileImage: storedUser.profileImage || null,
              isEmailVerified: storedUser.isEmailVerified || false,
              addresses: storedUser.addresses || [],
            });
          } else {
            toast.error("Failed to load profile data");
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditClick = () => {
    if (!userData) return;
    setTempData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dob: userData.dob,
      gender: userData.gender,
    });
    setShowEditModal(true);
  };

  const handleSaveClick = async () => {
    if (!tempData.firstName || !tempData.lastName) {
      toast.error("First name and last name are required");
      return;
    }

    setSaving(true);

    try {
      // Clean phone number (remove non-digits)
      const cleanPhone = (tempData.phone || "").replace(/\D/g, "");

      const updateData = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        phone: cleanPhone,
        gender:
          tempData.gender === "Prefer not to say"
            ? "prefer_not_to_say"
            : tempData.gender,
        dateOfBirth: tempData.dob || undefined,
      };

      const response = await userApi.updateProfile(updateData);

      if (response.status === "success") {
        const updatedUser = response.data.user || response.data;
        setUserData((prev) => ({
          ...prev,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
          phone: updatedUser.phone,
          dob: updatedUser.dateOfBirth,
          gender: updatedUser.gender,
        }));
        setShowEditModal(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({
      ...tempData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: "",
      });
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePassword()) return;

    setSaving(true);

    try {
      const response = await userApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.status === "success") {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({
          current: false,
          new: false,
          confirm: false,
        });
        toast.success("Password updated successfully!");
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData({
      ...addressData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field when user types
    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddAddressClick = () => {
    setEditingAddressId(null);
    setAddressData({
      type: "home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    });
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const handleEditAddressClick = (address) => {
    setEditingAddressId(address._id);
    setAddressData({
      type: address.type || "home",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      isDefault: address.isDefault || false,
    });
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const refreshUserData = async () => {
    try {
      const response = await userApi.getCurrentUser();
      if (response.status === "success" && response.data) {
        const user = response.data.user || response.data;
        const defaultAddress =
          user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0];

        setUserData((prev) => ({
          ...prev,
          addresses: user.addresses || [],
          address: defaultAddress
            ? `${defaultAddress.addressLine1 || ""}, ${defaultAddress.city || ""}`
            : "No address saved",
        }));

        // Also refresh paginated addresses
        fetchPaginatedAddresses(addressPage);
      }
    } catch (error) {
      console.error("Failed to refresh user data", error);
    }
  };

  // Helper to parse error message and map to field
  const parseAddressError = (errorMessage) => {
    const errors = {};
    const msg = errorMessage.toLowerCase();

    if (msg.includes("pincode")) {
      errors.pincode = errorMessage;
    } else if (
      msg.includes("address") &&
      (msg.includes("line 1") || msg.includes("addressline1"))
    ) {
      errors.addressLine1 = errorMessage;
    } else if (msg.includes("city")) {
      errors.city = errorMessage;
    } else if (msg.includes("state")) {
      errors.state = errorMessage;
    } else if (msg.includes("phone")) {
      errors.phone = errorMessage;
    } else {
      // Generic error - show as toast
      return null;
    }
    return errors;
  };

  const handleAddressSubmit = async () => {
    // Clear previous errors
    setAddressErrors({});

    // Client-side validation
    const newErrors = {};
    if (!addressData.name) newErrors.name = "Name is required";
    if (!addressData.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(addressData.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone must be 10 digits";

    if (!addressData.addressLine1) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }
    if (!addressData.city) {
      newErrors.city = "City is required";
    }
    if (!addressData.state) {
      newErrors.state = "State is required";
    }
    if (!addressData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[1-9][0-9]{5}$/.test(addressData.pincode)) {
      newErrors.pincode = "Please provide a valid 6-digit Indian pincode";
    }

    if (Object.keys(newErrors).length > 0) {
      setAddressErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setSaving(true);
    try {
      // Clean phone
      const submissionData = {
        ...addressData,
        phone: addressData.phone.replace(/\D/g, ""),
      };

      let response;
      if (editingAddressId) {
        response = await userApi.updateAddress(
          editingAddressId,
          submissionData,
        );
      } else {
        response = await userApi.addAddress(submissionData);
      }

      if (response.status === "success") {
        toast.success(
          editingAddressId
            ? "Address updated successfully"
            : "Address added successfully",
        );
        setShowAddressModal(false);
        refreshUserData();
      } else {
        // Try to parse field-specific errors
        const fieldErrors = parseAddressError(response.message || "");
        if (fieldErrors) {
          setAddressErrors(fieldErrors);
        } else {
          toast.error(response.message || "Failed to save address");
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      // Try to parse field-specific errors from error message
      const fieldErrors = parseAddressError(error.message || "");
      if (fieldErrors) {
        setAddressErrors(fieldErrors);
      } else {
        toast.error(error.message || "Failed to save address");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      await userApi.deleteAddress(addressId);
      toast.success("Address deleted successfully");
      refreshUserData();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await userApi.setDefaultAddress(addressId);
      if (response.status === "success") {
        toast.success("Default address updated");
        refreshUserData();
      } else {
        toast.error(response.message || "Failed to update default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[#C19A6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-xs w-full text-center">
          <FaUserCircle className="text-5xl text-neutral-200 mx-auto mb-5" />
          <h2 className="text-lg font-light text-neutral-800 mb-1">Access Required</h2>
          <p className="text-neutral-400 text-sm mb-6">
            Please sign in to access your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 bg-[#C19A6B] text-white text-sm rounded-lg hover:bg-[#a6825a] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Personal Info" },
    { id: "personal", label: "Edit Profile" },
    { id: "addresses", label: "Addresses" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-800 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">My Profile</h1>
          <div className="w-12 h-0.5 bg-[#C19A6B] mt-2"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-neutral-100 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-[#C19A6B] flex items-center justify-center bg-[#C19A6B]/5 overflow-hidden">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-medium text-[#C19A6B]">
                    {getInitials(userData.firstName, userData.lastName)}
                  </span>
                )}
              </div>
              <button
                onClick={handleEditClick}
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#C19A6B] text-white rounded-full hover:bg-[#a6825a] transition-colors"
              >
                <FaCamera size={10} />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-light text-neutral-900">{userData.name}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                <span className="text-sm text-neutral-400">{userData.email}</span>
                {userData.phone && (
                  <span className="text-sm text-neutral-400">{userData.phone}</span>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                <span className="text-xs text-neutral-300">Member since {formatDate(userData.joinDate)}</span>
                {userData.isEmailVerified && (
                  <span className="text-xs text-emerald-500 flex items-center gap-1">
                    <FaCheckCircle size={10} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-neutral-100 mb-8">
          <nav className="flex gap-8 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`pb-3 text-sm whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? "border-b-2 border-[#C19A6B] text-[#C19A6B]"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}

        {/* Personal Info / Overview */}
        {activeSection === "overview" && (
          <div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: "FULL NAME", value: userData.name },
                { label: "EMAIL ADDRESS", value: userData.email },
                { label: "PHONE NUMBER", value: userData.phone || "Not provided" },
                { label: "DATE OF BIRTH", value: formatDate(userData.dob) },
                {
                  label: "GENDER",
                  value:
                    userData.gender === "prefer_not_to_say"
                      ? "Prefer not to say"
                      : userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1),
                },
                { label: "DEFAULT ADDRESS", value: userData.address },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="text-[10px] font-medium tracking-widest text-[#C19A6B] uppercase block mb-1.5">
                    {item.label}
                  </label>
                  <p className="text-sm text-neutral-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Profile */}
        {activeSection === "personal" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-neutral-900">Profile Information</h2>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-5 py-2 bg-[#C19A6B] text-white text-sm rounded-lg hover:bg-[#a6825a] transition-colors"
              >
                <FaEdit size={12} /> Edit
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
              {[
                { label: "First Name", value: userData.firstName, icon: <FaUser size={13} /> },
                { label: "Last Name", value: userData.lastName, icon: <FaUser size={13} /> },
                { label: "Email", value: userData.email, icon: <FaEnvelope size={13} /> },
                { label: "Phone Number", value: userData.phone || "Not provided", icon: <FaPhone size={13} /> },
                { label: "Date of Birth", value: formatDate(userData.dob), icon: <FaBirthdayCake size={13} /> },
                {
                  label: "Gender",
                  value:
                    userData.gender === "prefer_not_to_say"
                      ? "Prefer not to say"
                      : userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1),
                  icon: <FaCalendarAlt size={13} />,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#C19A6B]">{item.icon}</div>
                  <div>
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-0.5">
                      {item.label}
                    </label>
                    <p className="text-sm text-neutral-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Addresses */}
        {activeSection === "addresses" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-neutral-900">Saved Addresses</h2>
              <button
                onClick={handleAddAddressClick}
                className="flex items-center gap-2 px-5 py-2 bg-[#C19A6B] text-white text-sm rounded-lg hover:bg-[#a6825a] transition-colors"
              >
                <FaPlus size={11} /> Add Address
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {paginatedAddresses && paginatedAddresses.length > 0 ? (
                paginatedAddresses.map((addr, index) => (
                  <div
                    key={addr._id || index}
                    className={`border rounded-lg p-5 transition-colors ${
                      addr.isDefault
                        ? "border-[#C19A6B]/40 bg-[#C19A6B]/[0.02]"
                        : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-medium tracking-widest text-neutral-500 uppercase">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-medium tracking-wider text-[#C19A6B] uppercase bg-[#C19A6B]/10 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-neutral-900 mb-1">
                      {addr.name || userData.name}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {addr.addressLine1}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-50">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditAddressClick(addr)}
                          className="text-neutral-300 hover:text-[#C19A6B] transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-neutral-300 hover:text-red-400 transition-colors"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr._id)}
                          className="text-xs text-neutral-400 hover:text-[#C19A6B] transition-colors"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 py-16 border border-dashed border-neutral-200 rounded-lg flex flex-col items-center text-center">
                  <FaMapMarkerAlt className="text-2xl text-neutral-200 mb-3" />
                  <p className="text-sm text-neutral-400 mb-4">No addresses saved yet</p>
                  <button
                    onClick={handleAddAddressClick}
                    className="px-6 py-2 bg-[#C19A6B] text-white text-sm rounded-lg hover:bg-[#a6825a] transition-colors"
                  >
                    Add New Address
                  </button>
                </div>
              )}
            </div>

            {totalAddresses > ADDRESSES_PER_PAGE && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  disabled={addressPage === 1}
                  onClick={() => setAddressPage((prev) => prev - 1)}
                  className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
                    addressPage === 1
                      ? "text-neutral-200 border-neutral-100 cursor-not-allowed"
                      : "text-neutral-500 border-neutral-200 hover:border-[#C19A6B] hover:text-[#C19A6B]"
                  }`}
                >
                  Previous
                </button>
                <span className="text-xs text-neutral-400">
                  {addressPage} / {totalPages}
                </span>
                <button
                  disabled={addressPage === totalPages}
                  onClick={() => setAddressPage((prev) => prev + 1)}
                  className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
                    addressPage ===
                    Math.ceil(
                      userData.addresses.length / ADDRESSES_PER_PAGE,
                    )
                      ? "text-neutral-200 border-neutral-100 cursor-not-allowed"
                      : "text-neutral-500 border-neutral-200 hover:border-[#C19A6B] hover:text-[#C19A6B]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security */}
        {activeSection === "security" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-light text-neutral-900 mb-1">Password & Security</h2>
            <p className="text-sm text-neutral-400 mb-6">Manage your account security settings.</p>

            <div className="border border-neutral-100 rounded-lg divide-y divide-neutral-50">
              <div className="flex items-center justify-between p-5">
                <div>
                  <label className="text-[10px] font-medium tracking-widest text-[#C19A6B] uppercase block mb-1">
                    Account Password
                  </label>
                  <p className="text-sm text-neutral-400">
                    Update your password to keep your account secure.
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-5 py-2 border border-[#C19A6B] text-[#C19A6B] text-sm rounded-lg hover:bg-[#C19A6B] hover:text-white transition-colors whitespace-nowrap ml-4"
                >
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <label className="text-[10px] font-medium tracking-widest text-[#C19A6B] uppercase block mb-1">
                    Account Status
                  </label>
                  <p className="text-sm text-neutral-400">
                    Your account is securely logged in.
                  </p>
                </div>
                <span className="text-xs text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                userApi.logout();
                navigate("/login");
              }}
              className="mt-8 px-5 py-2 border border-neutral-200 text-neutral-400 text-sm rounded-lg hover:border-red-300 hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-lg border border-neutral-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-light text-neutral-900">Edit Profile</h2>
                <button
                  onClick={handleCancelClick}
                  className="text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "First Name", name: "firstName", value: tempData.firstName },
                  { label: "Last Name", name: "lastName", value: tempData.lastName },
                  { label: "Email Address", name: "email", value: tempData.email, disabled: true },
                  { label: "Phone Number", name: "phone", value: tempData.phone, type: "tel" },
                  {
                    label: "Date of Birth",
                    name: "dob",
                    value: tempData.dob ? tempData.dob.split("T")[0] : "",
                    type: "date",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={field.value}
                      onChange={handleInputChange}
                      disabled={field.disabled}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
                        field.disabled
                          ? "bg-neutral-50 text-neutral-300 cursor-not-allowed"
                          : "border-neutral-200 text-neutral-800 focus:border-[#C19A6B]"
                      }`}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={tempData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C19A6B] transition-colors appearance-none cursor-pointer bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelClick}
                  className="flex-1 py-2.5 border border-neutral-200 text-neutral-500 rounded-lg text-sm hover:border-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  disabled={saving}
                  className="flex-[2] py-2.5 bg-[#C19A6B] text-white rounded-lg text-sm hover:bg-[#a6825a] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-sm border border-neutral-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-light text-neutral-900">Change Password</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { id: "currentPassword", key: "current", label: "CURRENT PASSWORD" },
                  { id: "newPassword", key: "new", label: "NEW PASSWORD" },
                  { id: "confirmPassword", key: "confirm", label: "CONFIRM PASSWORD" },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords[field.key] ? "text" : "password"}
                        name={field.id}
                        value={passwordData[field.id]}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm outline-none transition-colors ${
                          passwordErrors[field.id]
                            ? "border-red-300"
                            : "border-neutral-200 focus:border-[#C19A6B]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field.key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-[#C19A6B] transition-colors"
                      >
                        {showPasswords[field.key] ? (
                          <FaEyeSlash size={14} />
                        ) : (
                          <FaEye size={14} />
                        )}
                      </button>
                    </div>
                    {passwordErrors[field.id] && (
                      <p className="text-red-400 text-xs mt-1">
                        {passwordErrors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 border border-neutral-200 text-neutral-500 rounded-lg text-sm hover:border-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={saving}
                  className="flex-[2] py-2.5 bg-[#C19A6B] text-white rounded-lg text-sm hover:bg-[#a6825a] transition-colors disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-2xl border border-neutral-100">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-light text-neutral-900">
                  {editingAddressId ? "Edit Address" : "Add Address"}
                </h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      Address Type
                    </label>
                    <select
                      name="type"
                      value={addressData.type}
                      onChange={handleAddressChange}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C19A6B] transition-colors appearance-none cursor-pointer bg-white"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addressData.name}
                      onChange={handleAddressChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${addressErrors.name ? "border-red-300" : "border-neutral-200 focus:border-[#C19A6B]"}`}
                      required
                    />
                    {addressErrors.name && (
                      <p className="text-red-400 text-xs mt-1">{addressErrors.name}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      maxLength={10}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${addressErrors.phone ? "border-red-300" : "border-neutral-200 focus:border-[#C19A6B]"}`}
                      required
                    />
                    {addressErrors.phone && (
                      <p className="text-red-400 text-xs mt-1">{addressErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      maxLength={6}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${addressErrors.pincode ? "border-red-300" : "border-neutral-200 focus:border-[#C19A6B]"}`}
                      required
                    />
                    {addressErrors.pincode && (
                      <p className="text-red-400 text-xs mt-1">{addressErrors.pincode}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={addressData.addressLine1}
                      onChange={handleAddressChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${addressErrors.addressLine1 ? "border-red-300" : "border-neutral-200 focus:border-[#C19A6B]"}`}
                      required
                    />
                    {addressErrors.addressLine1 && (
                      <p className="text-red-400 text-xs mt-1">{addressErrors.addressLine1}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={addressData.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#C19A6B] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${addressErrors.city ? "border-red-300" : "border-neutral-200 focus:border-[#C19A6B]"}`}
                      required
                    />
                    {addressErrors.city && (
                      <p className="text-red-400 text-xs mt-1">{addressErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase block mb-1.5">
                      State *
                    </label>
                    <select
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors appearance-none cursor-pointer bg-white ${addressErrors.state ? "border-red-300" : "border-neutral-200 focus:border-[#C19A6B]"}`}
                      required
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {addressErrors.state && (
                      <p className="text-red-400 text-xs mt-1">{addressErrors.state}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 px-4 border border-neutral-100 rounded-lg">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressData.isDefault}
                    onChange={handleAddressChange}
                    className="w-4 h-4 rounded border-neutral-300 text-[#C19A6B] focus:ring-[#C19A6B] cursor-pointer"
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-sm text-neutral-500 cursor-pointer"
                  >
                    Set as default address
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-2.5 border border-neutral-200 text-neutral-500 rounded-lg text-sm hover:border-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddressSubmit}
                    disabled={saving}
                    className="flex-[2] py-2.5 bg-[#C19A6B] text-white rounded-lg text-sm hover:bg-[#a6825a] transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
