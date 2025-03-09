"use client";

import React from "react";

interface ClientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const ClientImage: React.FC<ClientImageProps> = (props) => {
  return <img {...props} />;
};

export default ClientImage;
