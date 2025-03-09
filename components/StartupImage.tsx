"use client";

import { useState } from "react";
import Image from "next/image";

interface StartupImageProps {
  src: string;
  alt: string;
  className?: string;
}

const StartupImage = ({ src, alt, className = "" }: StartupImageProps) => {
  const [error, setError] = useState(false);

  // Debug
  console.log(`StartupImage - Received src:`, src);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 ${className}`}
      >
        No image available
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={(e) => {
          console.error(`Failed to load image: ${src}`, e);
          setError(true);
        }}
        unoptimized={true}
      />
    </div>
  );
};

export default StartupImage;
