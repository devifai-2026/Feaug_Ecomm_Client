import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaEdit, FaSave, FaTimes, FaCalendarAlt, FaLock, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import userApi from '../../../apis/user/userApi';
import { INDIAN_STATES } from '../../utils/Validation';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressData, setAddressData] = useState({
    type: 'home',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user is logged in
      if (!userApi.isAuthenticated()) {
        toast.error('Please login to view your profile');
        navigate('/login');
        return;
      }

      setLoading(true);

      try {
        const response = await userApi.getCurrentUser();

        if (response.status === 'success' && response.data) {
          const user = response.data.user || response.data;
          const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

          setUserData({
            id: user._id || user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            email: user.email || '',
            phone: user.phone || '',
            address: defaultAddress
              ? `${defaultAddress.street || ''}, ${defaultAddress.city || ''}, ${defaultAddress.state || ''} - ${defaultAddress.postalCode || ''}`
              : 'No address saved',
            dob: user.dateOfBirth || '',
            joinDate: user.createdAt || new Date().toISOString(),
            gender: user.gender || 'Prefer not to say',
            profileImage: user.profileImage || null,
            isEmailVerified: user.isEmailVerified || false,
            addresses: user.addresses || []
          });
        } else {
          // Try to get user from localStorage as fallback
          const storedUser = userApi.getStoredUser();
          if (storedUser) {
            setUserData({
              id: storedUser._id || storedUser.id,
              firstName: storedUser.firstName || '',
              lastName: storedUser.lastName || '',
              name: `${storedUser.firstName || ''} ${storedUser.lastName || ''}`.trim() || 'User',
              email: storedUser.email || '',
              phone: storedUser.phone || '',
              address: 'No address saved',
              dob: storedUser.dateOfBirth || '',
              joinDate: storedUser.createdAt || new Date().toISOString(),
              gender: storedUser.gender || 'Prefer not to say',
              profileImage: storedUser.profileImage || null,
              isEmailVerified: storedUser.isEmailVerified || false,
              addresses: storedUser.addresses || []
            });
          } else {
            toast.error('Failed to load profile data');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
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
      gender: userData.gender
    });
    setShowEditModal(true);
  };

  const handleSaveClick = async () => {
    if (!tempData.firstName || !tempData.lastName) {
      toast.error('First name and last name are required');
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        phone: tempData.phone,
        gender: tempData.gender,
        dateOfBirth: tempData.dob || undefined
      };

      const response = await userApi.updateProfile(updateData);

      if (response.status === 'success') {
        setUserData(prev => ({
          ...prev,
          firstName: tempData.firstName,
          lastName: tempData.lastName,
          name: `${tempData.firstName} ${tempData.lastName}`.trim(),
          phone: tempData.phone,
          dob: tempData.dob,
          gender: tempData.gender
        }));
        setShowEditModal(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
        newPassword: passwordData.newPassword
      });

      if (response.status === 'success') {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Password updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData({
      ...addressData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAddressClick = () => {
    setEditingAddressId(null);
    setAddressData({
      type: 'home',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    });
    setShowAddressModal(true);
  };

  const handleEditAddressClick = (address) => {
    setEditingAddressId(address._id);
    setAddressData({
      type: address.type || 'home',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false
    });
    setShowAddressModal(true);
  };

  // Helper to refresh user data
  const refreshUserData = async () => {
    try {
      const response = await userApi.getCurrentUser();
      if (response.status === 'success' && response.data) {
        const user = response.data.user || response.data;
        const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

        setUserData(prev => ({
          ...prev,
          addresses: user.addresses || [],
          address: defaultAddress
            ? `${defaultAddress.addressLine1 || ''}, ${defaultAddress.city || ''}`
            : 'No address saved'
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user data', error);
    }
  };

  const handleAddressSubmit = async () => {
    // Basic validation
    if (!addressData.addressLine1 || !addressData.city || !addressData.state || !addressData.pincode) {
      toast.error('Please fill all required fields');
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

      if (response.status === 'success') {
        toast.success(editingAddressId ? 'Address updated successfully' : 'Address added successfully');
        setShowAddressModal(false);
        refreshUserData();
      } else {
        toast.error(response.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await userApi.deleteAddress(addressId);
      if (response.status === 'success') {
        toast.success('Address deleted successfully');
        refreshUserData();
      } else {
        toast.error(response.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await userApi.setDefaultAddress(addressId);
      if (response.status === 'success') {
        toast.success('Default address updated');
        refreshUserData();
      } else {
        toast.error(response.message || 'Failed to update default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-gradient-to-r from-[#a17b4c] to-[#b49269] text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-white/20"></div>
              <div>
                <div className="h-8 bg-white/20 w-48 mb-2 rounded"></div>
                <div className="h-4 bg-white/20 w-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 w-48 rounded"></div>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your profile</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#C19A6B] text-white rounded-lg hover:bg-[#987344] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a17b4c] to-[#b49269] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-3xl" />
                )}
              </div>
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 bg-white text-[#C19A6B] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <FaEdit className="text-sm" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
              <p className="text-amber-100">Member since {formatDate(userData.joinDate)}</p>
              {userData.isEmailVerified && (
                <span className="inline-flex items-center gap-1 mt-1 text-sm text-green-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-md md:text-2xl font-bold text-gray-900 text-nowrap">Personal Information</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-[#C19A6B] text-[#C19A6B] hover:bg-[#C19A6B] hover:text-white transition-colors duration-300 text-nowrap"
              >
                <FaLock />
                Change Password
              </button>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-[#C19A6B] text-white hover:bg-amber-800 transition-colors duration-300 text-nowrap"
              >
                <FaEdit />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FaUser className="text-[#C19A6B] mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{userData.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-[#C19A6B]  mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FaPhone className="text-[#C19A6B]  mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-900">{userData.phone || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FaMapMarkerAlt className="text-[#C19A6B]  mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{userData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FaBirthdayCake className="text-[#C19A6B]  mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-900">{formatDate(userData.dob)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-[#C19A6B]  mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium text-gray-900">{userData.gender}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-md md:text-2xl font-bold text-gray-900 text-nowrap">Saved Addresses</h2>
            <button
              onClick={handleAddAddressClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#C19A6B] text-white hover:bg-amber-800 transition-colors duration-300 text-nowrap rounded-lg"
            >
              <FaPlus />
              Add Address
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {userData.addresses && userData.addresses.length > 0 ? (
              userData.addresses.map((addr, index) => (
                <div key={addr._id || index} className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow">
                  {addr.isDefault && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <FaCheckCircle /> Default
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    {addr.type === 'home' ? '🏠 Home' : addr.type === 'work' ? '🏢 Work' : '📍 Other'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {addr.addressLine1}, {addr.addressLine2 && <>{addr.addressLine2}, </>}
                    <br />
                    {addr.city}, {addr.state} - {addr.pincode}
                    <br />
                    {addr.country}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditAddressClick(addr)}
                      className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr._id)}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium ml-auto"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">No addresses saved yet</p>
                <button
                  onClick={handleAddAddressClick}
                  className="text-[#C19A6B] font-medium hover:underline"
                >
                  Add your first address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Edit Profile Modal */}
      {
        showEditModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
              onClick={handleCancelClick}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                    <button
                      onClick={handleCancelClick}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <FaTimes className="text-xl text-gray-600" />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">Update your personal information</p>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={tempData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={tempData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={tempData.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={tempData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={tempData.dob ? tempData.dob.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={tempData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCancelClick}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveClick}
                        disabled={saving}
                        className="px-6 py-3 bg-[#C19A6B] text-white rounded-lg hover:bg-[#987344] transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSave />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )
      }

      {/* Change Password Modal */}
      {
        showPasswordModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
              onClick={() => setShowPasswordModal(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="border-b border-gray-200 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <FaTimes className="text-xl text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handlePasswordSubmit}
                        disabled={saving}
                        className="px-6 py-3 bg-[#C19A6B] text-white rounded-lg hover:bg-[#987344] transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaLock />
                        {saving ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )
      }

      {/* Address Modal */}
      {
        showAddressModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
              onClick={() => setShowAddressModal(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      onClick={() => setShowAddressModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <FaTimes className="text-xl text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Type
                        </label>
                        <select
                          name="type"
                          value={addressData.type}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressData.pincode}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                          placeholder="123456"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={addressData.addressLine1}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                          placeholder="Street address, flat number, etc."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={addressData.addressLine2}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Landmark, apartment details (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressData.city}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          name="state"
                          value={addressData.state}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={addressData.country}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={addressData.isDefault}
                        onChange={handleAddressChange}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                      />
                      <label htmlFor="isDefault" className="text-sm text-gray-700 cursor-pointer">
                        Set as default address
                      </label>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddressSubmit}
                        disabled={saving}
                        className="px-6 py-3 bg-[#C19A6B] text-white rounded-lg hover:bg-[#987344] transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSave />
                        {saving ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default MyProfile;
