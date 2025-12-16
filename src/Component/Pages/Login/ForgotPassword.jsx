// Component/Pages/Login/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuMail, LuLock, LuKeyRound, LuArrowLeft, LuCheck, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification, 3: Reset password
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [touched, setTouched] = useState({
        email: false,
        otp: false,
        newPassword: false,
        confirmPassword: false
    });
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canSubmit, setCanSubmit] = useState(false);
    const navigate = useNavigate();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Password validation regex patterns
    const passwordRegex = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    };

    // Validate email
    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    // Validate OTP
    const validateOtp = (otp) => {
        if (!otp) return 'OTP is required';
        if (otp.length !== 6) return 'OTP must be 6 digits';
        if (!/^\d+$/.test(otp)) return 'OTP must contain only numbers';
        return '';
    };

    // Validate password and update strength
    const validatePassword = (password) => {
        const strength = {
            length: passwordRegex.length.test(password),
            uppercase: passwordRegex.uppercase.test(password),
            lowercase: passwordRegex.lowercase.test(password),
            number: passwordRegex.number.test(password),
            special: passwordRegex.special.test(password)
        };
        
        setPasswordStrength(strength);
        
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        
        const errors = [];
        if (!strength.uppercase) errors.push('one uppercase letter');
        if (!strength.lowercase) errors.push('one lowercase letter');
        if (!strength.number) errors.push('one number');
        if (!strength.special) errors.push('one special character');
        
        if (errors.length > 0) {
            return `Password must contain at least ${errors.join(', ')}`;
        }
        
        return '';
    };

    // Validate confirm password
    const validateConfirmPassword = (confirmPassword, newPassword) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== newPassword) return 'Passwords do not match';
        return '';
    };

    // Calculate password strength score
    const calculatePasswordScore = () => {
        const requirements = Object.values(passwordStrength);
        const metRequirements = requirements.filter(Boolean).length;
        return (metRequirements / requirements.length) * 100;
    };

    // Get password strength color and text
    const getPasswordStrengthInfo = () => {
        const score = calculatePasswordScore();
        if (score < 20) return { color: 'text-red-600', text: 'Very Weak' };
        if (score < 40) return { color: 'text-red-500', text: 'Weak' };
        if (score < 60) return { color: 'text-yellow-500', text: 'Fair' };
        if (score < 80) return { color: 'text-yellow-600', text: 'Good' };
        return { color: 'text-green-600', text: 'Strong' };
    };

    // Handle input change with validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change
        let error = '';
        if (name === 'email') {
            error = validateEmail(value);
        } else if (name === 'otp') {
            // Only allow numbers and limit to 6 digits
            const numbersOnly = value.replace(/\D/g, '').slice(0, 6);
            setFormData(prev => ({ ...prev, otp: numbersOnly }));
            error = validateOtp(numbersOnly);
        } else if (name === 'newPassword') {
            error = validatePassword(value);
            // Also re-validate confirm password if it exists
            if (formData.confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
                }));
            }
        } else if (name === 'confirmPassword') {
            error = validateConfirmPassword(value, formData.newPassword);
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Handle input blur
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Check if form can be submitted
    useEffect(() => {
        let isValid = false;
        
        if (step === 1) {
            isValid = !errors.email && formData.email.length > 0;
        } else if (step === 2) {
            isValid = !errors.otp && formData.otp.length === 6;
        } else if (step === 3) {
            const passwordValid = !errors.newPassword && formData.newPassword.length > 0;
            const confirmValid = !errors.confirmPassword && formData.confirmPassword.length > 0;
            isValid = passwordValid && confirmValid;
        }
        
        setCanSubmit(isValid);
    }, [step, errors, formData]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        
        // Validate before submitting
        const emailError = validateEmail(formData.email);
        if (emailError) {
            setErrors(prev => ({ ...prev, email: emailError }));
            setTouched(prev => ({ ...prev, email: true }));
            toast.error(emailError);
            return;
        }

        setIsLoading(true);

        // Simulate API call to send OTP
        setTimeout(() => {
            setOtpSent(true);
            setStep(2);
            setCountdown(60); // 60 seconds countdown
            toast.success('OTP has been sent to your email!');
            setIsLoading(false);

            // Start countdown timer
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, 1500);
    };

    const handleResendOtp = () => {
        if (countdown > 0) {
            toast.info(`Please wait ${countdown} seconds before resending`);
            return;
        }

        setIsLoading(true);
        
        // Simulate resend OTP
        setTimeout(() => {
            setCountdown(60);
            toast.success('OTP has been resent to your email!');
            setIsLoading(false);

            // Start countdown timer
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, 1000);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        // Validate before submitting
        const otpError = validateOtp(formData.otp);
        if (otpError) {
            setErrors(prev => ({ ...prev, otp: otpError }));
            setTouched(prev => ({ ...prev, otp: true }));
            toast.error(otpError);
            return;
        }

        setIsLoading(true);

        // Simulate OTP verification
        setTimeout(() => {
            // In real app, verify OTP with backend
            setStep(3);
            toast.success('OTP verified successfully!');
            setIsLoading(false);
        }, 1500);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const passwordError = validatePassword(formData.newPassword);
        const confirmError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);
        
        const hasErrors = passwordError || confirmError;
        
        if (hasErrors) {
            setErrors({
                newPassword: passwordError,
                confirmPassword: confirmError
            });
            setTouched({
                newPassword: true,
                confirmPassword: true
            });
            
            if (passwordError) toast.error(passwordError);
            else if (confirmError) toast.error(confirmError);
            return;
        }

        setIsLoading(true);

        // Simulate password reset API call
        setTimeout(() => {
            toast.success('Password reset successfully!');
            setIsLoading(false);
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }, 1500);
    };

    // Password requirement check component
    const PasswordRequirement = ({ met, text }) => (
        <div className="flex items-center space-x-2">
            {met ? (
                <LuCheck className="text-green-500" />
            ) : (
                <LuX className="text-red-500" />
            )}
            <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
                {text}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Back to Login Button */}
                <div className="mb-6">
                    <Link 
                        to="/login" 
                        className="inline-flex items-center text-sm text-[#C19A6B] hover:text-amber-700 transition-colors duration-300"
                    >
                        <LuArrowLeft className="mr-2" />
                        Back to Login
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h2 className="text-3xl font-bold font-playfair text-gray-900">
                            Feauag
                        </h2>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Follow the steps to recover your account
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center">
                            {/* Step 1 */}
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#C19A6B] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                1
                            </div>
                            <div className={`h-1 w-12 ${step >= 2 ? 'bg-[#C19A6B]' : 'bg-gray-200'}`}></div>
                            
                            {/* Step 2 */}
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#C19A6B] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                2
                            </div>
                            <div className={`h-1 w-12 ${step >= 3 ? 'bg-[#C19A6B]' : 'bg-gray-200'}`}></div>
                            
                            {/* Step 3 */}
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-[#C19A6B] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                3
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600 px-6">
                        <span className={step >= 1 ? 'text-[#C19A6B] font-medium' : ''}>Enter Email</span>
                        <span className={step >= 2 ? 'text-[#C19A6B] font-medium' : ''}>Verify OTP</span>
                        <span className={step >= 3 ? 'text-[#C19A6B] font-medium' : ''}>New Password</span>
                    </div>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form className="space-y-6" onSubmit={handleSendOtp}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter your registered email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`appearance-none block w-full pl-10 px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                                            touched.email && errors.email
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]'
                                        }`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {touched.email && errors.email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    We'll send a verification code to this email
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !canSubmit}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter the 6-digit verification code
                                </label>
                                <p className="text-sm text-gray-600 mb-4">
                                    We've sent a code to <span className="font-semibold">{formData.email}</span>
                                </p>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuKeyRound className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength="6"
                                        required
                                        value={formData.otp}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`appearance-none block w-full pl-10 px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                                            touched.otp && errors.otp
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]'
                                        }`}
                                        placeholder="000000"
                                    />
                                </div>
                                {touched.otp && errors.otp && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.otp}
                                    </p>
                                )}
                                <div className="mt-3 flex justify-between items-center">
                                    <p className="text-xs text-gray-500">
                                        Didn't receive the code?
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={countdown > 0 || isLoading}
                                        className="text-sm font-medium text-[#C19A6B] hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || !canSubmit}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Code'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                                >
                                    Use different email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`appearance-none block w-full pl-10 px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                                            touched.newPassword && errors.newPassword
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]'
                                        }`}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                
                                {/* Password strength indicator */}
                                {formData.newPassword && (
                                    <div className="mt-2 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-600">
                                                Password Strength:
                                            </span>
                                            <span className={`text-xs font-semibold ${getPasswordStrengthInfo().color}`}>
                                                {getPasswordStrengthInfo().text}
                                            </span>
                                        </div>
                                        
                                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    calculatePasswordScore() < 40 ? 'bg-red-500' :
                                                    calculatePasswordScore() < 60 ? 'bg-yellow-500' :
                                                    calculatePasswordScore() < 80 ? 'bg-yellow-600' : 'bg-green-600'
                                                }`}
                                                style={{ width: `${calculatePasswordScore()}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {touched.newPassword && errors.newPassword && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.newPassword}
                                    </p>
                                )}
                                
                                {/* Password requirements */}
                                <div className="mt-3 space-y-1">
                                    <p className="text-xs font-medium text-gray-600">Password must contain:</p>
                                    <div className="grid grid-cols-2 gap-1">
                                        <PasswordRequirement met={passwordStrength.length} text="At least 8 characters" />
                                        <PasswordRequirement met={passwordStrength.uppercase} text="One uppercase letter" />
                                        <PasswordRequirement met={passwordStrength.lowercase} text="One lowercase letter" />
                                        <PasswordRequirement met={passwordStrength.number} text="One number" />
                                        <PasswordRequirement met={passwordStrength.special} text="One special character" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LuLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`appearance-none block w-full pl-10 px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                                            touched.confirmPassword && errors.confirmPassword
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:border-[#C19A6B] focus:ring-[#C19A6B]'
                                        }`}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                                {formData.confirmPassword && !errors.confirmPassword && (
                                    <p className="mt-1 text-xs text-green-600">
                                        ✓ Passwords match
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || !canSubmit}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C19A6B] hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C19A6B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                                >
                                    Back to OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Help Text */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-600 text-center">
                            If you're still having trouble, please{' '}
                            <Link to="/contact" className="font-medium text-[#C19A6B] hover:text-amber-700">
                                contact our support team
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Note */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">
                                Security Notice
                            </h3>
                            <div className="mt-2 text-sm text-amber-700">
                                <p>
                                    For your security, the verification code will expire in 10 minutes. 
                                    Never share this code with anyone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;