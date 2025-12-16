// Component/Pages/Cart/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { 
    BsCurrencyRupee, 
    BsArrowLeft, 
    BsCreditCard, 
    BsTruck,
    BsShieldCheck,
    BsLock,
    BsCheckCircle,
    BsPaypal,
    BsGoogle,
    BsExclamationCircle
} from 'react-icons/bs';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcApplePay } from 'react-icons/fa';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

// Move InputField component outside
const InputField = ({ label, name, value, onChange, onBlur, type = 'text', placeholder, error, id, required = true, className = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <div className="relative">
            <input
                id={id || name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                    error 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500 hover:border-gray-400'
                }`}
                placeholder={placeholder}
            />
            {error && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <BsExclamationCircle className="text-red-500" />
                </div>
            )}
        </div>
        {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <BsExclamationCircle className="text-xs" />
                {error}
            </p>
        )}
    </div>
);

// Move TextareaField component outside
const TextareaField = ({ label, name, value, onChange, onBlur, placeholder, error, id, required = true, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <div className="relative">
            <textarea
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors resize-none ${
                    error 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500 hover:border-gray-400'
                }`}
                placeholder={placeholder}
            />
            {error && (
                <div className="absolute right-3 top-3">
                    <BsExclamationCircle className="text-red-500" />
                </div>
            )}
        </div>
        {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <BsExclamationCircle className="text-xs" />
                {error}
            </p>
        )}
    </div>
);

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getSubtotal, clearCart } = useCart();
    
    // Form states
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
    const [loading, setLoading] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [saveInfo, setSaveInfo] = useState(false);
    
    // Shipping info state
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    
    // Billing info state
    const [billingInfo, setBillingInfo] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    
    // Payment info state
    const [paymentInfo, setPaymentInfo] = useState({
        method: 'creditCard',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false
    });
    
    // Shipping options
    const shippingOptions = [
        { id: 'standard', name: 'Standard Shipping', cost: 50, days: '5-7 business days' },
        { id: 'express', name: 'Express Shipping', cost: 150, days: '2-3 business days' },
        { id: 'nextDay', name: 'Next Day Delivery', cost: 300, days: '1 business day' }
    ];
    
    const [selectedShipping, setSelectedShipping] = useState('standard');
    const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
    
    // Validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    // Calculate totals
    const subtotal = getSubtotal();
    const shippingCost = selectedShippingOption?.cost || 0;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shippingCost + tax;
    
    // Validation functions
    const validateField = (name, value, stepType) => {
        let error = '';
        
        // Common validations
        if (!value.trim()) {
            return 'This field is required';
        }
        
        // Step-specific validations
        if (stepType === 'shipping') {
            switch (name) {
                case 'firstName':
                case 'lastName':
                    if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
                        error = 'Must be 2-50 letters only';
                    }
                    break;
                    
                case 'email':
                    if (!/^\S+@\S+\.\S+$/.test(value)) {
                        error = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'phone':
                    const phoneDigits = value.replace(/\D/g, '');
                    if (!/^\d{10}$/.test(phoneDigits)) {
                        error = 'Phone number must be 10 digits';
                    }
                    break;
                    
                case 'address':
                    if (value.length < 10) {
                        error = 'Address must be at least 10 characters';
                    }
                    break;
                    
                case 'city':
                case 'state':
                    if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
                        error = 'Must be 2-50 letters only';
                    }
                    break;
                    
                case 'zipCode':
                    if (!/^\d{6}$/.test(value)) {
                        error = 'ZIP code must be 6 digits';
                    }
                    break;
                    
                default:
                    break;
            }
        }
        
        if (stepType === 'billing' && !sameAsShipping) {
            switch (name) {
                case 'firstName':
                case 'lastName':
                    if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
                        error = 'Must be 2-50 letters only';
                    }
                    break;
                    
                case 'address':
                    if (value.length < 10) {
                        error = 'Address must be at least 10 characters';
                    }
                    break;
                    
                case 'city':
                case 'state':
                    if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
                        error = 'Must be 2-50 letters only';
                    }
                    break;
                    
                case 'zipCode':
                    if (!/^\d{6}$/.test(value)) {
                        error = 'ZIP code must be 6 digits';
                    }
                    break;
                    
                default:
                    break;
            }
        }
        
        if (stepType === 'payment') {
            switch (name) {
                case 'cardNumber':
                    const cardDigits = value.replace(/\s/g, '');
                    if (!/^\d{16}$/.test(cardDigits)) {
                        error = 'Card number must be 16 digits';
                    } else if (!validateLuhn(cardDigits)) {
                        error = 'Invalid card number';
                    }
                    break;
                    
                case 'cardName':
                    if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
                        error = 'Must be 2-50 letters only';
                    }
                    break;
                    
                case 'expiryDate':
                    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                        error = 'Format must be MM/YY';
                    } else {
                        const [month, year] = value.split('/');
                        const currentYear = new Date().getFullYear() % 100;
                        const currentMonth = new Date().getMonth() + 1;
                        
                        if (parseInt(year) < currentYear || 
                            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                            error = 'Card has expired';
                        }
                    }
                    break;
                    
                case 'cvv':
                    if (!/^\d{3,4}$/.test(value)) {
                        error = 'CVV must be 3 or 4 digits';
                    }
                    break;
                    
                default:
                    break;
            }
        }
        
        return error;
    };
    
    // Luhn algorithm for credit card validation
    const validateLuhn = (cardNumber) => {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return (sum % 10) === 0;
    };
    
    // Handle field blur (mark as touched)
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validate the field
        let error = '';
        const value = e.target.value;
        
        if (step === 1) {
            error = validateField(name, value, 'shipping');
        } else if (step === 2) {
            if (!sameAsShipping && name.startsWith('billing_')) {
                const fieldName = name.replace('billing_', '');
                error = validateField(fieldName, value, 'billing');
            } else if (paymentInfo.method === 'creditCard') {
                error = validateField(name, value, 'payment');
            }
        }
        
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };
    
    // Handle shipping info change
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate as user types if field has been touched
        if (touched[name]) {
            const error = validateField(name, value, 'shipping');
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };
    
    // Handle billing info change
    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        const fieldName = name.replace('billing_', '');
        
        setBillingInfo(prev => ({
            ...prev,
            [fieldName]: value
        }));
        
        // Validate as user types if field has been touched
        if (touched[name]) {
            const error = validateField(fieldName, value, 'billing');
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };
    
    // Handle payment info change
    const handlePaymentChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setPaymentInfo(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setPaymentInfo(prev => ({
                ...prev,
                [name]: value
            }));
            
            // Validate as user types if field has been touched
            if (touched[name] && name !== 'method') {
                const error = validateField(name, value, 'payment');
                setErrors(prev => ({
                    ...prev,
                    [name]: error
                }));
            }
        }
    };
    
    // Handle card number formatting
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        
        // Add spaces every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        
        setPaymentInfo(prev => ({
            ...prev,
            cardNumber: value
        }));
        
        // Validate as user types if field has been touched
        if (touched.cardNumber) {
            const error = validateField('cardNumber', value, 'payment');
            setErrors(prev => ({
                ...prev,
                cardNumber: error
            }));
        }
    };
    
    // Handle expiry date formatting
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        
        // Add slash after 2 digits
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        
        setPaymentInfo(prev => ({
            ...prev,
            expiryDate: value
        }));
        
        // Validate as user types if field has been touched
        if (touched.expiryDate) {
            const error = validateField('expiryDate', value, 'payment');
            setErrors(prev => ({
                ...prev,
                expiryDate: error
            }));
        }
    };
    
    // Validate all shipping fields
    const validateAllShipping = () => {
        const newErrors = {};
        const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
        
        fields.forEach(field => {
            const error = validateField(field, shippingInfo[field], 'shipping');
            if (error) {
                newErrors[field] = error;
            }
        });
        
        return newErrors;
    };
    
    // Validate all billing fields
    const validateAllBilling = () => {
        if (sameAsShipping) return {};
        
        const newErrors = {};
        const fields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
        
        fields.forEach(field => {
            const error = validateField(field, billingInfo[field], 'billing');
            if (error) {
                newErrors[`billing_${field}`] = error;
            }
        });
        
        return newErrors;
    };
    
    // Validate all payment fields
    const validateAllPayment = () => {
        if (paymentInfo.method !== 'creditCard') return {};
        
        const newErrors = {};
        const fields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
        
        fields.forEach(field => {
            const error = validateField(field, paymentInfo[field], 'payment');
            if (error) {
                newErrors[field] = error;
            }
        });
        
        return newErrors;
    };
    
    // Check if current step is valid
    const isStepValid = () => {
        if (step === 1) {
            const errors = validateAllShipping();
            return Object.keys(errors).length === 0;
        } else if (step === 2) {
            const billingErrors = validateAllBilling();
            const paymentErrors = validateAllPayment();
            return Object.keys(billingErrors).length === 0 && Object.keys(paymentErrors).length === 0;
        }
        return true;
    };
    
    // Handle next step
    const handleNextStep = () => {
        // Mark all fields as touched
        const newTouched = {};
        
        if (step === 1) {
            ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'].forEach(field => {
                newTouched[field] = true;
            });
        } else if (step === 2) {
            if (!sameAsShipping) {
                ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'].forEach(field => {
                    newTouched[`billing_${field}`] = true;
                });
            }
            if (paymentInfo.method === 'creditCard') {
                ['cardNumber', 'cardName', 'expiryDate', 'cvv'].forEach(field => {
                    newTouched[field] = true;
                });
            }
        }
        
        setTouched(prev => ({ ...prev, ...newTouched }));
        
        // Validate current step
        let stepErrors = {};
        
        if (step === 1) {
            stepErrors = validateAllShipping();
        } else if (step === 2) {
            const billingErrors = validateAllBilling();
            const paymentErrors = validateAllPayment();
            stepErrors = { ...billingErrors, ...paymentErrors };
        }
        
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            
            // Find first error field and scroll to it
            const firstErrorField = Object.keys(stepErrors)[0];
            const element = document.getElementById(firstErrorField) || document.querySelector(`[name="${firstErrorField}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            
            toast.error('Please correct the errors before proceeding');
            return;
        }
        
        // Copy shipping info to billing if checkbox is checked
        if (step === 1 && sameAsShipping) {
            setBillingInfo({
                firstName: shippingInfo.firstName,
                lastName: shippingInfo.lastName,
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zipCode: shippingInfo.zipCode,
                country: shippingInfo.country
            });
        }
        
        setStep(step + 1);
        window.scrollTo(0, 0);
    };
    
    // Handle previous step
    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
            window.scrollTo(0, 0);
        }
    };
    
    // Handle place order
    const handlePlaceOrder = async () => {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            
            // Save order to localStorage
            const order = {
                orderId: 'ORD' + Date.now(),
                date: new Date().toISOString(),
                shippingInfo,
                billingInfo,
                paymentMethod: paymentInfo.method,
                items: cartItems,
                subtotal,
                shippingCost,
                tax,
                total,
                status: 'processing'
            };
            
            // Save order history
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
            orderHistory.push(order);
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
            
            // Clear cart
            clearCart();
            
            // Show success toast
            toast.success(
                <div className="text-center">
                    <BsCheckCircle className="text-4xl text-green-500 mx-auto mb-2" />
                    <h3 className="font-bold text-lg">Order Placed Successfully!</h3>
                    <p className="text-sm">Order ID: {order.orderId}</p>
                </div>,
                {
                    duration: 5000,
                    position: 'top-center'
                }
            );
            
            // Navigate to home page
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }, 2000);
    };
    
    // Auto-fill billing when checkbox changes
    useEffect(() => {
        if (sameAsShipping) {
            setBillingInfo({
                firstName: shippingInfo.firstName,
                lastName: shippingInfo.lastName,
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zipCode: shippingInfo.zipCode,
                country: shippingInfo.country
            });
        }
    }, [sameAsShipping, shippingInfo]);
    
    // Get field error message
    const getFieldError = (fieldName) => {
        return errors[fieldName];
    };
    
    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center animate-fadeInUp">
                        <BsCreditCard className="text-5xl text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                        Your cart is empty
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        You need to add items to your cart before checking out.
                    </p>
                    <Link
                        to="/cart"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        Return to Cart
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            {/* Progress Steps */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center justify-center">
                    <div className="flex items-center w-full max-w-2xl">
                        {/* Step 1 */}
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {step > 1 ? <BsCheckCircle /> : '1'}
                            </div>
                            <div className={`h-1 w-24 ${step >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {step > 2 ? <BsCheckCircle /> : '2'}
                            </div>
                            <div className={`h-1 w-24 ${step >= 3 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                3
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
                    <span className={step >= 1 ? 'text-amber-600 font-medium' : ''}>Shipping</span>
                    <span className={step >= 2 ? 'text-amber-600 font-medium' : ''}>Payment</span>
                    <span className={step >= 3 ? 'text-amber-600 font-medium' : ''}>Review</span>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
                                <div className="flex items-center gap-3 mb-6">
                                    <BsTruck className="text-2xl text-amber-600" />
                                    <h2 className="text-2xl font-bold text-gray-800">Shipping Information</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="First Name"
                                        name="firstName"
                                        value={shippingInfo.firstName}
                                        onChange={handleShippingChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter first name"
                                        error={getFieldError('firstName')}
                                    />
                                    
                                    <InputField
                                        label="Last Name"
                                        name="lastName"
                                        value={shippingInfo.lastName}
                                        onChange={handleShippingChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter last name"
                                        error={getFieldError('lastName')}
                                    />
                                    
                                    <InputField
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={shippingInfo.email}
                                        onChange={handleShippingChange}
                                        onBlur={handleBlur}
                                        placeholder="you@example.com"
                                        error={getFieldError('email')}
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
                                        error={getFieldError('phone')}
                                        className="md:col-span-2"
                                    />
                                    
                                    <TextareaField
                                        label="Address"
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleShippingChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter full address with house number, street, etc."
                                        error={getFieldError('address')}
                                        className="md:col-span-2"
                                    />
                                    
                                    <InputField
                                        label="City"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleShippingChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter city"
                                        error={getFieldError('city')}
                                    />
                                    
                                    <InputField
                                        label="State"
                                        name="state"
                                        value={shippingInfo.state}
                                        onChange={handleShippingChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter state"
                                        error={getFieldError('state')}
                                    />
                                    
                                    <InputField
                                        label="ZIP Code"
                                        name="zipCode"
                                        value={shippingInfo.zipCode}
                                        onChange={handleShippingChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter 6-digit ZIP"
                                        error={getFieldError('zipCode')}
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
                                    <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-900">
                                        Save this information for next time
                                    </label>
                                </div>
                            </div>
                        )}
                        
                        {step === 2 && (
                            <div className="space-y-6">
                                {/* Billing Address */}
                                <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Billing Address</h2>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="sameAsShipping"
                                                checked={sameAsShipping}
                                                onChange={(e) => setSameAsShipping(e.target.checked)}
                                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">
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
                                                error={getFieldError('billing_firstName')}
                                            />
                                            
                                            <InputField
                                                label="Last Name"
                                                name="billing_lastName"
                                                value={billingInfo.lastName}
                                                onChange={handleBillingChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter last name"
                                                error={getFieldError('billing_lastName')}
                                            />
                                            
                                            <TextareaField
                                                label="Address"
                                                name="billing_address"
                                                value={billingInfo.address}
                                                onChange={handleBillingChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter full address"
                                                error={getFieldError('billing_address')}
                                                className="md:col-span-2"
                                            />
                                            
                                            <InputField
                                                label="City"
                                                name="billing_city"
                                                value={billingInfo.city}
                                                onChange={handleBillingChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter city"
                                                error={getFieldError('billing_city')}
                                            />
                                            
                                            <InputField
                                                label="State"
                                                name="billing_state"
                                                value={billingInfo.state}
                                                onChange={handleBillingChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter state"
                                                error={getFieldError('billing_state')}
                                            />
                                            
                                            <InputField
                                                label="ZIP Code"
                                                name="billing_zipCode"
                                                value={billingInfo.zipCode}
                                                onChange={handleBillingChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter 6-digit ZIP"
                                                error={getFieldError('billing_zipCode')}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Payment Method */}
                                <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
                                    <div className="flex items-center gap-3 mb-6">
                                        <BsCreditCard className="text-2xl text-amber-600" />
                                        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {/* Payment Options */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <label className={`flex flex-col items-center justify-center p-4 border cursor-pointer transition-all duration-200 ${
                                                paymentInfo.method === 'creditCard' 
                                                    ? 'border-amber-500 bg-amber-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="method"
                                                    value="creditCard"
                                                    checked={paymentInfo.method === 'creditCard'}
                                                    onChange={handlePaymentChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaCcVisa className="text-2xl text-blue-600" />
                                                    <FaCcMastercard className="text-2xl text-red-600" />
                                                    <FaCcAmex className="text-2xl text-blue-800" />
                                                </div>
                                                <span className="text-sm font-medium">Credit Card</span>
                                            </label>
                                            
                                            <label className={`flex flex-col items-center justify-center p-4 border cursor-pointer transition-all duration-200 ${
                                                paymentInfo.method === 'paypal' 
                                                    ? 'border-amber-500 bg-amber-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="method"
                                                    value="paypal"
                                                    checked={paymentInfo.method === 'paypal'}
                                                    onChange={handlePaymentChange}
                                                    className="sr-only"
                                                />
                                                <BsPaypal className="text-3xl text-blue-700 mb-2" />
                                                <span className="text-sm font-medium">PayPal</span>
                                            </label>
                                            
                                            <label className={`flex flex-col items-center justify-center p-4 border cursor-pointer transition-all duration-200 ${
                                                paymentInfo.method === 'googlePay' 
                                                    ? 'border-amber-500 bg-amber-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="method"
                                                    value="googlePay"
                                                    checked={paymentInfo.method === 'googlePay'}
                                                    onChange={handlePaymentChange}
                                                    className="sr-only"
                                                />
                                                <BsGoogle className="text-3xl text-red-500 mb-2" />
                                                <span className="text-sm font-medium">Google Pay</span>
                                            </label>
                                            
                                            <label className={`flex flex-col items-center justify-center p-4 border cursor-pointer transition-all duration-200 ${
                                                paymentInfo.method === 'applePay' 
                                                    ? 'border-amber-500 bg-amber-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="method"
                                                    value="applePay"
                                                    checked={paymentInfo.method === 'applePay'}
                                                    onChange={handlePaymentChange}
                                                    className="sr-only"
                                                />
                                                <FaCcApplePay className="text-3xl text-black mb-2" />
                                                <span className="text-sm font-medium">Apple Pay</span>
                                            </label>
                                        </div>
                                        
                                        {/* Credit Card Form */}
                                        {paymentInfo.method === 'creditCard' && (
                                            <div className="space-y-6">
                                                <InputField
                                                    label="Card Number"
                                                    name="cardNumber"
                                                    value={paymentInfo.cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    onBlur={handleBlur}
                                                    placeholder="1234 5678 9012 3456"
                                                    error={getFieldError('cardNumber')}
                                                    className="md:col-span-2"
                                                />
                                                
                                                <InputField
                                                    label="Name on Card"
                                                    name="cardName"
                                                    value={paymentInfo.cardName}
                                                    onChange={handlePaymentChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Enter name as on card"
                                                    error={getFieldError('cardName')}
                                                    className="md:col-span-2"
                                                />
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <InputField
                                                        label="Expiry Date"
                                                        name="expiryDate"
                                                        value={paymentInfo.expiryDate}
                                                        onChange={handleExpiryChange}
                                                        onBlur={handleBlur}
                                                        placeholder="MM/YY"
                                                        error={getFieldError('expiryDate')}
                                                    />
                                                    
                                                    <InputField
                                                        label="CVV"
                                                        name="cvv"
                                                        type="password"
                                                        value={paymentInfo.cvv}
                                                        onChange={handlePaymentChange}
                                                        onBlur={handleBlur}
                                                        placeholder="123"
                                                        error={getFieldError('cvv')}
                                                    />
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="saveCard"
                                                        checked={paymentInfo.saveCard}
                                                        onChange={handlePaymentChange}
                                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                                    />
                                                    <label className="ml-2 block text-sm text-gray-900">
                                                        Save card for future purchases
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Security Notice */}
                                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="flex items-start gap-3">
                                                <BsShieldCheck className="text-xl text-blue-600 mt-1" />
                                                <div>
                                                    <h4 className="font-medium text-blue-800 mb-1">Secure Payment</h4>
                                                    <p className="text-sm text-blue-700">
                                                        Your payment information is encrypted and secure. We never store your complete card details.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {step === 3 && (
                            <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
                                <div className="flex items-center gap-3 mb-6">
                                    <BsCheckCircle className="text-2xl text-green-600" />
                                    <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
                                </div>
                                
                                {/* Order Summary */}
                                <div className="space-y-6">
                                    {/* Shipping Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                                            <p>{shippingInfo.address}</p>
                                            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                                            <p>{shippingInfo.country}</p>
                                            <p className="mt-2">📧 {shippingInfo.email}</p>
                                            <p>📱 {shippingInfo.phone}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Billing Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Billing Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="font-medium">{billingInfo.firstName} {billingInfo.lastName}</p>
                                            <p>{billingInfo.address}</p>
                                            <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
                                            <p>{billingInfo.country}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Payment Method */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="font-medium capitalize">{paymentInfo.method.replace(/([A-Z])/g, ' $1')}</p>
                                            {paymentInfo.method === 'creditCard' && (
                                                <p className="text-gray-600">
                                                    Card ending in {paymentInfo.cardNumber.slice(-4)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Shipping Method */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Method</h3>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="font-medium">{selectedShippingOption.name}</p>
                                            <p className="text-gray-600">{selectedShippingOption.days}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Order Items */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
                                        <div className="space-y-4">
                                            {cartItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
                                                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={item.image || '/placeholder-image.jpg'}
                                                            alt={item.title || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className="font-bold text-gray-900 flex items-center">
                                                        <BsCurrencyRupee className="text-sm mr-1" />
                                                        {(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Terms and Conditions */}
                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <BsLock className="text-xl text-amber-600 mt-1" />
                                        <div>
                                            <h4 className="font-medium text-amber-800 mb-1">Terms & Conditions</h4>
                                            <p className="text-sm text-amber-700">
                                                By placing this order, you agree to our Terms of Service and Privacy Policy. 
                                                All orders are subject to availability and confirmation of the order price. 
                                                Delivery times are estimates and cannot be guaranteed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {step > 1 && (
                                <button
                                    onClick={handlePrevStep}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                                >
                                    <BsArrowLeft /> Previous Step
                                </button>
                            )}
                            
                            <div className="ml-auto">
                                {step < 3 ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!isStepValid()}
                                        className={`px-8 py-3 text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                                            isStepValid()
                                                ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                                                : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Continue to {step === 1 ? 'Payment' : 'Review'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Order Summary Card */}
                            <div className="bg-white shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                                    Order Summary
                                </h2>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium flex items-center">
                                            <BsCurrencyRupee className="text-sm mr-1" />
                                            {subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium flex items-center">
                                            <BsCurrencyRupee className="text-sm mr-1" />
                                            {shippingCost.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (18% GST)</span>
                                        <span className="font-medium flex items-center">
                                            <BsCurrencyRupee className="text-sm mr-1" />
                                            {tax.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-gray-800">Total</span>
                                            <span className="text-gray-900 flex items-center">
                                                <BsCurrencyRupee className="text-base mr-1" />
                                                {total.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Including all taxes and shipping
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <RiSecurePaymentLine className="text-2xl text-green-600" />
                                        <span className="text-sm font-medium text-gray-700">100% Secure Payment</span>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <FaCcVisa className="text-2xl text-gray-400" />
                                        <FaCcMastercard className="text-2xl text-gray-400" />
                                        <FaCcAmex className="text-2xl text-gray-400" />
                                        <BsPaypal className="text-2xl text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Help Section */}
                            <div className="bg-white shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-800 mb-4">Need Help?</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                                            <BsTruck className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Free Shipping</p>
                                            <p className="text-xs text-gray-600">On orders over ₹999</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                                            <BsShieldCheck className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Easy Returns</p>
                                            <p className="text-xs text-gray-600">30-day return policy</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                                            <BsLock className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Secure Checkout</p>
                                            <p className="text-xs text-gray-600">SSL encrypted</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;