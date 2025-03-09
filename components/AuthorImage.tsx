"use client";

import { useState } from "react";
import Image from "next/image";

interface AuthorImageProps {
  src: string;
  alt: string;
  fallbackInitial?: string;
  className?: string;
}

const AuthorImage = ({
  src,
  alt,
  fallbackInitial = "U",
  className = "",
}: AuthorImageProps) => {
  const [error, setError] = useState(false);

  // Debug
  console.log(`AuthorImage - Received src:`, src);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center w-full h-full rounded-full bg-gray-200 text-gray-600 font-semibold text-lg ${className}`}
      >
        {fallbackInitial}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-full"
        onError={(e) => {
          console.error(`Failed to load image: ${src}`, e);
          setError(true);
        }}
        unoptimized={true}
      />
    </div>
  );
};

export default AuthorImage;
