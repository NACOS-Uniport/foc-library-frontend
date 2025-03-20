import React from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: {
    label: string;
    onClick: () => void | Promise<void>;
    className?: string;
  }[];
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, onClose, items, className }) => {
  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden ${className || ''}`}>
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={index}
            className={`w-full text-left ${item.className || 'px-4 py-2 hover:bg-gray-100'}`}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;