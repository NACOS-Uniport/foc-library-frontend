import React, { useState } from 'react';
import axios from 'axios';

interface LoginFormProps {
    onLogin: (email: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [otpRequested, setOtpRequested] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const requestOtp = async () => {
        if (!email) return;
        
        setIsLoading(true);
        setLoginError(null);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/request-otp`, { email });
            console.log('OTP requested:', response.data);
            setOtpRequested(true);
        } catch (error: any) {
            console.error('OTP request error:', error);
            setLoginError(error.response?.data?.message || error.message || 'Failed to request OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, otp });
            console.log('Login successful:', response.data);
            localStorage.setItem('authToken', response.data.token);
            onLogin(email);
        } catch (error: any) {
            console.error('Login error:', error);
            setLoginError(error.response?.data?.message || error.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=" p-8 max-w-md w-full">
            {loginError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{loginError}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="login-email" className="block text-gray-700 font-medium mb-2">
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
                    <label htmlFor="login-otp" className="block text-gray-700 font-medium mb-2">
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
                            disabled={isLoading || !email}
                            className={`absolute right-1 top-1 bottom-1 px-4 rounded-md whitespace-nowrap transition focus:outline-none ${
                                isLoading || !email
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-300 text-green-950 hover:bg-green-500"
                            }`}
                        >
                            {isLoading ? "..." : "Get OTP"}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !email || !otp}
                    className={`w-full py-2 px-4 rounded-md font-medium transition focus:outline-none ${
                        isLoading || !email || !otp
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800 text-white"
                    }`}
                >
                    {isLoading ? "Logging in..." : "Log In"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;