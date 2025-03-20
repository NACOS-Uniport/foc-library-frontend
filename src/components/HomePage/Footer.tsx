// src/components/HomePage/Footer.tsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-4 text-center">
            <div className="container mx-auto">
                <p className="text-gray-600">
                    © {new Date().getFullYear()} E-Library. All rights reserved.
                </p>
                <p className="text-gray-500">
                    Contact: focuniport@gmail.com
                </p>
            </div>
        </footer>
    );
};

export default Footer;