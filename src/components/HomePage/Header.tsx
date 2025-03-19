// src/components/HomePage/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from '../Dropdown'; // Adjust the path if necessary

interface HeaderProps {
    userEmail: string | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const dropdownItems = [
        { label: 'Upload Material', onClick: () => navigate('/upload') },
    ];

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-gray-800">E-Library</Link>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
                            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-gray-700">{userEmail}</span>
                        </button>
                        <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} items={dropdownItems} />
                    </div>

                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;