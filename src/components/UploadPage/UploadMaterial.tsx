// src/components/UploadPage/UploadMaterial.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface UploadMaterialProps {
    onUploadSuccess: () => void; // Callback to refresh material list
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UploadMaterial: React.FC<UploadMaterialProps> = ({ onUploadSuccess }) => {
    const [level, setLevel] = useState('200');
    const [courseCode, setCourseCode] = useState('CSC 249.2');
    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [material, setMaterial] = useState<File | null>(null);
    const [token, setToken] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setMaterial(e.target.files[0]);
        } else {
            setMaterial(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setUploadError(null);

        if (!material) {
            setUploadError('Please select a material file.');
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('level', level);
        formData.append('courseCode', courseCode);
        formData.append('courseTitle', courseTitle);
        formData.append('description', description);
        formData.append('material', material);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/materials/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log('Upload successful:', response.data);
            setLevel('200');
            setCourseCode('CSC 249.2');
            setCourseTitle('');
            setDescription('');
            setMaterial(null);
            setToken('');

            if (onUploadSuccess) {
                onUploadSuccess(); // Refresh the material list
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            setUploadError(err.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Upload Material</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="level" className="block text-gray-700 text-sm font-bold mb-2">Level:</label>
                    <select id="level" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={level} onChange={(e) => setLevel(e.target.value)}>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="courseCode" className="block text-gray-700 text-sm font-bold mb-2">Course Code:</label>
                    <input type="text" id="courseCode" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label htmlFor="courseTitle" className="block text-gray-700 text-sm font-bold mb-2">Course Title:</label>
                    <input type="text" id="courseTitle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                    <textarea id="description" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label htmlFor="material" className="block text-gray-700 text-sm font-bold mb-2">Material:</label>
                    <input type="file" id="material" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleMaterialChange} />
                </div>

                <div className="mb-4">
                    <label htmlFor="token" className="block text-gray-700 text-sm font-bold mb-2">Token:</label>
                    <input type="text" id="token" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={token} onChange={(e) => setToken(e.target.value)} />
                </div>

                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>

                {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
            </form>
        </div>
    );
};

export default UploadMaterial;