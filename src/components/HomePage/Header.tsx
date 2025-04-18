import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown";

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const dropdownItems = [
    {
      label: "Upload Material",
      onClick: () => navigate("/upload"),
      className: "py-3 px-6 hover:bg-gray-100",
    },
    {
      label: "Logout",
      onClick: onLogout,
      className: "py-3 px-6 text-white bg-red-500 hover:bg-red-600",
    },
  ];

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-white shadow-md fixed z-10 w-full">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl sen-bold text-green-500">
          {greeting}
        </Link>

        <div className="flex items-center space-x-4">
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
          >
            <button
              className={`flex items-center space-x-2 focus:outline-none p-2 rounded ${
                isDropdownOpen ? "bg-gray-200" : ""
              }`}
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-gray-700 hidden md:block">{userEmail}</span>
            </button>

            <Dropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              items={dropdownItems}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
