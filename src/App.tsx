// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import UploadMaterial from './components/UploadPage/UploadMaterial'; // Ensure the path is correct

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your actual auth logic
    const [userEmail, setUserEmail] = useState<string | null>(null); // Stores user email if logged in

    // Example authentication check (replace with your actual logic)
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken'); // Or however you store tokens
        if (storedToken) {
            setIsLoggedIn(true);
            // Ideally, fetch user info (including email) based on the token here
            setUserEmail('user@example.com'); // Replace with the actual email
        }
    }, []);

    const handleLogin = (email: string) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        // Store auth token in local storage, session storage, etc.
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserEmail(null);
        localStorage.removeItem('authToken'); // Or remove your token storage
    };

    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <HomePage userEmail={userEmail} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />
                <Route
                    path="/upload"
                    element={
                        isLoggedIn ? (
                            <UploadMaterial onUploadSuccess={() => { /* Handle refresh after upload */ }} />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;