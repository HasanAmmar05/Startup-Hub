import { urlForImage } from '@/sanity/lib/image';
import type { Image as SanityImage } from 'sanity';

/**
 * Determines if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

/**
 * Determines if a string is a valid local path
 */
export const isLocalPath = (path: string): boolean => {
  return typeof path === 'string' && path.startsWith('/');
};

/**
 * Determines if a value is a Sanity image reference
 */
export const isSanityImageReference = (value: any): boolean => {
  return (
    value && 
    typeof value === 'object' && 
    '_type' in value && 
    value._type === 'image' && 
    'asset' in value
  );
};

/**
 * Safely resolves an image source to a valid URL
 * Handles various input types:
 * - Full URLs
 * - Local paths
 * - Sanity image references
 * - Sanity image URLs
 * - Undefined/null values
 */
export const resolveImageUrl = (
  source: string | SanityImage | Record<string, any> | null | undefined,
  fallbackUrl: string = '/placeholder.svg'
): string => {
  // Handle undefined or null
  if (!source) {
    return fallbackUrl;
  }

  // Handle string sources
  if (typeof source === 'string') {
    // If it's already a full URL
    if (isValidUrl(source)) {
      return source;
    }
    
    // If it's a local path
    if (isLocalPath(source)) {
      return source;
    }
    
    // If it's a Sanity asset ID (starts with "image-")
    if (source.startsWith('image-')) {
      try {
        const imageUrl = urlForImage(source)?.url();
        return imageUrl || fallbackUrl;
      } catch (error) {
        console.error('Error resolving Sanity image ID:', error);
        return fallbackUrl;
      }
    }
    
    // Default to fallback for other strings
    return fallbackUrl;
  }

  // Handle Sanity image references
  if (isSanityImageReference(source)) {
    try {
      const imageUrl = urlForImage(source)?.url();
      return imageUrl || fallbackUrl;
    } catch (error) {
      console.error('Error resolving Sanity image reference:', error);
      return fallbackUrl;
    }
  }

  // Handle objects with url property (like already resolved Sanity images)
  if (typeof source === 'object' && 'url' in source && typeof source.url === 'string') {
    return source.url;
  }

  // Default to fallback
  return fallbackUrl;
};

/**
 * Debug function to log information about an image source
 * Useful for diagnosing image loading issues
 */
export const debugImageSource = (
  source: any,
  label: string = 'Image Source'
): void => {
  console.group(`Debug: ${label}`);
  console.log('Source:', source);
  console.log('Type:', typeof source);
  
  if (typeof source === 'string') {
    console.log('Is URL:', isValidUrl(source));
    console.log('Is local path:', isLocalPath(source));
    console.log('Is Sanity ID:', source.startsWith('image-'));
  } else if (typeof source === 'object' && source !== null) {
    console.log('Keys:', Object.keys(source));
    console.log('Is Sanity reference:', isSanityImageReference(source));
    
    if ('_type' in source) {
      console.log('_type:', source._type);
    }
    
    if ('asset' in source) {
      console.log('asset:', source.asset);
    }
    
    if ('url' in source) {
      console.log('url:', source.url);
    }
  }
  
  try {
    const resolved = resolveImageUrl(source);
    console.log('Resolved URL:', resolved);
  } catch (error) {
    console.error('Error resolving URL:', error);
  }
  
  console.groupEnd();
}; 