import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface UploadMaterialProps {
    onUploadSuccess?: () => void;
    onBack?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UploadMaterial: React.FC<UploadMaterialProps> = ({ 
    onUploadSuccess, 
    onBack 
}) => {
    const { token } = useAuth(); // Use the token from AuthContext
    const [level, setLevel] = useState('200');
    const [courseCode, setCourseCode] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [material, setMaterial] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            
            // File type validation
            const allowedTypes = [
                'application/pdf', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                'application/vnd.ms-powerpoint', 
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ];
            
            if (selectedFile.size > 10 * 1024 * 1024) {
                setUploadError('File size exceeds 10MB limit');
                return;
            }

            if (!allowedTypes.includes(selectedFile.type)) {
                setUploadError('Invalid file type. Please upload PDF, DOC, DOCX, PPT, or PPTX');
                return;
            }

            setMaterial(selectedFile);
            setUploadError(null);
        } else {
            setMaterial(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        // Improved token validation
        if (!token) {
            setUploadError('Authentication required. Please log in again.');
            setUploading(false);
            return;
        }

        if (!level || !courseCode || !courseTitle || !material) {
            setUploadError('Please fill in all required fields and select a file.');
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('level', level);
        formData.append('courseCode', courseCode);
        formData.append('courseTitle', courseTitle);
        formData.append('description', description || '');
        formData.append('material', material);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/materials/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`, // Ensure token is correctly formatted
                    },
                    timeout: 10000 // 10 second timeout
                }
            );

            console.log('Upload successful:', response.data);
            
            // Reset form
            setLevel('200');
            setCourseCode('');
            setCourseTitle('');
            setDescription('');
            setMaterial(null);
            setUploadSuccess(true);

            // Trigger upload success callback
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            
            // More detailed error handling
            if (err.response) {
                // Server responded with an error
                if (err.response.status === 401) {
                    setUploadError('Authentication failed. Please log in again.');
                } else {
                    setUploadError(
                        err.response.data?.message || 
                        `Upload failed: ${err.response.status}`
                    );
                }
            } else if (err.request) {
                // Request made but no response received
                setUploadError('No response from server. Check your network connection.');
            } else {
                // Error in request setup
                setUploadError('Error setting up the upload request.');
            }
        } finally {
            setUploading(false);
        }
    };

    // Reset form function
    const resetForm = () => {
        setLevel('200');
        setCourseCode('');
        setCourseTitle('');
        setDescription('');
        setMaterial(null);
        setUploadError(null);
    };

    return (
        <div className="bg-white shadow-lg rounded-xl max-w-xl mx-auto p-6 space-y-6">
            {/* Header with back button */}
            {onBack && (
                <div className="flex items-center space-x-4 mb-4">
                    <button 
                        onClick={onBack}
                        className="text-gray-600 hover:text-green-600 transition-colors"
                        aria-label="Go back"
                    >
                        ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Upload Learning Material
                    </h2>
                </div>
            )}

            {/* Success Alert */}
            {uploadSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4" role="alert">
                    <p className="text-green-700">Material uploaded successfully!</p>
                </div>
            )}

            {/* Error Alert */}
            {uploadError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4" role="alert">
                    <p className="text-red-700">{uploadError}</p>
                </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Level Dropdown */}
                <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                        Course Level <span className="text-red-500">*</span>
                    </label>
                    <select 
                        id="level" 
                        className="mt-1 block w-full border border-gray-300 rounded-md" 
                        value={level} 
                        onChange={(e) => setLevel(e.target.value)}
                        required
                    >
                        <option value="100">100 Level</option>
                        <option value="200">200 Level</option>
                        <option value="300">300 Level</option>
                        <option value="400">400 Level</option>
                    </select>
                </div>

                {/* Course Code Input */}
                <div>
                    <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">
                        Course Code <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="courseCode" 
                        className="mt-1 block w-full border border-gray-300 rounded-md" 
                        value={courseCode} 
                        onChange={(e) => setCourseCode(e.target.value)} 
                        placeholder="e.g. CSC 249.2"
                        required
                    />
                </div>

                {/* Course Title Input */}
                <div>
                    <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700">
                        Course Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="courseTitle" 
                        className="mt-1 block w-full border border-gray-300 rounded-md" 
                        value={courseTitle} 
                        onChange={(e) => setCourseTitle(e.target.value)} 
                        placeholder="Introduction to Computer Science"
                        required
                    />
                </div>

                {/* Description (Optional) */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description <span className="text-gray-500">(Optional)</span>
                    </label>
                    <textarea 
                        id="description" 
                        className="mt-1 block w-full border border-gray-300 rounded-md" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Brief description of the learning material..."
                        rows={3}
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload File <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex justify-center text-sm text-gray-600">
                                <label htmlFor="material" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input 
                                        id="material" 
                                        type="file" 
                                        className="sr-only" 
                                        onChange={handleMaterialChange} 
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX, PPT, PPTX up to 10MB
                            </p>
                            {material && (
                                <p className="text-sm text-green-600 pt-2">
                                    Selected: {material.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between space-x-4">
                    <button 
                        type="button" 
                        className="w-full bg-gray-100 text-gray-700 py-2 rounded-md"
                        onClick={resetForm}
                    >
                        Reset
                    </button>
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white py-2 rounded-md disabled:opacity-50"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload Material'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadMaterial;