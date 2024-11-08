"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function UploadImagePage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:8000/api/upload-image/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Image uploaded successfully');
    } else {
      console.error('Failed to upload image');
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Navbar */}
      <Navbar />

      {/* Flex Container for Form and Preview */}
      <div className="pl-8 flex gap-8 items-start">
        {/* Upload Form */}
        <div className="w-1/2">
          <h1 className="text-4xl font-bold mb-4">Upload an Image</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <label htmlFor="image" className="block mb-2">Choose an image:</label>
            <input type="file" onChange={handleFileChange} className="mb-4" required />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Upload
            </button>
          </form>
        </div>

        {/* Preview Box */}
        <div className="w-1/2 h-64 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="object-contain h-full w-full rounded-md"
            />
          ) : (
            <span className="text-gray-400">Image preview will appear here</span>
          )}
        </div>
      </div>
    </div>
  );
}
