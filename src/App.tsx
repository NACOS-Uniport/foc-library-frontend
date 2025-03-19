// src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadMaterial from './UploadMaterial'; // Import the UploadMaterial component

interface Material {
    _id: string;
    level: number;
    courseCode: string;
    courseTitle: string;
    description: string;
    material: string; // URL to the material (e.g., PDF)
    createdAt: string;
    updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [level, setLevel] = useState<string>('100');  // Default to 100
    const [courseCode, setCourseCode] = useState<string>('CSC 249.2'); // Default course code
    const [refreshMaterials, setRefreshMaterials] = useState(false);
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const fetchMaterials = async () => {
            setError(null); // Clear any previous errors
            try {
                const response = await axios.get(`${API_BASE_URL}/materials?level=${level}&course-code=${courseCode}`);
                setMaterials(response.data.data); // Assuming the API returns data in a 'data' field.  Adjust if needed.
            } catch (err: any) {
                console.error('Error fetching materials:', err);
                setError(err.message || 'Failed to fetch materials.'); // Set error message
                setMaterials([]); // Clear materials on error
            }
        };

        fetchMaterials();
        setRefreshMaterials(false);
    }, [level, courseCode, refreshMaterials]);

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(e.target.value);
    };

    const handleCourseCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCourseCode(e.target.value);
    };

    const handleUploadSuccess = () => {
        setRefreshMaterials(true);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">E-Library</h1>

            <div className="mb-4">
                <label htmlFor="level" className="block text-gray-700 text-sm font-bold mb-2">Level:</label>
                <select id="level" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={level} onChange={handleLevelChange}>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="courseCode" className="block text-gray-700 text-sm font-bold mb-2">Course Code:</label>
                <input type="text" id="courseCode" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseCode} onChange={handleCourseCodeChange} />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-2">Materials</h2>
            {materials.length > 0 ? (
                <ul className="list-disc pl-5">
                    {materials.map(material => (
                        <li key={material._id} className="mb-2">
                            <a href={material.material} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                {material.courseTitle} - {material.description}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No materials found for this level and course code.</p>
            )}

            <UploadMaterial onUploadSuccess={handleUploadSuccess}/>
        </div>
    );
}

export default App;