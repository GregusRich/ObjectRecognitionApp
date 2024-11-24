"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

export default function UploadImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<{
    points: number[][];
    labels: number[];
  }>({
    points: [],
    labels: [],
  });
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [isLoading, setIsLoading] = useState(false);
  const [processedMasks, setProcessedMasks] = useState<string[]>([]);
  const [retrievedImage, setRetrievedImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);

  // Automatically load default image on component mount
  useEffect(() => {
    const loadDefaultImage = async () => {
      const response = await fetch("/images/test_photo_example.jpg");
      const blob = await response.blob();
      const defaultFile = new File([blob], "test_photo_example.jpg", {
        type: "image/jpeg",
      });
      setFile(defaultFile);
    };
    loadDefaultImage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
    setProcessedImage(null);
    setPrompts({ points: [], labels: [] });
    setProcessedMasks([]); // Reset processed masks
    setRetrievedImage(null); // Reset retrieved image
  };

  const handleImageClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (!file) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const newPoints = [...prompts.points, [x, y]];
    const newLabels = [...prompts.labels, mode === "include" ? 1 : 0];
    setPrompts({ points: newPoints, labels: newLabels });

    // Send a PUT request to update metadata if imageId exists
    if (imageId) {
      try {
        const metadataUpdateResponse = await fetch(
          `http://localhost:8000/api/update-image-metadata/${imageId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ points: newPoints, labels: newLabels }),
          }
        );

        if (!metadataUpdateResponse.ok) {
          console.error(
            "Failed to update metadata:",
            metadataUpdateResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error updating metadata:", error);
      }
    }

    // Send a POST request to reprocess the image
    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "data",
      JSON.stringify({ points: newPoints, labels: newLabels, bboxes: [] })
    );

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/process-image/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          setProcessedMasks((prev) => [
            ...prev,
            `data:image/png;base64,${data.image}`,
          ]);
          setImageId(data.image_id || null); // Set imageId from backend response
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

  const handleReset = () => {
    setProcessedMasks([]); // Clear masks
    setPrompts({ points: [], labels: [] }); // Reset prompts
    setProcessedImage(null); // Reset the processed image state
    setRetrievedImage(null); // Reset retrieved image
  };

  const handleDelete = () => {
    setFile(null); // Clear the current image file
    setProcessedMasks([]); // Clear processed masks
    setPrompts({ points: [], labels: [] }); // Reset prompts
    setRetrievedImage(null); // Reset retrieved image

    // Clear the file input field
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      (fileInput as HTMLInputElement).value = ""; // Reset the file input value
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Navbar />
      <div className="flex gap-8 items-start mt-8 pl-8">
        <div className="w-1/3">
          <h1 className="text-4xl font-bold mb-4">Upload an Image</h1>
          <form className="mt-4">
            <label htmlFor="image" className="block mb-2">
              Choose an image:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-4"
              required
            />
          </form>

          <div className="flex space-x-4 mb-4 mt-6">
            <button
              onClick={() => setMode("include")}
              className={`px-4 py-2 rounded ${
                mode === "include" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Include
            </button>
            <button
              onClick={() => setMode("exclude")}
              className={`px-4 py-2 rounded ${
                mode === "exclude" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Exclude
            </button>
          </div>

          <div className="text-gray-700 mb-2">
            <p>
              Select "Include" to add more areas to the detected object, or
              "Exclude" to remove unwanted sections from it.
            </p>
          </div>
        </div>

        <div className="w-1/2">
          <div className="relative h-[400px] bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
            {file ? (
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
            ) : (
              <span className="text-gray-500 text-sm">Upload an image</span>
            )}
          </div>

          {file && (
            <div className="flex justify-between items-center w-full mt-2">
              <div className="flex-grow text-center text-gray-700 font-bold">
                Click the image to interact with an object!
              </div>
              <button
                onClick={handleReset}
                className="text-blue-500 hover:text-blue-700 font-bold text-md mr-4"
              >
                Reset
              </button>
              <button
                onClick={handleDelete}
                className="text-blue-500 hover:text-blue-700 font-bold text-md"
              >
                Delete
              </button>
            </div>
          )}

          {retrievedImage && (
            <div className="mt-4">
              <h2 className="text-lg font-bold">Retrieved Processed Image:</h2>
              <img
                src={retrievedImage}
                alt="Retrieved Processed"
                className="mt-2 rounded-md object-contain h-[300px] w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
