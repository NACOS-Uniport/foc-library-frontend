// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

interface AuthPageProps {
    onLogin: (email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isRegistering 
                            ? 'Sign up to get started with our service' 
                            : 'Log in to access your account'}
                    </p>
                </div>
                
                <div className="transition-all duration-300 transform">
                    {isRegistering ? (
                        <RegisterForm onRegisterSuccess={toggleForm} />
                    ) : (
                        <LoginForm onLogin={onLogin} />
                    )}
                </div>
                
                <div className="mt-6 text-center">
                    <button 
                        className="text-green-600 hover:text-green-800 transition font-medium"
                        onClick={toggleForm}
                    >
                        {isRegistering 
                            ? 'Already have an account? Log in' 
                            : 'Need an account? Sign up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;