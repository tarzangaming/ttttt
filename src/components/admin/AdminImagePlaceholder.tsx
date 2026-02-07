"use client";

/**
 * Placeholder for images in the admin backend. Does NOT load the image URL,
 * so no bandwidth or requests are made to the image server.
 */
interface AdminImagePlaceholderProps {
    url: string;
    alt?: string;
    label?: string;
    className?: string;
    fill?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

function getFilename(url: string): string {
    try {
        const path = new URL(url).pathname;
        const segment = path.split('/').filter(Boolean).pop() || '';
        return decodeURIComponent(segment).slice(0, 32) || 'Image';
    } catch {
        return url.slice(0, 32) || 'Image';
    }
}

export default function AdminImagePlaceholder({
    url,
    alt,
    label,
    className = '',
    fill,
    size = 'md',
}: AdminImagePlaceholderProps) {
    const displayLabel = label ?? alt ?? getFilename(url);
    const sizeClasses = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

    return (
        <div
            className={`
                flex flex-col items-center justify-center bg-gray-100 border border-gray-200 rounded-lg overflow-hidden
                text-gray-500 ${fill ? 'absolute inset-0' : 'min-h-[80px]'} ${className}
            `}
            title={url}
        >
            <span className="text-2xl mb-1" aria-hidden>🖼️</span>
            <span className={`px-2 text-center truncate w-full ${sizeClasses}`}>
                {displayLabel}
            </span>
        </div>
    );
}
