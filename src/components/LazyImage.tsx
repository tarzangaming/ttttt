"use client";

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    onClick?: () => void;
    priority?: boolean;
    sizes?: string;
}

// Image cache to store loaded image URLs in memory
const imageCache = new Set<string>();

// Lazy loading image component with caching
const LazyImage = memo(function LazyImage({
    src,
    alt,
    width,
    height,
    fill = false,
    className = '',
    onClick,
    priority = false,
    sizes,
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
    const [isInView, setIsInView] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || isInView) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '200px', // Start loading 200px before entering viewport
                threshold: 0.01,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority, isInView]);

    // Handle image load
    const handleLoad = () => {
        imageCache.add(src);
        setIsLoaded(true);
    };

    // Handle image error
    const handleError = () => {
        setHasError(true);
    };

    return (
        <div
            ref={imgRef}
            className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}
            style={!fill && width && height ? { width, height } : undefined}
            onClick={onClick}
        >
            {/* Placeholder skeleton */}
            {!isLoaded && !hasError && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded"
                    style={{
                        backgroundColor: '#e5e7eb',
                    }}
                />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded">
                    <span className="text-gray-400 text-xs text-center px-2">
                        Failed to load
                    </span>
                </div>
            )}

            {/* Actual image - only load when in view */}
            {isInView && !hasError && (
                <Image
                    src={src}
                    alt={alt}
                    fill={fill}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? 'eager' : 'lazy'}
                    sizes={sizes}
                    unoptimized={false}
                />
            )}
        </div>
    );
});

export default LazyImage;

// Utility to preload images
export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (imageCache.has(src)) {
            resolve();
            return;
        }

        const img = new window.Image();
        img.onload = () => {
            imageCache.add(src);
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    });
};

// Utility to check if image is cached
export const isImageCached = (src: string): boolean => {
    return imageCache.has(src);
};

// Clear cache (useful for testing)
export const clearImageCache = (): void => {
    imageCache.clear();
};
