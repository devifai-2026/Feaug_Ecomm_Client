import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaChevronRight,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaUserCircle,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import userApi from "../../../apis/user/userApi";
import { INDIAN_STATES } from "../../utils/Validation";

const MyProfile = () => {
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempData, setTempData] = useState({});
  const [activeSection, setActiveSection] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressData, setAddressData] = useState({
    type: "home",
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
  const [passwordErrors, setPasswordErrors] = useState({});

  // Helper to get initials
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

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
      const updateData = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        phone: tempData.phone,
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
      toast.error("Failed to update profile");
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

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData({
      ...addressData,
      [name]: type === "checkbox" ? checked : value,
    });
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
      }
    } catch (error) {
      console.error("Failed to refresh user data", error);
    }
  };

  const handleAddressSubmit = async () => {
    if (
      !addressData.addressLine1 ||
      !addressData.city ||
      !addressData.state ||
      !addressData.pincode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      let response;
      if (editingAddressId) {
        response = await userApi.updateAddress(editingAddressId, addressData);
      } else {
        response = await userApi.addAddress(addressData);
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
        toast.error(response.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
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
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#C19A6B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 text-center">
        <div className="max-w-sm bg-white rounded-2xl p-8 shadow-lg border border-neutral-100">
          <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserCircle className="text-4xl text-neutral-300" />
          </div>
          <h2 className="text-xl font-kalnia text-neutral-800 mb-2">
            Access Required
          </h2>
          <p className="text-neutral-500 mb-6 font-inter text-sm leading-relaxed">
            Please sign in to access your profile settings.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-[#C19A6B] hover:bg-[#a6825a] text-white rounded-xl font-bold transition-all text-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Dashboard", icon: <FaUserCircle /> },
    { id: "personal", label: "Registry", icon: <FaUser /> },
    { id: "addresses", label: "Points", icon: <FaMapMarkedAlt /> },
    { id: "security", label: "Vault", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-800 selection:bg-[#C19A6B]/20 pt-20 pb-12">
      {/* Premium Compact Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-white border border-neutral-100 shadow-[0_10px_30px_rgba(193,154,107,0.06)] p-6 sm:p-8">
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="group relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shadow-inner overflow-hidden">
                <span className="text-2xl sm:text-3xl font-kalnia font-bold text-[#C19A6B]">
                  {getInitials(userData.firstName, userData.lastName)}
                </span>
              </div>
              <button
                onClick={handleEditClick}
                className="absolute -bottom-1 -right-1 p-2 bg-[#C19A6B] text-white rounded-full shadow-md hover:scale-110 active:scale-90 transition-all"
              >
                <FaCamera size={10} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-[#C19A6B]/10 rounded-full text-[9px] font-bold text-[#C19A6B] uppercase tracking-[0.2em] mb-2">
                Member
              </div>
              <h1 className="text-2xl sm:text-3xl font-kalnia font-bold text-neutral-900 mb-1 tracking-tight">
                {userData.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-neutral-500 font-inter text-xs">
                <span>Since {formatDate(userData.joinDate)}</span>
                {userData.isEmailVerified && (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold uppercase tracking-tighter">
                    <FaCheckCircle size={8} /> Verified
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-kalnia font-bold text-neutral-900">
                  {userData.addresses.length}
                </p>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                  Points
                </p>
              </div>
              <div className="w-px h-8 bg-neutral-100 self-center"></div>
              <div className="text-center">
                <p className="text-2xl font-kalnia font-bold text-neutral-900">
                  Elite
                </p>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                  Status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Compact Sidebar */}
          <div className="lg:col-span-3 space-y-2 sticky top-28">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.25rem] transition-all duration-300 border ${
                  activeSection === section.id
                    ? "bg-[#C19A6B] text-white shadow-lg border-transparent translate-x-1"
                    : "bg-white text-neutral-400 border-neutral-100 hover:border-[#C19A6B]/40 hover:text-neutral-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-bold tracking-wide font-inter text-xs uppercase">
                    {section.label}
                  </span>
                </div>
                {activeSection === section.id && <FaChevronRight size={10} />}
              </button>
            ))}

            <button
              onClick={() => {
                userApi.logout();
                navigate("/login");
              }}
              className="w-full flex items-center justify-between px-5 py-4 rounded-[1.25rem] bg-neutral-50 text-neutral-400 border border-neutral-100 hover:text-red-500 transition-all mt-6"
            >
              <div className="flex items-center gap-4">
                <FaTimes size={14} />
                <span className="font-bold font-inter text-xs uppercase">
                  Sign Out
                </span>
              </div>
            </button>
          </div>

          {/* Compact Canvas */}
          <div className="lg:col-span-9">
            <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
              {/* Dashboard Section */}
              {activeSection === "overview" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div>
                    <h2 className="text-2xl font-kalnia font-bold text-neutral-900 mb-1">
                      Perspective
                    </h2>
                    <p className="text-neutral-400 font-inter text-xs">
                      Brief view of your registry components.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="group">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#C19A6B] font-black mb-2 block">
                          Name
                        </label>
                        <div className="p-5 bg-neutral-50 rounded-[1.5rem] border border-neutral-50">
                          <p className="text-base text-neutral-900 font-kalnia font-bold">
                            {userData.name}
                          </p>
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#C19A6B] font-black mb-2 block">
                          Identity
                        </label>
                        <div className="p-5 bg-neutral-50 rounded-[1.5rem] border border-neutral-50">
                          <p className="text-sm text-neutral-900 font-inter">
                            {userData.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="group">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#C19A6B] font-black mb-2 block">
                          Secure Tel
                        </label>
                        <div className="p-5 bg-neutral-50 rounded-[1.5rem] border border-neutral-50">
                          <p className="text-base text-neutral-900 font-inter">
                            {userData.phone || "Private"}
                          </p>
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#C19A6B] font-black mb-2 block">
                          Root Coord
                        </label>
                        <div className="p-5 bg-neutral-50 rounded-[1.5rem] border border-neutral-50">
                          <p className="text-neutral-500 text-xs italic font-inter line-clamp-1">
                            {userData.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-neutral-900 rounded-[2rem] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-kalnia font-bold mb-1 italic">
                        Exclusive Alerts
                      </h3>
                      <p className="text-neutral-400 text-[10px] font-inter uppercase">
                        Tailored releases directed to you.
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-[#C19A6B] text-white rounded-xl font-bold text-xs">
                      Configure
                    </button>
                  </div>
                </div>
              )}

              {/* Registry Section */}
              {activeSection === "personal" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
                    <h2 className="text-2xl font-kalnia font-bold text-neutral-900">
                      Registry
                    </h2>
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-6 py-3 bg-[#C19A6B] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#C19A6B]/20"
                    >
                      <FaEdit size={12} /> Refine
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      {
                        label: "Given Name",
                        value: userData.firstName,
                        icon: <FaUser />,
                      },
                      {
                        label: "Surname",
                        value: userData.lastName,
                        icon: <FaUser />,
                      },
                      {
                        label: "Digital Mail",
                        value: userData.email,
                        icon: <FaEnvelope />,
                      },
                      {
                        label: "Secure Link",
                        value: userData.phone || "Private",
                        icon: <FaPhone />,
                      },
                      {
                        label: "Day of Inception",
                        value: formatDate(userData.dob),
                        icon: <FaBirthdayCake />,
                      },
                      {
                        label: "Spectrum",
                        value:
                          userData.gender === "prefer_not_to_say"
                            ? "Restricted"
                            : userData.gender.charAt(0).toUpperCase() +
                              userData.gender.slice(1),
                        icon: <FaCalendarAlt />,
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-5 group">
                        <div className="p-4 bg-neutral-50 rounded-xl text-[#C19A6B] border border-neutral-50 group-hover:bg-[#C19A6B] group-hover:text-white transition-all duration-300">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-black mb-1">
                            {item.label}
                          </p>
                          <p className="text-neutral-900 font-kalnia font-bold text-lg">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinates Section */}
              {activeSection === "addresses" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-100 pb-8">
                    <h2 className="text-2xl font-kalnia font-bold text-neutral-900">
                      Coordinates
                    </h2>
                    <button
                      onClick={handleAddAddressClick}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 border border-neutral-200 rounded-xl font-bold text-xs hover:border-[#C19A6B] transition-all"
                    >
                      <FaPlus size={12} /> Map Point
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {userData.addresses && userData.addresses.length > 0 ? (
                      userData.addresses.map((addr, index) => (
                        <div
                          key={addr._id || index}
                          className={`relative p-8 rounded-[2rem] border transition-all duration-300 ${
                            addr.isDefault
                              ? "bg-white border-[#C19A6B]/30 shadow-md"
                              : "bg-neutral-50 border-neutral-50 hover:bg-white hover:border-neutral-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <span className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <div className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                                Primary
                              </div>
                            )}
                          </div>

                          <h3 className="text-xl font-kalnia font-bold text-neutral-900 mb-1">
                            {addr.name || userData.name}
                          </h3>
                          <p className="text-neutral-500 text-xs leading-relaxed mb-6 font-inter">
                            {addr.addressLine1}
                            <span className="block mt-1 font-bold">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </span>
                          </p>

                          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleEditAddressClick(addr)}
                                className="text-neutral-300 hover:text-[#C19A6B] transition-colors"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr._id)}
                                className="text-neutral-300 hover:text-red-400 transition-colors"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                            {!addr.isDefault && (
                              <button
                                onClick={() =>
                                  handleSetDefaultAddress(addr._id)
                                }
                                className="text-[9px] font-black text-neutral-300 hover:text-[#C19A6B] uppercase tracking-widest transition-colors"
                              >
                                Set Primary
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-2 py-16 bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-100 flex flex-col items-center justify-center text-center px-10">
                        <h3 className="text-lg font-kalnia font-bold text-neutral-800 mb-2">
                          No points mapped
                        </h3>
                        <button
                          onClick={handleAddAddressClick}
                          className="px-8 py-4 bg-[#C19A6B] text-white font-bold rounded-xl shadow-lg text-xs"
                        >
                          Establish Point
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vault Section */}
              {activeSection === "security" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-50">
                      <FaShieldAlt size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-kalnia font-bold text-neutral-900">
                        Vault
                      </h2>
                      <p className="text-neutral-400 font-inter text-xs">
                        Protection status management.
                      </p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-[2rem] p-8 border border-neutral-50 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-[9px] uppercase tracking-[0.2em] font-black text-[#C19A6B] mb-1">
                          Secret Key
                        </h3>
                        <p className="text-neutral-500 text-[10px]">
                          Rotation recommended monthly.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl transition-all font-bold text-xs"
                      >
                        Refine Secret
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
                      <div>
                        <h3 className="text-[9px] uppercase tracking-[0.2em] font-black text-[#C19A6B] mb-1">
                          Status
                        </h3>
                        <p className="text-neutral-500 text-[10px]">
                          Active authenticated session.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT MODALS */}

      {/* Refine Persona Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-white/40 animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg border border-neutral-100 overflow-hidden transform animate-in zoom-in-95 duration-500">
            <div className="p-10 sm:p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-kalnia font-bold text-neutral-900 tracking-tight italic">
                  Refine Persona
                </h2>
                <button
                  onClick={handleCancelClick}
                  className="p-3 bg-neutral-50 text-neutral-400 rounded-full border border-neutral-100"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    label: "Nom",
                    name: "firstName",
                    value: tempData.firstName,
                  },
                  {
                    label: "Prénom",
                    name: "lastName",
                    value: tempData.lastName,
                  },
                  {
                    label: "Signature",
                    name: "email",
                    value: tempData.email,
                    disabled: true,
                  },
                  {
                    label: "Link",
                    name: "phone",
                    value: tempData.phone,
                    type: "tel",
                  },
                  {
                    label: "Inception",
                    name: "dob",
                    value: tempData.dob ? tempData.dob.split("T")[0] : "",
                    type: "date",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] block mb-2 ml-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={field.value}
                      onChange={handleInputChange}
                      disabled={field.disabled}
                      className={`w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none transition-all font-inter text-xs ${
                        field.disabled
                          ? "text-neutral-300 cursor-not-allowed opacity-60"
                          : "text-neutral-800 border-2 border-transparent focus:border-[#C19A6B]/20 focus:bg-white"
                      }`}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] block mb-2 ml-1">
                    Spectrum
                  </label>
                  <select
                    name="gender"
                    value={tempData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none transition-all font-inter text-xs text-neutral-800 border-2 border-transparent focus:border-[#C19A6B]/20 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Restricted</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCancelClick}
                  className="flex-1 py-4 bg-neutral-50 text-neutral-500 rounded-2xl font-bold text-xs"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveClick}
                  disabled={saving}
                  className="flex-[2] py-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-[#C19A6B] transition-all disabled:opacity-50"
                >
                  {saving ? "..." : "Commit Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secret Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 backdrop-blur-md bg-white/40 animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-neutral-100 animate-in zoom-in-95 duration-500">
            <div className="p-10">
              <h2 className="text-2xl font-kalnia font-bold text-neutral-900 mb-8 italic">
                Alter Secret
              </h2>
              <div className="space-y-6 mb-8">
                {["currentPassword", "newPassword", "confirmPassword"].map(
                  (pwField) => (
                    <div key={pwField}>
                      <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] block mb-2">
                        {pwField}
                      </label>
                      <input
                        type="password"
                        name={pwField}
                        value={passwordData[pwField]}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className={`w-full bg-neutral-50 border-2 rounded-2xl px-6 py-4 outline-none text-xs ${
                          passwordErrors[pwField]
                            ? "border-red-200"
                            : "border-transparent focus:border-[#C19A6B]/20 focus:bg-white"
                        }`}
                      />
                      {passwordErrors[pwField] && (
                        <p className="text-red-400 text-[8px] font-black mt-2 ml-1 uppercase tracking-tighter">
                          {passwordErrors[pwField]}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
              <button
                onClick={handlePasswordSubmit}
                disabled={saving}
                className="w-full py-5 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-[#C19A6B] transition-all"
              >
                Commit Secret
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coordinate Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 backdrop-blur-md bg-white/40 animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl border border-neutral-100 transform animate-in zoom-in-95 duration-500">
            <div className="p-10 sm:p-12 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-kalnia font-bold text-neutral-900 italic">
                  Manage Point
                </h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-3 bg-neutral-50 text-neutral-400 rounded-full border border-neutral-100"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] mb-2 block">
                      Environment
                    </label>
                    <select
                      name="type"
                      value={addressData.type}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none text-xs appearance-none cursor-pointer"
                    >
                      <option value="home">Sanctum (Home)</option>
                      <option value="work">Business (Work)</option>
                      <option value="other">Nomad (Other)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] mb-2 block">
                      Postal Unit *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none text-xs font-inter"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] mb-2 block">
                      Principal Axis *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={addressData.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none text-xs font-inter"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] mb-2 block">
                      Supplemental Axis
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={addressData.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none text-xs font-inter italic"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] mb-2 block">
                      Metro / Sector *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none text-xs font-inter"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-[#C19A6B] uppercase tracking-[0.2em] mb-2 block">
                      Domain / Territory *
                    </label>
                    <select
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-2xl px-6 py-4 outline-none text-xs appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Domain</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-4 px-6 bg-neutral-50 border border-neutral-50 rounded-2xl group hover:bg-white transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressData.isDefault}
                    onChange={handleAddressChange}
                    className="w-5 h-5 rounded-lg border-2 border-[#C19A6B]/20 text-[#C19A6B] cursor-pointer"
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-[9px] font-black text-neutral-500 uppercase tracking-widest cursor-pointer flex-1"
                  >
                    Designate Primary Node
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-4 bg-neutral-50 text-neutral-400 rounded-2xl font-bold text-xs"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleAddressSubmit}
                    disabled={saving}
                    className="flex-[2] py-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-[#C19A6B] transition-all"
                  >
                    Secure Coordinate
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
