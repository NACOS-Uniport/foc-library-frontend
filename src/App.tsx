import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import UploadMaterial from './components/UploadPage/UploadMaterial';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setIsLoggedIn(true);
            // Ideally, fetch user info (including email) based on the token here
            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail) {
                setUserEmail(storedEmail);
            }
        }
    }, []);

    const handleLogin = (email: string) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        localStorage.setItem('userEmail', email); // Store email for persistence
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserEmail(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
    };

    return (
        <Router>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Routes>
                <Route path="/auth" element={
                    isLoggedIn ? <Navigate to="/" replace /> : <AuthPage onLogin={handleLogin} />
                } />
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