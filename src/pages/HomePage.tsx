import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/HomePage/Header';
import Footer from '../components/HomePage/Footer';
import MaterialCard from '../components/HomePage/MaterialCard';

interface HomePageProps {
    userEmail: string | null;
    onLogout: () => void;
}

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

const HomePage: React.FC<HomePageProps> = ({ userEmail, onLogout }) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/materials`);
                
                // Log the entire response to understand its structure
                console.log('Full API Response:', response);
                
                // Check the actual structure of the response
                let materialsData;
                
                // Common API response patterns
                if (response.data && Array.isArray(response.data)) {
                    // If the response is directly an array
                    materialsData = response.data;
                } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    // If the response has a 'data' property containing the array
                    materialsData = response.data.data;
                } else if (response.data && response.data.materials && Array.isArray(response.data.materials)) {
                    // Another common pattern
                    materialsData = response.data.materials;
                } else {
                    // If none of the above patterns match
                    throw new Error('Unexpected data structure from API');
                }

                console.log('Processed Materials:', materialsData);
                
                setMaterials(materialsData);
            } catch (err: any) {
                console.error('Error fetching materials:', err);
                setError(err.message || 'Failed to fetch materials');
                setMaterials([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, [searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header userEmail={userEmail} onLogout={onLogout} />

            <main className="container mx-auto p-4 flex-grow">
                <input
                    type="text"
                    placeholder="Search for materials..."
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="sen-bold">Error!</strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-4">Loading materials...</div>
                ) : materials.length === 0 ? (
                    <div className="text-center py-4">No materials found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {materials.map((material) => (
                            <MaterialCard key={material._id} material={material} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;