import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
    onLogin: (email: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const { setToken } = useAuth(); // Use the setToken method from auth context
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [otpRequested, setOtpRequested] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const navigate = useNavigate();

    const requestOtp = async () => {
        if (!email) return;
        
        setIsRequestingOtp(true);
        setLoginError(null);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/request-otp`, { email });
            toast.success('OTP sent to your email');
            setOtpRequested(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to request OTP');
            setLoginError(error.response?.data?.message || error.message || 'Failed to request OTP.');
        } finally {
            setIsRequestingOtp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
            toast.success('Login successful!');
            
            // Store token in both localStorage and auth context
            const authToken = response.data.token;
            localStorage.setItem('authToken', authToken);
            setToken(authToken); // Set token in auth context
            
            onLogin(email);
            navigate('/'); // Redirect to home page after successful login
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
            setLoginError(error.response?.data?.message || error.message || 'Login failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-md w-full">
            {loginError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{loginError}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="login-email" className="block text-gray-700 sen-medium mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="login-email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-gray-300 focus:outline-none transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="login-otp" className="block text-gray-700 sen-medium mb-2">
                        One-Time Password
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="login-otp"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-gray-300 focus:outline-none transition pr-24"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                        />
                        <button
                            type="button"
                            onClick={requestOtp}
                            disabled={isRequestingOtp || !email}
                            className={`absolute right-1 top-1 bottom-1 px-4 rounded-md whitespace-nowrap transition focus:outline-none ${
                                isRequestingOtp || !email
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-500"
                            }`}
                        >
                            {isRequestingOtp ? "Sending..." : "Get OTP"}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !email || !otp}
                    className={`w-full py-2 px-4 rounded-md sen-medium transition focus:outline-none ${
                        isSubmitting || !email || !otp
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800 text-white"
                    }`}
                >
                    {isSubmitting ? "Logging in..." : "Log In"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;