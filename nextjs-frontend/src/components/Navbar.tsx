"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="container mx-auto p-8">
      {/* Navbar with Home and Upload Image Links */}
      <div className="flex items-center space-x-4 mb-4">
        <Link
          href="/"
          className="text-blue-500 text-lg font-medium hover:underline"
        >
          Home
        </Link>
        <Link
          href="/upload-image"
          className="text-blue-500 text-lg font-medium hover:underline"
        >
          Upload Image
        </Link>
      </div>

      {/* Divider Line */}
      <hr className="border-gray-300 mb-8" />
    </div>
  );
}
