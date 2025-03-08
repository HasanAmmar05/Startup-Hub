"use client";

import React from "react";

interface StartupImageProps {
  src: string;
  alt: string;
  className?: string;
}

const StartupImage = ({ src, alt, className }: StartupImageProps) => {
  const [imgSrc, setImgSrc] = React.useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc("/placeholder.svg")}
    />
  );
};

export default StartupImage;
