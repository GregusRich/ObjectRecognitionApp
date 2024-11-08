"use client";

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      {/* Navbar */}
      <Navbar />

      {/* Main Content with Left Padding */}
      <div className="pl-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Object Recognition App</h1>
        <p className="text-lg mb-6">cd
          This application allows you to upload your own images and tag specific regions with near perfect precision!
          The Object Recognition App uses Meta's advanced SAM-2 object segmentation model.
        </p>
        <p className="text-lg mb-4">
          Click "Upload Image" to get tagging now!
        </p>

        {/* Upload Image Button */}
        <div className="mt-8 text-left">
          <Link href="/upload-image" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Upload Image
          </Link>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          <Image
            src="/images/sam2-coffee-mug-example.jpg"
            alt="SAM2 model example with a coffee mug"
            width={400}
            height={300}
            className="rounded-md"
          />
          <Image
            src="/images/sam2-soccer-ball-example.jpg"
            alt="SAM2 model example with a soccer ball"
            width={400}
            height={300}
            className="rounded-md"
          />
          <Image
            src="/images/sam2-segment-anything-example.jpg"
            alt="SAM2 model example segment anything"
            width={400}
            height={300}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
