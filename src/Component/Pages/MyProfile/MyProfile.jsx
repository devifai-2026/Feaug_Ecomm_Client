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
  FaChevronRight,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaUserCircle,
  FaCamera,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
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
        response = await userApi.updateAddress(editingAddressId, submissionData);
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
          <h2 className="text-xl  text-neutral-800 mb-2">Access Required</h2>
          <p className="text-neutral-500 mb-6 font-poppins text-sm leading-relaxed">
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
    { id: "overview", label: "Overview", icon: <FaUserCircle /> },
    { id: "personal", label: "Profile", icon: <FaUser /> },
    { id: "addresses", label: "Addresses", icon: <FaMapMarkedAlt /> },
    { id: "security", label: "Password", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-800 selection:bg-[#C19A6B]/20 pt-20 pb-12">
      {/* Premium Compact Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-neutral-100 shadow-sm p-5 sm:p-6">
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="group relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shadow-inner overflow-hidden">
                <span className="text-xl sm:text-2xl  font-bold text-[#C19A6B]">
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
              <div className="inline-block px-3 py-1 bg-[#C19A6B]/10 rounded-full text-xs font-bold text-[#C19A6B] mb-2">
                Member
              </div>
              <h1 className="text-2xl sm:text-3xl  font-bold text-neutral-900 mb-1 tracking-tight">
                {userData.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-neutral-500 font-poppins text-xs">
                <span>Since {formatDate(userData.joinDate)}</span>
                {userData.isEmailVerified && (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <FaCheckCircle size={10} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Compact Sidebar */}
          <div className="lg:col-span-3 space-y-2 sticky top-28">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 border ${activeSection === section.id
                  ? "bg-[#C19A6B] text-white shadow-md border-transparent translate-x-1"
                  : "bg-white text-neutral-400 border-neutral-100 hover:border-[#C19A6B]/40 hover:text-neutral-700"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-semibold font-poppins text-sm">
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
                <span className="font-bold font-poppins text-[11px] uppercase">
                  Sign Out
                </span>
              </div>
            </button>
          </div>

          {/* Compact Canvas */}
          <div className="lg:col-span-9">
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              {/* Dashboard Section */}
              {activeSection === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl  font-bold text-neutral-900 mb-1">
                      My Profile
                    </h2>
                    <p className="text-neutral-500 font-poppins text-sm">
                      View and manage your account details.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="group">
                        <label className="text-xs font-semibold text-[#C19A6B] mb-1 block">
                          Full Name
                        </label>
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-50">
                          <p className="text-base text-neutral-900  font-bold">
                            {userData.name}
                          </p>
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-xs font-semibold text-[#C19A6B] mb-1 block">
                          Email Address
                        </label>
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-50">
                          <p className="text-sm text-neutral-900 font-poppins">
                            {userData.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="group">
                        <label className="text-xs font-semibold text-[#C19A6B] mb-1 block">
                          Phone Number
                        </label>
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-50">
                          <p className="text-base text-neutral-900 font-poppins">
                            {userData.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-xs font-semibold text-[#C19A6B] mb-1 block">
                          Default Address
                        </label>
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-50">
                          <p className="text-neutral-500 text-xs font-poppins line-clamp-1">
                            {userData.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Registry Section */}
              {activeSection === "personal" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
                    <h2 className="text-2xl  font-bold text-neutral-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-6 py-3 bg-[#C19A6B] text-white rounded-xl font-bold text-xs"
                    >
                      <FaEdit size={12} /> Edit Profile
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      {
                        label: "First Name",
                        value: userData.firstName,
                        icon: <FaUser />,
                      },
                      {
                        label: "Last Name",
                        value: userData.lastName,
                        icon: <FaUser />,
                      },
                      {
                        label: "Email",
                        value: userData.email,
                        icon: <FaEnvelope />,
                      },
                      {
                        label: "Phone Number",
                        value: userData.phone || "Not provided",
                        icon: <FaPhone />,
                      },
                      {
                        label: "Date of Birth",
                        value: formatDate(userData.dob),
                        icon: <FaBirthdayCake />,
                      },
                      {
                        label: "Gender",
                        value:
                          userData.gender === "prefer_not_to_say"
                            ? "Prefer not to say"
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
                          <p className="text-xs font-semibold text-neutral-400 mb-1">
                            {item.label}
                          </p>
                          <p className="text-neutral-900  font-bold text-lg">
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
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-100 pb-6">
                    <h2 className="text-2xl  font-bold text-neutral-900">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={handleAddAddressClick}
                      className="flex items-center gap-2 px-6 py-3 bg-[#C19A6B] text-white rounded-xl font-bold text-xs"
                    >
                      <FaPlus size={12} /> Add Address
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {paginatedAddresses && paginatedAddresses.length > 0 ? (
                      paginatedAddresses.map((addr, index) => (
                        <div
                          key={addr._id || index}
                          className={`relative p-6 rounded-3xl border transition-all duration-300 ${addr.isDefault
                            ? "bg-white border-[#C19A6B]/30 shadow-md"
                            : "bg-neutral-50 border-neutral-50 hover:bg-white hover:border-neutral-200"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <span className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase transition-all">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <div className="text-[10px] font-bold text-emerald-600 uppercase">
                                Default
                              </div>
                            )}
                          </div>

                          <h3 className="text-xl  font-bold text-neutral-900 mb-1">
                            {addr.name || userData.name}
                          </h3>
                          <p className="text-neutral-500 text-xs leading-relaxed mb-6 font-poppins">
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
                                className="text-xs font-semibold text-neutral-400 hover:text-[#C19A6B] transition-colors"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-2 py-12 bg-neutral-50 rounded-3xl border border-dashed border-neutral-100 flex flex-col items-center justify-center text-center px-10">
                        <h3 className="text-lg  font-bold text-neutral-800 mb-2">
                          No addresses saved
                        </h3>
                        <button
                          onClick={handleAddAddressClick}
                          className="px-8 py-4 bg-[#C19A6B] text-white font-bold rounded-xl shadow-lg text-xs"
                        >
                          Add New Address
                        </button>
                      </div>
                    )}
                  </div>

                  {totalAddresses > ADDRESSES_PER_PAGE && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <button
                        disabled={addressPage === 1}
                        onClick={() => setAddressPage((prev) => prev - 1)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${addressPage === 1
                          ? "text-neutral-300 border-neutral-100 cursor-not-allowed"
                          : "text-neutral-600 border-neutral-200 hover:border-[#C19A6B] hover:text-[#C19A6B]"
                          }`}
                      >
                        Previous
                      </button>
                      <span className="text-xs font-bold text-neutral-500">
                        Page {addressPage} of {totalPages}
                      </span>
                      <button
                        disabled={addressPage === totalPages}
                        onClick={() => setAddressPage((prev) => prev + 1)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${addressPage ===
                          Math.ceil(
                            userData.addresses.length / ADDRESSES_PER_PAGE,
                          )
                          ? "text-neutral-300 border-neutral-100 cursor-not-allowed"
                          : "text-neutral-600 border-neutral-200 hover:border-[#C19A6B] hover:text-[#C19A6B]"
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
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
                      <h2 className="text-2xl  font-bold text-neutral-900">
                        Password & Security
                      </h2>
                      <p className="text-neutral-500 font-poppins text-sm">
                        Manage your account security settings.
                      </p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-50 space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-[#C19A6B] mb-1">
                          Account Password
                        </h3>
                        <p className="text-neutral-500 text-xs">
                          Update your password to keep your account secure.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl transition-all font-bold text-xs"
                      >
                        Change Password
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
                      <div>
                        <h3 className="text-xs font-semibold text-[#C19A6B] mb-1">
                          Account Status
                        </h3>
                        <p className="text-neutral-500 text-xs">
                          Your account is securely logged in.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-neutral-100 overflow-hidden transform animate-in zoom-in-95 duration-500">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl  font-bold text-neutral-900 tracking-tight">
                  Edit Profile
                </h2>
                <button
                  onClick={handleCancelClick}
                  className="p-3 bg-neutral-50 text-neutral-400 rounded-full border border-neutral-100"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    label: "First Name",
                    name: "firstName",
                    value: tempData.firstName,
                  },
                  {
                    label: "Last Name",
                    name: "lastName",
                    value: tempData.lastName,
                  },
                  {
                    label: "Email Address",
                    name: "email",
                    value: tempData.email,
                    disabled: true,
                  },
                  {
                    label: "Phone Number",
                    name: "phone",
                    value: tempData.phone,
                    type: "tel",
                  },
                  {
                    label: "Date of Birth",
                    name: "dob",
                    value: tempData.dob ? tempData.dob.split("T")[0] : "",
                    type: "date",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-xs font-semibold text-[#C19A6B] block mb-2 ml-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={field.value}
                      onChange={handleInputChange}
                      disabled={field.disabled}
                      className={`w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none transition-all font-poppins text-xs ${field.disabled
                        ? "text-neutral-300 cursor-not-allowed opacity-60"
                        : "text-neutral-800 border-2 border-transparent focus:border-[#C19A6B]/20 focus:bg-white"
                        }`}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-[#C19A6B] block mb-2 ml-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={tempData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none transition-all font-poppins text-xs text-neutral-800 border-2 border-transparent focus:border-[#C19A6B]/20 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCancelClick}
                  className="flex-1 py-3 bg-neutral-50 text-neutral-500 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  disabled={saving}
                  className="flex-[2] py-3 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-[#C19A6B] transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secret Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 backdrop-blur-md bg-white/40 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-neutral-100 animate-in zoom-in-95 duration-500">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-3 bg-neutral-50 text-neutral-400 rounded-full border border-neutral-100"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              <div className="space-y-6 mb-8">
                {[
                  {
                    id: "currentPassword",
                    key: "current",
                    label: "Current Password",
                  },
                  { id: "newPassword", key: "new", label: "New Password" },
                  {
                    id: "confirmPassword",
                    key: "confirm",
                    label: "Confirm Password",
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="text-xs font-semibold text-[#C19A6B] block mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords[field.key] ? "text" : "password"}
                        name={field.id}
                        value={passwordData[field.id]}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className={`w-full bg-neutral-50 border-2 rounded-xl px-5 py-3 pr-12 outline-none text-xs transition-all ${passwordErrors[field.id]
                          ? "border-red-200"
                          : "border-transparent focus:border-[#C19A6B]/20 focus:bg-white"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field.key)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#C19A6B] transition-colors"
                      >
                        {showPasswords[field.key] ? (
                          <FaEyeSlash size={14} />
                        ) : (
                          <FaEye size={14} />
                        )}
                      </button>
                    </div>
                    {passwordErrors[field.id] && (
                      <p className="text-red-400 text-[8px] font-black mt-2 ml-1 uppercase tracking-tighter">
                        {passwordErrors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-4 bg-neutral-50 text-neutral-500 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={saving}
                  className="flex-[2] py-4 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-[#C19A6B] transition-all disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coordinate Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 backdrop-blur-sm bg-white/40 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-neutral-100 transform animate-in zoom-in-95 duration-500">
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl  font-bold text-neutral-900">
                  Address Details
                </h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-3 bg-neutral-50 text-neutral-400 rounded-full border border-neutral-100"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      Address Type
                    </label>
                    <select
                      name="type"
                      value={addressData.type}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs appearance-none cursor-pointer"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addressData.name}
                      onChange={handleAddressChange}
                      className={`w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs font-inter ${addressErrors.name ? "border border-red-400" : ""}`}
                      required
                    />
                    {addressErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      maxLength={10}
                      className={`w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs font-inter ${addressErrors.phone ? "border border-red-400" : ""}`}
                      required
                    />
                    {addressErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      maxLength={6}
                      className={`w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs font-poppins ${addressErrors.pincode ? "border border-red-400" : ""}`}
                      required
                    />
                    {addressErrors.pincode && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.pincode}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={addressData.addressLine1}
                      onChange={handleAddressChange}
                      className={`w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs font-poppins ${addressErrors.addressLine1 ? "border border-red-400" : ""}`}
                      required
                    />
                    {addressErrors.addressLine1 && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.addressLine1}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={addressData.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs font-poppins"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className={`w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs font-poppins ${addressErrors.city ? "border border-red-400" : ""}`}
                      required
                    />
                    {addressErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C19A6B] mb-2 block">
                      State *
                    </label>
                    <select
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      className={`w-full bg-neutral-50 rounded-xl px-5 py-3 outline-none text-xs appearance-none cursor-pointer ${addressErrors.state ? "border border-red-400" : ""}`}
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
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.state}
                      </p>
                    )}
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
                    className="text-xs font-semibold text-neutral-500 cursor-pointer flex-1"
                  >
                    Set as Default Address
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-3 bg-neutral-50 text-neutral-400 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddressSubmit}
                    disabled={saving}
                    className="flex-[2] py-3 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-[#C19A6B] transition-all"
                  >
                    Save Address
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
// Force update
