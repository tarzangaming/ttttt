"use client";

import { useState } from 'react';
import AdminImagePlaceholder from '@/components/admin/AdminImagePlaceholder';

interface Service {
    slug: string;
    title: string;
    icon: string;
    category: string;
}

interface ImageItem {
    key: string;
    alt: string;
    url: string;
    placeholder?: string;
}

interface ServiceImageManagerProps {
    services: Service[];
    serviceImages: Record<string, ImageItem>;
    allGalleryImages: ImageItem[];
    onImageSelect: (serviceSlug: string, newImageUrl: string) => Promise<void>;
    onBulkImageSelect: (updates: Record<string, string>) => Promise<void>;
    saving: boolean;
}

export default function ServiceImageManager({
    services,
    serviceImages,
    allGalleryImages,
    onImageSelect,
    onBulkImageSelect,
    saving
}: ServiceImageManagerProps) {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelectImage = async (imageUrl: string) => {
        if (!selectedService) return;
        await onImageSelect(selectedService, imageUrl);
        setShowImagePicker(false);
        setSelectedService(null);
    };

    const filteredImages = allGalleryImages.filter(img =>
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAutoSelect = async () => {
        const updates: Record<string, string> = {};
        let matchCount = 0;

        services.forEach(service => {
            // Heuristic: Check if matching image exists in gallery
            // Match against slug (e.g. "roof-repair") or title (e.g. "Roof Repair")
            // Remove dashes for looser matching
            // 1. Exact phrase match (with spaces) - e.g. "roof repair"
            const cleanSlug = service.slug.replace(/-/g, ' ').toLowerCase();
            // 2. Token match - e.g. "roof" AND "repair" must be present
            const slugTokens = service.slug.split('-');
            const cleanTitle = service.title.toLowerCase();

            const match = allGalleryImages.find(img => {
                const imgStr = (img.url + ' ' + img.alt).toLowerCase();

                // Check if exact phrase exists
                if (imgStr.includes(cleanSlug)) return true;

                // Check if all tokens exist (more flexible)
                // e.g. "roof-repair" matches "repairing-house-roof.jpg"
                const allTokensMatch = slugTokens.every(token => imgStr.includes(token));
                if (allTokensMatch) return true;

                return imgStr.includes(cleanTitle);
            });

            // Only update if we found a match and it's different (or missing)
            if (match) {
                const current = serviceImages[service.slug];
                if (!current || current.url !== match.url) {
                    updates[service.slug] = match.url;
                    matchCount++;
                }
            }
        });

        if (matchCount > 0) {
            if (confirm(`Found ${matchCount} matching images based on service names. Apply them?`)) {
                await onBulkImageSelect(updates);
            }
        } else {
            alert('No improved matches found. Try adding more images to the gallery with relevant names.');
        }
    };

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    const categoryLabels: Record<string, string> = {
        roofing: '🏠 Roofing Services',
        exterior: '🏡 Exterior Services',
        construction: '🏗️ Construction Services'
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">🖼️ Service Card Images</h2>
                        <p className="text-gray-600">
                            Select images for each service card. These images will be displayed on service listing pages and location pages.
                        </p>
                    </div>
                    <button
                        onClick={handleAutoSelect}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
                    >
                        <span>✨</span> Auto Select Images
                    </button>
                </div>

                {Object.entries(groupedServices).map(([category, categoryServices]) => (
                    <div key={category} className="mb-8">
                        <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">
                            {categoryLabels[category] || category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryServices.map((service) => {
                                const currentImage = serviceImages[service.slug];
                                return (
                                    <div
                                        key={service.slug}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">{service.icon}</span>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{service.title}</h4>
                                                <p className="text-xs text-gray-500">{service.slug}</p>
                                            </div>
                                        </div>

                                        {/* Current image (no preview to save bandwidth) */}
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                                            {currentImage ? (
                                                <AdminImagePlaceholder
                                                    url={currentImage.url}
                                                    alt={currentImage.alt}
                                                    fill
                                                    size="sm"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <span className="text-sm">No image set</span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedService(service.slug);
                                                setShowImagePicker(true);
                                            }}
                                            className="w-full bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white font-medium py-2 px-4 rounded-lg transition text-sm"
                                        >
                                            {currentImage ? 'Change Image' : 'Select Image'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Picker Modal */}
            {showImagePicker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Select Image for {services.find(s => s.slug === selectedService)?.title}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowImagePicker(false);
                                        setSelectedService(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
                            />
                        </div>

                        {/* Image Grid */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectImage(img.url)}
                                        disabled={saving}
                                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#d97706] transition group disabled:opacity-50"
                                    >
                                        <AdminImagePlaceholder
                                            url={img.url}
                                            alt={img.alt}
                                            fill
                                            size="sm"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-sm">
                                                Select
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {filteredImages.length === 0 && (
                                <p className="text-center text-gray-400 py-12">
                                    No images found. Try a different search term.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
