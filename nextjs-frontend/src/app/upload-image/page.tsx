"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function UploadImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<{ points: number[][]; labels: number[] }>({
    points: [],
    labels: [],
  });
  const [mode, setMode] = useState<'include' | 'exclude'>('include');
  const [isLoading, setIsLoading] = useState(false);
  const [processedMasks, setProcessedMasks] = useState<string[]>([]);

  // Automatically load default image on component mount
  useEffect(() => {
    const loadDefaultImage = async () => {
      const response = await fetch("/images/test_photo_example.jpg");
      const blob = await response.blob();
      const defaultFile = new File([blob], "test_photo_example.jpg", { type: "image/jpeg" });
      setFile(defaultFile);
    };
    loadDefaultImage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
    setProcessedImage(null);
    setPrompts({ points: [], labels: [] });
  };

  const handleImageClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (!file) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const newPoints = [...prompts.points, [x, y]];
    const newLabels = [...prompts.labels, mode === 'include' ? 1 : 0];
    setPrompts({ points: newPoints, labels: newLabels });

    const formData = new FormData();
    formData.append('image', file);
    formData.append('data', JSON.stringify({ points: newPoints, labels: newLabels, bboxes: [] }));

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/process-image/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          setProcessedMasks((prev) => [...prev, `data:image/png;base64,${data.image}`]);
        } else {
          console.error("Processing error:", data.error);
        }
      } else {
        console.error("Failed to process image");
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Navbar />
      <div className="flex gap-8 items-start mt-8 pl-8">
        <div className="w-1/3">
          <h1 className="text-4xl font-bold mb-4">Upload an Image</h1>
          <form className="mt-4">
            <label htmlFor="image" className="block mb-2">Choose an image:</label>
            <input type="file" onChange={handleFileChange} className="mb-4" required />
          </form>


<div className="flex space-x-4 mb-4 mt-6"> {/* Added mt-6 for extra space above the buttons */}
  <button
    onClick={() => setMode('include')}
    className={`px-4 py-2 rounded ${mode === 'include' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
  >
    Include
  </button>
  <button
    onClick={() => setMode('exclude')}
    className={`px-4 py-2 rounded ${mode === 'exclude' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
  >
    Exclude
  </button>
</div>

          <div className="text-gray-700 mb-2">
            <p>Select "Include" to add more areas to the detected object, or "Exclude" to remove unwanted sections from it.</p>
          </div>

        </div>

<div className="w-1/2">
  <div className="relative h-[400px] bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
    {file && (
      <>
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="object-contain h-full w-full rounded-md"
          onClick={handleImageClick}
        />
        {processedMasks.map((mask, index) => (
          <img
            key={index}
            src={mask}
            alt={`Processed Mask ${index + 1}`}
            className="absolute inset-0 object-contain h-full w-full rounded-md pointer-events-none"
          />
        ))}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <span className="text-gray-700">Processing...</span>
          </div>
        )}
      </>
    )}
  </div>

  {file && (
<div className="flex justify-between items-center w-full mt-2">
  {/* Interaction Prompt */}
  <div className="flex-grow text-center text-gray-700 font-bold text-mb">
    Click the image to interact with an object!
  </div>

      {/* Reset Masks Button */}
      <button
        onClick={() => {
          setProcessedMasks([]); // Clear masks
          setPrompts({ points: [], labels: [] }); // Reset prompts
          setProcessedImage(null); // Optional: Reset the processed image state if necessary
        }}
        className="text-blue-500 hover:text-blue-700 font-bold text-md"
      >
        Reset
      </button>

    </div>
  )}
</div>

      </div>
    </div>
  );
}
