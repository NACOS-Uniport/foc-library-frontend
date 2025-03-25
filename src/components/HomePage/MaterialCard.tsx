// src/components/HomePage/MaterialCard.tsx
import React from 'react';

interface MaterialCardProps {
    material: {
        _id: string;
        level: number;
        courseCode: string;
        courseTitle: string;
        description: string;
        material: string;
    };
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl sen-semibold mb-2">{material.courseTitle}</h3>
            <p className="text-gray-700 mb-2">{material.description}</p>
            <a href={material.material} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                View Material
            </a>
        </div>
    );
};

export default MaterialCard;