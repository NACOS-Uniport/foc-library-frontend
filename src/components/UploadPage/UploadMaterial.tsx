import React, { useState } from 'react';
import axios from 'axios';

interface UploadMaterialProps {
    onUploadSuccess: () => void; // Callback to refresh material list
    onBack: () => void; // Callback to navigate back
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UploadMaterial: React.FC<UploadMaterialProps> = ({ onUploadSuccess, onBack }) => {
    const [level, setLevel] = useState('200');
    const [courseCode, setCourseCode] = useState('CSC 249.2');
    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [material, setMaterial] = useState<File | null>(null);
    const [token, setToken] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

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
        setUploadSuccess(false);

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
            setUploadSuccess(true);

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
        <div className="max-w-xl mx-auto p-4">
            <div className="flex items-center mb-4">
                <button 
                    onClick={onBack}
                    className="mr-2 p-1 rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800">Upload Learning Material</h2>
            </div>
            
            {uploadSuccess && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Material uploaded successfully!</span>
                </div>
            )}
            
            {uploadError && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{uploadError}</span>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="level" className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                        <select 
                            id="level" 
                            className="block w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" 
                            value={level} 
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            <option value="100">100 Level</option>
                            <option value="200">200 Level</option>
                            <option value="300">300 Level</option>
                            <option value="400">400 Level</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="courseCode" className="block text-xs font-medium text-gray-700 mb-1">Course Code</label>
                        <input 
                            type="text" 
                            id="courseCode" 
                            className="block w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" 
                            value={courseCode} 
                            onChange={(e) => setCourseCode(e.target.value)} 
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="courseTitle" className="block text-xs font-medium text-gray-700 mb-1">Course Title</label>
                    <input 
                        type="text" 
                        id="courseTitle" 
                        className="block w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" 
                        value={courseTitle} 
                        onChange={(e) => setCourseTitle(e.target.value)} 
                        placeholder="e.g. Introduction to Computer Science"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        id="description" 
                        rows={2}
                        className="block w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Brief description of the material..."
                    />
                </div>

                <div>
                    <label htmlFor="material" className="block text-xs font-medium text-gray-700 mb-1">Upload File</label>
                    <div className="mt-1 flex justify-center px-4 py-2 border border-gray-300 border-dashed rounded-md bg-gray-50">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-xs text-gray-600">
                                <label htmlFor="material" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="material" type="file" className="sr-only" onChange={handleMaterialChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX up to 10MB</p>
                            {material && (
                                <p className="text-xs text-green-600">
                                    Selected: {material.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="token" className="block text-xs font-medium text-gray-700 mb-1">Access Token</label>
                    <input 
                        type="password" 
                        id="token" 
                        className="block w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        placeholder="Enter your access token"
                    />
                </div>

                <div className="flex items-center justify-end pt-2">
                    <button 
                        type="button" 
                        className="mr-3 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                        onClick={() => {
                            setLevel('200');
                            setCourseCode('CSC 249.2');
                            setCourseTitle('');
                            setDescription('');
                            setMaterial(null);
                            setToken('');
                            setUploadError(null);
                        }}
                    >
                        Reset
                    </button>
                    <button 
                        type="submit" 
                        className="inline-flex items-center px-4 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : 'Upload Material'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadMaterial;