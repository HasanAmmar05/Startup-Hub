"use client"; // This directive is required for client components

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientContentProps {
  content: string;
}

const ClientContent = ({ content }: ClientContentProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <Skeleton className="w-full h-48" />;
  }
  
  return (
    <>
      {content ? (
        <article
          className="prose max-w-4xl font-work-sans break-all"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="no-result">No details provided</p>
      )}
    </>
  );
};

export default ClientContent;