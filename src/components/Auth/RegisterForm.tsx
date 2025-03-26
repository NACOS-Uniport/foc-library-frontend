import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { email });
      toast.success("Registration successful! Please check your email.");
      setRegisterSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      setRegisterError(
        error.response?.data?.message || error.message || "Registration failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md w-full">
      {registerSuccess ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded animate-pulse">
          <p className="text-green-700 sen-medium">Registration successful!</p>
          <p className="text-green-600 mt-1">
            Please check your email for verification instructions.
          </p>
          <p className="text-gray-500 text-sm mt-3">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {registerError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{registerError}</p>
            </div>
          )}
          <div>
            <label
              htmlFor="register-email"
              className="block text-gray-700 sen-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="register-email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md sen-medium transition ${
              isLoading
                ? "bg-green-950 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isLoading ? "Registering..." : "Create Account"}
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
