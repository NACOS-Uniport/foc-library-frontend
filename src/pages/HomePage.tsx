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
    url: string | undefined;
    _id: string;
    level: number;
    courseCode: string;
    courseTitle: string;
    description: string;
    material: string;  // This should be the URL or path to the material
    createdAt: string;
    updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomePage: React.FC<HomePageProps> = ({ userEmail, onLogout }) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
            setError(null);
            setIsInitialLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/materials`);
                
                let materialsData;
                
                if (response.data && Array.isArray(response.data)) {
                    materialsData = response.data;
                } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    materialsData = response.data.data;
                } else if (response.data && response.data.materials && Array.isArray(response.data.materials)) {
                    materialsData = response.data.materials;
                } else {
                    throw new Error('Unexpected data structure from API');
                }

                setMaterials(materialsData);
                setFilteredMaterials(materialsData);
            } catch (err: any) {
                console.error('Error fetching materials:', err);
                setError(err.message || 'Failed to fetch materials');
                setMaterials([]);
                setFilteredMaterials([]);
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    useEffect(() => {
        const searchMaterials = async () => {
            if (searchTerm) {
                setIsSearching(true);
                await new Promise(resolve => setTimeout(resolve, 300));

                const filtered = materials.filter(material => 
                    material.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    material.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    material.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
                
                setFilteredMaterials(filtered);
                setIsSearching(false);
            } else {
                setFilteredMaterials(materials);
            }
        };

        searchMaterials();
    }, [searchTerm, materials]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header userEmail={userEmail} onLogout={onLogout} />

            <h1 className="text-4xl sen-extrabold text-black/75 mx-auto pt-24 mb-6 text-center max-w-80">What are we studying today?</h1>

            <main className="container mx-auto px-4 py-5 flex-grow">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by course code, title, or description..."
                        className="shadow appearance-none border rounded w-full py-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {isSearching && (
                        <div className="absolute right-1/2 top-2/3 transform">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 mt-4 mb-5 border-gray-900"></div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="sen-bold">Error!</strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {isInitialLoading ? (
                    <div className="text-center py-4 mt-7">Loading materials...</div>
                ) : isSearching ? (
                    <div className="text-center py-4 mt-7">Searching materials...</div>
                ) : filteredMaterials.length === 0 ? (
                    <div className="text-center py-4 mt-7">No materials found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {filteredMaterials.map((material) => (
                            <div key={material._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
                                <h2 className="text-xl sen-bold mb-2">{material.courseCode} - {material.courseTitle}</h2>
                                <p className="text-gray-600 mb-4">{material.description}</p>
                                <p className="text-sm text-gray-500 mb-4">Level: {material.level}</p>
                                <a 
                                    href={material.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    download
                                    className="mt-auto bg-green-500 hover:bg-green-600 text-white sen-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                                >
                                    Download Material
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;