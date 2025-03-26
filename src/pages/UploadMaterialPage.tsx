import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { MaterialUploadData, UploadStatus, PendingUpload } from "../types";

interface UploadMaterialProps {
  onUploadSuccess?: () => void;
}

const UploadMaterialPage: React.FC<UploadMaterialProps> = ({
  onUploadSuccess,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [formData, setFormData] = useState<MaterialUploadData>({
    level: "200",
    courseCode: "",
    courseTitle: "",
    description: "",
    material: null,
  });
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    uploading: false,
    error: null,
    success: false,
  });

  const token = localStorage.getItem("authToken");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB limit");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX");
        return;
      }

      setFormData((prev) => ({ ...prev, material: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploadStatus({ uploading: true, error: null, success: false });

    const { level, courseCode, courseTitle, description, material } = formData;
    if (
      !level ||
      !courseCode ||
      !courseTitle ||
      !material ||
      !description.trim()
    ) {
      toast.error("Please fill all required fields");
      setUploadStatus({
        uploading: false,
        error: "Please fill all required fields",
        success: false,
      });
      return;
    }

    const uploadFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) uploadFormData.append(key, value);
    });

    try {
      await axios.post(`${API_BASE_URL}/materials`, uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const pendingUpload: PendingUpload = {
        ...formData,
        status: "Pending",
        fileName: formData.material?.name || "",
      };
      setPendingUploads((prev) => [pendingUpload, ...prev]);

      toast.success("Material uploaded successfully!");

      setFormData({
        level: "Select Level",
        courseCode: "",
        courseTitle: "",
        description: "",
        material: null,
      });
      setUploadStatus({ uploading: false, error: null, success: true });
      setIsModalOpen(false);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Upload failed";
      toast.error(errorMessage);

      setUploadStatus({
        uploading: false,
        error: errorMessage,
        success: false,
      });
    }
  };

  const cancelUpload = () => {
    setIsModalOpen(false);
    setFormData({
      level: "200",
      courseCode: "",
      courseTitle: "",
      description: "",
      material: null,
    });
    setUploadStatus({ uploading: false, error: null, success: false });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button and Upload Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus className="mr-2" size={20} />
          Upload New Material
        </button>
      </div>

      {/* Pending Uploads Section */}
      <div className="mb-6">
        <h2 className="text-xl sen-semibold mb-4">Pending Uploads</h2>
        {pendingUploads.length === 0 ? (
          <p className="text-gray-500">No pending uploads</p>
        ) : (
          <ul className="space-y-3">
            {pendingUploads.map((upload, index) => (
              <li
                key={index}
                className="bg-yellow-50 border border-yellow-200 p-3 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="sen-medium">{upload.courseTitle}</p>
                  <p className="text-sm text-gray-600">
                    {upload.courseCode} | {upload.fileName} | Status:{" "}
                    {upload.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-xl sen-extrabold text-black/75">
                Upload Material
              </h2>
              <button
                onClick={cancelUpload}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="level"
                    className="block text-sm sen-medium text-gray-700"
                  >
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="courseCode"
                    className="block text-sm sen-medium text-gray-700"
                  >
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    placeholder="CSC 249.2"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="courseTitle"
                  className="block text-sm sen-medium text-gray-700"
                >
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleInputChange}
                  placeholder="Intro to Computer Science"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm sen-medium text-gray-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Material description..."
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows={2}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-3 bg-white text-green-500 rounded-lg shadow-md tracking-wide border-2 border-dashed border-green-300 cursor-pointer hover:bg-green-100">
                    <Upload className="w-6 h-6" />
                    <span className="mt-2 text-sm leading-normal">
                      {formData.material
                        ? formData.material.name
                        : "Select a file"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">
                  PDF, DOC, DOCX, PPT, PPTX up to 10MB
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadStatus.uploading}
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {uploadStatus.uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMaterialPage;
