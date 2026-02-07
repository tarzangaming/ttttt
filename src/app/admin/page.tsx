"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import AdminImagePlaceholder from '@/components/admin/AdminImagePlaceholder';
import ServiceImageManager from '@/components/admin/ServiceImageManager';
import ContentEditor from '@/components/admin/ContentEditor';
import SEOEditor from '@/components/admin/SEOEditor';
import RebrandEditor from '@/components/admin/RebrandEditor';

interface JsonFile {
    name: string;
    exists: boolean;
    size: number;
    modified: string | null;
    category: string;
}

interface FileData {
    fileName: string;
    data: Record<string, unknown>;
    modified: string;
}

interface ImageItem {
    key: string;
    alt: string;
    url: string;
    placeholder?: string;
}

interface ImageSection {
    sectionName: string;
    sectionKey: string;
    images: { imageKey: string; image: ImageItem }[];
}

type TabType = 'json' | 'images' | 'add-images' | 'service-images' | 'main-content' | 'location-content' | 'seo' | 'rebrand';

interface Service {
    slug: string;
    title: string;
    icon: string;
    category: string;
}

// Available categories for new images
const IMAGE_CATEGORIES = [
    { value: 'gallery.droneShots', label: 'Gallery - Drone Shots' },
    { value: 'gallery.residential', label: 'Gallery - Residential' },
    { value: 'gallery.commercial', label: 'Gallery - Commercial' },
    { value: 'gallery.team', label: 'Gallery - Team' },
    { value: 'gallery.workers', label: 'Gallery - Workers' },
    { value: 'gallery.projects', label: 'Gallery - Projects' },
    { value: 'gallery.lifestyle', label: 'Gallery - Lifestyle' },
    { value: 'gallery.weather', label: 'Gallery - Weather' },
    { value: 'gallery.minimalist', label: 'Gallery - Minimalist' },
    { value: 'gallery.luxury', label: 'Gallery - Luxury' },
    { value: 'heroGallery', label: 'Hero Gallery (Rotating)' },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>('service-images');
    const [files, setFiles] = useState<JsonFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [editContent, setEditContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isValidJson, setIsValidJson] = useState(true);

    // Image selector state
    const [imagesData, setImagesData] = useState<Record<string, unknown> | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [allGalleryImages, setAllGalleryImages] = useState<ImageItem[]>([]);

    // Add new image state
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageAlt, setNewImageAlt] = useState('');
    const [newImageCategory, setNewImageCategory] = useState('gallery.projects');
    const [bulkUrls, setBulkUrls] = useState('');
    const [bulkCategory, setBulkCategory] = useState('gallery.projects');

    // Unused images (duplicates) state
    const [unusedCount, setUnusedCount] = useState<number | null>(null);
    const [unusedLoading, setUnusedLoading] = useState(false);
    const [removeUnusedLoading, setRemoveUnusedLoading] = useState(false);

    // Service images state
    const [services, setServices] = useState<Service[]>([]);
    const [serviceImages, setServiceImages] = useState<Record<string, ImageItem>>({});

    // Content management state
    const [mainContent, setMainContent] = useState<any>(null);
    const [locationContent, setLocationContent] = useState<any>(null);
    const [seoData, setSeoData] = useState<any>(null);

    useEffect(() => {
        fetchFiles();
        loadImagesData();
        loadServicesData();
        loadContentData();
        loadSeoData();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/admin/json');
            const data = await response.json();
            if (data.success) {
                setFiles(data.files);
            }
        } catch (error) {
            console.error('Failed to fetch files:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadImagesData = async () => {
        try {
            const response = await fetch('/api/admin/json?file=images.json');
            const data = await response.json();
            if (data.success) {
                setImagesData(data.data.images);
                // Extract all gallery images for the picker
                const gallery = data.data.images?.gallery || {};
                const allImages: ImageItem[] = [];
                Object.values(gallery).forEach((category: unknown) => {
                    if (Array.isArray(category)) {
                        category.forEach((img: ImageItem) => {
                            if (img.url) allImages.push(img);
                        });
                    }
                });
                // Also add hero gallery images
                const heroGallery = data.data.images?.heroGallery || [];
                heroGallery.forEach((img: ImageItem) => {
                    if (img.url && !allImages.find(i => i.url === img.url)) {
                        allImages.push(img);
                    }
                });
                setAllGalleryImages(allImages);

                // Extract service images
                const servImages = data.data.images?.services || {};
                setServiceImages(servImages as Record<string, ImageItem>);
            }
        } catch (error) {
            console.error('Failed to load images:', error);
        }
    };

    const loadServicesData = async () => {
        try {
            const response = await fetch('/api/admin/json?file=services.json');
            const data = await response.json();
            if (data.success) {
                const servicesList = data.data.services || [];
                setServices(servicesList.map((s: any) => ({
                    slug: s.slug,
                    title: s.title,
                    icon: s.icon,
                    category: s.category
                })));
            }
        } catch (error) {
            console.error('Failed to load services:', error);
        }
    };

    const loadSeoData = async () => {
        try {
            const response = await fetch('/api/admin/json?file=seo.json');
            const data = await response.json();
            if (data.success && data.data) {
                setSeoData(data.data);
            } else {
                setSeoData({ defaults: {}, pages: {}, templates: {} });
            }
        } catch (error) {
            console.error('Failed to load SEO data:', error);
            setSeoData({ defaults: {}, pages: {}, templates: {} });
        }
    };

    const saveSeoData = async (updated: any) => {
        setSaving(true);
        setMessage(null);
        try {
            const response = await fetch('/api/admin/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: 'seo.json', data: updated })
            });
            const result = await response.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'SEO settings saved successfully!' });
                loadSeoData();
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            console.error('Failed to save SEO:', error);
            setMessage({ type: 'error', text: 'Failed to save SEO settings' });
        } finally {
            setSaving(false);
        }
    };

    const loadContentData = async () => {
        try {
            const response = await fetch('/api/admin/json?file=content.json');
            const data = await response.json();
            if (data.success && data.data) {
                setMainContent(data.data.mainWebsite ?? { homepage: {}, about: {}, contact: {} });
                setLocationContent(data.data.locationPages ?? { hero: {}, whyChooseUs: {}, features: [], cta: {} });
            } else {
                setMainContent({ homepage: {}, about: {}, contact: {} });
                setLocationContent({ hero: {}, whyChooseUs: {}, features: [], cta: {} });
            }
        } catch (error) {
            console.error('Failed to load content:', error);
            setMainContent({ homepage: {}, about: {}, contact: {} });
            setLocationContent({ hero: {}, whyChooseUs: {}, features: [], cta: {} });
        }
    };

    const loadFile = async (fileName: string) => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`/api/admin/json?file=${fileName}`);
            const data = await response.json();
            if (data.success) {
                setFileData(data);
                setEditContent(JSON.stringify(data.data, null, 2));
                setSelectedFile(fileName);
                setIsValidJson(true);
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            console.error('Failed to load file:', error);
            setMessage({ type: 'error', text: 'Failed to load file' });
        } finally {
            setLoading(false);
        }
    };

    const validateJson = (content: string) => {
        try {
            JSON.parse(content);
            setIsValidJson(true);
            return true;
        } catch {
            setIsValidJson(false);
            return false;
        }
    };

    const handleContentChange = (content: string) => {
        setEditContent(content);
        validateJson(content);
    };

    const saveFile = async () => {
        if (!selectedFile || !isValidJson) return;

        setSaving(true);
        setMessage(null);

        try {
            const data = JSON.parse(editContent);
            const response = await fetch('/api/admin/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: selectedFile, data })
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'File saved successfully!' });
                fetchFiles();
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            console.error('Failed to save file:', error);
            setMessage({ type: 'error', text: 'Failed to save file' });
        } finally {
            setSaving(false);
        }
    };

    const saveImageSelection = async (sectionKey: string, imageKey: string, newUrl: string) => {
        setSaving(true);
        setMessage(null);

        try {
            // Fetch current images.json
            const response = await fetch('/api/admin/json?file=images.json');
            const data = await response.json();

            if (data.success) {
                // Update the specific image URL
                const images = data.data.images;
                if (images[sectionKey] && images[sectionKey][imageKey]) {
                    images[sectionKey][imageKey].url = newUrl;
                }

                // Save back
                const saveResponse = await fetch('/api/admin/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: 'images.json', data: { images } })
                });

                const result = await saveResponse.json();

                if (result.success) {
                    setMessage({ type: 'success', text: 'Image updated successfully!' });
                    loadImagesData(); // Refresh
                    setShowImagePicker(false);
                } else {
                    setMessage({ type: 'error', text: result.error });
                }
            }
        } catch (error) {
            console.error('Failed to save image:', error);
            setMessage({ type: 'error', text: 'Failed to save image' });
        } finally {
            setSaving(false);
        }
    };

    // Save service image selection
    const saveServiceImage = async (serviceSlug: string, newImageUrl: string) => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/json?file=images.json');
            const data = await response.json();

            if (data.success) {
                const images = data.data.images;
                if (!images.services) images.services = {};

                // Update or create service image
                if (!images.services[serviceSlug]) {
                    images.services[serviceSlug] = {
                        key: `service-${serviceSlug}`,
                        alt: `${serviceSlug} service`,
                        url: newImageUrl,
                        placeholder: images.defaults?.placeholder?.url || ''
                    };
                } else {
                    images.services[serviceSlug].url = newImageUrl;
                }

                const saveResponse = await fetch('/api/admin/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: 'images.json', data: { images } })
                });

                const result = await saveResponse.json();

                if (result.success) {
                    setMessage({ type: 'success', text: 'Service image updated successfully!' });
                    loadImagesData();
                } else {
                    setMessage({ type: 'error', text: result.error });
                }
            }
        } catch (error) {
            console.error('Failed to save service image:', error);
            setMessage({ type: 'error', text: 'Failed to save service image' });
        } finally {
            setSaving(false);
        }
    };

    // Save bulk service images
    const saveBulkServiceImages = async (updates: Record<string, string>) => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/json?file=images.json');
            const data = await response.json();

            if (data.success) {
                const images = data.data.images;
                if (!images.services) images.services = {};

                let updatedCount = 0;
                Object.entries(updates).forEach(([slug, url]) => {
                    // Check if image already exists to preserve other fields if possible
                    if (!images.services[slug]) {
                        images.services[slug] = {
                            key: `service-${slug}`,
                            alt: `${slug.replace(/-/g, ' ')} service`,
                            url: url,
                            placeholder: images.defaults?.placeholder?.url || ''
                        };
                    } else {
                        images.services[slug].url = url;
                    }
                    updatedCount++;
                });

                const saveResponse = await fetch('/api/admin/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: 'images.json', data: { images } })
                });

                const result = await saveResponse.json();

                if (result.success) {
                    setMessage({ type: 'success', text: `Successfully auto-matched ${updatedCount} service images!` });
                    loadImagesData();
                } else {
                    setMessage({ type: 'error', text: result.error });
                }
            }
        } catch (error) {
            console.error('Failed to save bulk images:', error);
            setMessage({ type: 'error', text: 'Failed to save bulk images' });
        } finally {
            setSaving(false);
        }
    };

    // Save content (main or location)
    const saveContent = async (contentType: 'mainWebsite' | 'locationPages', updatedContent: any) => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/json?file=content.json');
            const data = await response.json();

            if (data.success) {
                const content = data.data;
                content[contentType] = updatedContent;

                const saveResponse = await fetch('/api/admin/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: 'content.json', data: content })
                });

                const result = await saveResponse.json();

                if (result.success) {
                    setMessage({ type: 'success', text: 'Content saved successfully!' });
                    loadContentData();
                } else {
                    setMessage({ type: 'error', text: result.error });
                }
            }
        } catch (error) {
            console.error('Failed to save content:', error);
            setMessage({ type: 'error', text: 'Failed to save content' });
        } finally {
            setSaving(false);
        }
    };

    // Add single new image
    const addNewImage = async () => {
        if (!newImageUrl.trim()) {
            setMessage({ type: 'error', text: 'Please enter an image URL' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/json?file=images.json');
            const data = await response.json();

            if (data.success) {
                const images = data.data.images;
                const [category, subcategory] = newImageCategory.split('.');

                const newImage: ImageItem = {
                    key: `img-${Date.now()}`,
                    alt: newImageAlt || 'New image',
                    url: newImageUrl.trim(),
                    placeholder: images.defaults?.placeholder?.url || ''
                };

                if (category === 'heroGallery') {
                    if (!images.heroGallery) images.heroGallery = [];
                    images.heroGallery.push(newImage);
                } else if (category === 'gallery' && subcategory) {
                    if (!images.gallery) images.gallery = {};
                    if (!images.gallery[subcategory]) images.gallery[subcategory] = [];
                    images.gallery[subcategory].push(newImage);
                }

                const saveResponse = await fetch('/api/admin/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: 'images.json', data: { images } })
                });

                const result = await saveResponse.json();

                if (result.success) {
                    setMessage({ type: 'success', text: 'Image added successfully!' });
                    setNewImageUrl('');
                    setNewImageAlt('');
                    loadImagesData();
                } else {
                    setMessage({ type: 'error', text: result.error });
                }
            }
        } catch (error) {
            console.error('Failed to add image:', error);
            setMessage({ type: 'error', text: 'Failed to add image' });
        } finally {
            setSaving(false);
        }
    };

    // Smart URL extraction from any text format
    const extractUrlsFromText = (text: string): string[] => {
        // Regex to match URLs (http, https, and common image hosting patterns)
        const urlRegex = /https?:\/\/[^\s<>"'`,;)}\]]+\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?[^\s<>"'`,;)}\]]*)?|https?:\/\/ik\.imagekit\.io\/[^\s<>"'`,;)}\]]+|https?:\/\/[^\s<>"'`,;)}\]]+\/[^\s<>"'`,;)}\]]*\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?[^\s<>"'`,;)}\]]*)?/gi;

        // Also match any URL that looks like an image URL (general pattern)
        const generalUrlRegex = /https?:\/\/[^\s<>"'`,;)}\]]+/gi;

        // First try to extract image-specific URLs
        let matches: string[] = text.match(urlRegex) || [];

        // If no image URLs found, try general URLs (for CDN links that don't have extensions)
        if (matches.length === 0) {
            const generalMatches: string[] = text.match(generalUrlRegex) || [];
            // Filter to likely image URLs (imagekit, cloudinary, imgix, etc.)
            matches = generalMatches.filter(url =>
                url.includes('imagekit.io') ||
                url.includes('cloudinary.com') ||
                url.includes('imgix.net') ||
                url.includes('unsplash.com') ||
                url.includes('pexels.com') ||
                url.includes('pixabay.com') ||
                url.includes('imgur.com') ||
                url.includes('images.') ||
                url.includes('/images/') ||
                url.includes('cdn.') ||
                /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)/i.test(url)
            );
        }

        // Clean up URLs (remove trailing punctuation that might have been included)
        return [...new Set(matches.map(url => url.replace(/[.,;:!?)}\]]+$/, '').trim()))];
    };

    // Get all existing image URLs from the gallery
    const getAllExistingUrls = (images: Record<string, unknown>): Set<string> => {
        const existingUrls = new Set<string>();

        // Add hero gallery URLs
        if (images.heroGallery && Array.isArray(images.heroGallery)) {
            images.heroGallery.forEach((img: ImageItem) => {
                if (img.url) existingUrls.add(img.url);
            });
        }

        // Add gallery URLs
        if (images.gallery && typeof images.gallery === 'object') {
            Object.values(images.gallery as Record<string, ImageItem[]>).forEach(category => {
                if (Array.isArray(category)) {
                    category.forEach((img: ImageItem) => {
                        if (img.url) existingUrls.add(img.url);
                    });
                }
            });
        }

        // Add section images (hero, services, about, cta, trust, defaults)
        ['hero', 'services', 'about', 'cta', 'trust', 'defaults'].forEach(section => {
            const sectionData = images[section];
            if (sectionData && typeof sectionData === 'object') {
                Object.values(sectionData as Record<string, ImageItem>).forEach(img => {
                    if (img && typeof img === 'object' && 'url' in img) {
                        existingUrls.add((img as ImageItem).url);
                    }
                });
            }
        });

        return existingUrls;
    };

    // Add multiple images from bulk URLs with smart detection
    const addBulkImages = async () => {
        // Extract URLs from any text format
        const extractedUrls = extractUrlsFromText(bulkUrls);

        if (extractedUrls.length === 0) {
            setMessage({ type: 'error', text: 'No valid image URLs detected. Please paste URLs or text containing image links.' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/json?file=images.json');
            const data = await response.json();

            if (data.success) {
                const images = data.data.images;
                const [category, subcategory] = bulkCategory.split('.');

                // Get all existing URLs to avoid duplicates
                const existingUrls = getAllExistingUrls(images);

                // Filter out already existing URLs
                const newUrls = extractedUrls.filter(url => !existingUrls.has(url));
                const skippedCount = extractedUrls.length - newUrls.length;

                if (newUrls.length === 0) {
                    setMessage({ type: 'error', text: `All ${extractedUrls.length} URLs already exist in the gallery. No new images to add.` });
                    setSaving(false);
                    return;
                }

                newUrls.forEach((url, index) => {
                    const newImage: ImageItem = {
                        key: `img-${Date.now()}-${index}`,
                        alt: `Image ${index + 1}`,
                        url: url,
                        placeholder: images.defaults?.placeholder?.url || ''
                    };

                    if (category === 'heroGallery') {
                        if (!images.heroGallery) images.heroGallery = [];
                        images.heroGallery.push(newImage);
                    } else if (category === 'gallery' && subcategory) {
                        if (!images.gallery) images.gallery = {};
                        if (!images.gallery[subcategory]) images.gallery[subcategory] = [];
                        images.gallery[subcategory].push(newImage);
                    }
                });

                const saveResponse = await fetch('/api/admin/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: 'images.json', data: { images } })
                });

                const result = await saveResponse.json();

                if (result.success) {
                    let successMessage = `✅ ${newUrls.length} new image${newUrls.length === 1 ? '' : 's'} added successfully!`;
                    if (skippedCount > 0) {
                        successMessage += ` ⏭️ ${skippedCount} duplicate${skippedCount === 1 ? '' : 's'} skipped.`;
                    }
                    setMessage({ type: 'success', text: successMessage });
                    setBulkUrls('');
                    loadImagesData();
                } else {
                    setMessage({ type: 'error', text: result.error });
                }
            }
        } catch (error) {
            console.error('Failed to add images:', error);
            setMessage({ type: 'error', text: 'Failed to add images' });
        } finally {
            setSaving(false);
        }
    };

    const checkUnusedImages = async () => {
        setUnusedLoading(true);
        setUnusedCount(null);
        try {
            const res = await fetch('/api/admin/images/unused');
            const data = await res.json();
            if (data.success) setUnusedCount(data.count ?? 0);
        } catch {
            setMessage({ type: 'error', text: 'Failed to check for unused images' });
        } finally {
            setUnusedLoading(false);
        }
    };

    const removeUnusedImages = async () => {
        if (unusedCount === null || unusedCount === 0) return;
        if (!confirm(`Remove ${unusedCount} duplicate image(s) from the gallery? This cannot be undone (a backup will be saved).`)) return;
        setRemoveUnusedLoading(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/images/unused', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: data.message || `Removed ${data.removed} image(s).` });
                setUnusedCount(0);
                loadImagesData();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to remove' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to remove unused images' });
        } finally {
            setRemoveUnusedLoading(false);
        }
    };

    // Delete an image from gallery
    const deleteGalleryImage = async (categoryPath: string, imageIndex: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/json?file=images.json');
            const data = await response.json();

            if (data.success) {
                const images = data.data.images;
                const [category, subcategory] = categoryPath.split('.');

                if (category === 'heroGallery') {
                    images.heroGallery.splice(imageIndex, 1);
                } else if (category === 'gallery' && subcategory && images.gallery[subcategory]) {
                    images.gallery[subcategory].splice(imageIndex, 1);
                }

                const saveResponse = await fetch('/api/admin/json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: 'images.json', data: { images } })
                });

                const result = await saveResponse.json();

                if (result.success) {
                    setMessage({ type: 'success', text: 'Image deleted successfully!' });
                    loadImagesData();
                } else {
                    setMessage({ type: 'error', text: result.error });
                }
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
            setMessage({ type: 'error', text: 'Failed to delete image' });
        } finally {
            setSaving(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    // Parse images into sections for display
    const getImageSections = (): ImageSection[] => {
        if (!imagesData) return [];

        const sections: ImageSection[] = [];
        const sectionLabels: Record<string, string> = {
            hero: '🏠 Hero Section Images',
            services: '🔧 Service Images',
            about: '👥 About Section Images',
            cta: '📢 Call-to-Action Images',
            trust: '🏆 Trust Badge Images',
            defaults: '⚙️ Default Images'
        };

        Object.entries(imagesData).forEach(([key, value]) => {
            if (key === 'gallery' || key === 'heroGallery' || key === 'video') return;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const images: { imageKey: string; image: ImageItem }[] = [];
                Object.entries(value as Record<string, ImageItem>).forEach(([imgKey, imgValue]) => {
                    if (imgValue && typeof imgValue === 'object' && 'url' in imgValue) {
                        images.push({ imageKey: imgKey, image: imgValue as ImageItem });
                    }
                });
                if (images.length > 0) {
                    sections.push({
                        sectionName: sectionLabels[key] || key,
                        sectionKey: key,
                        images
                    });
                }
            }
        });

        return sections;
    };

    // Get gallery sections for the add images tab
    const getGallerySections = () => {
        if (!imagesData) return [];
        const gallery = (imagesData as { gallery?: Record<string, ImageItem[]> }).gallery || {};
        return Object.entries(gallery).map(([key, images]) => ({
            key: `gallery.${key}`,
            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            images: images || []
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-[#1e3a5f] text-white py-4 px-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm opacity-80">Manage site content & images</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                            Logout
                        </button>
                        <Link
                            href="/"
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                        >
                            ← Back to Site
                        </Link>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md inline-flex">
                    <button
                        onClick={() => setActiveTab('service-images')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'service-images'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🎨 Service Images
                    </button>
                    <button
                        onClick={() => setActiveTab('main-content')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'main-content'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        📄 Main Content
                    </button>
                    <button
                        onClick={() => setActiveTab('location-content')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'location-content'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        📍 Location Content
                    </button>
                    <button
                        onClick={() => setActiveTab('seo')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'seo'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🔍 SEO
                    </button>
                    <button
                        onClick={() => setActiveTab('images')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'images'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🖼️ Image Selector
                    </button>
                    <button
                        onClick={() => setActiveTab('add-images')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'add-images'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        ➕ Add Images
                    </button>
                    <button
                        onClick={() => setActiveTab('json')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'json'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        📝 JSON Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('rebrand')}
                        className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'rebrand'
                            ? 'bg-[#1e3a5f] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🔄 Rebrand
                    </button>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="max-w-7xl mx-auto px-6 pt-4">
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {message.text}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto p-6">
                {/* Service Images Tab */}
                {activeTab === 'service-images' && (
                    <ServiceImageManager
                        services={services}
                        serviceImages={serviceImages}
                        allGalleryImages={allGalleryImages}
                        onImageSelect={saveServiceImage}
                        onBulkImageSelect={saveBulkServiceImages}
                        saving={saving}
                    />
                )}

                {/* Main Content Tab */}
                {activeTab === 'main-content' && (
                    <div className="space-y-6">
                        {mainContent && Object.keys((mainContent as any)?.homepage ?? {}).length > 0 ? (
                        <>
                        <ContentEditor
                            content={mainContent.homepage || {}}
                            onSave={(updated) => saveContent('mainWebsite', { ...mainContent, homepage: updated })}
                            saving={saving}
                            sectionTitle="📄 Homepage Content"
                        />
                        <ContentEditor
                            content={mainContent.about || {}}
                            onSave={(updated) => saveContent('mainWebsite', { ...mainContent, about: updated })}
                            saving={saving}
                            sectionTitle="👥 About Page Content"
                        />
                        <ContentEditor
                            content={mainContent.contact || {}}
                            onSave={(updated) => saveContent('mainWebsite', { ...mainContent, contact: updated })}
                            saving={saving}
                            sectionTitle="📞 Contact Page Content"
                        />
                        </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Main Content Yet</h3>
                                <p className="text-gray-600 mb-6">Load content from content.json or edit via the JSON Editor tab.</p>
                                <button
                                    onClick={loadContentData}
                                    className="bg-[#1e3a5f] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#2d5a8a] transition"
                                >
                                    Refresh Content
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Rebrand Tab */}
                {activeTab === 'rebrand' && (
                    <RebrandEditor onComplete={() => { loadContentData(); loadSeoData(); fetchFiles(); }} />
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <SEOEditor
                        seoData={seoData}
                        onSave={saveSeoData}
                        saving={saving}
                    />
                )}

                {/* Location Content Tab */}
                {activeTab === 'location-content' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-bold text-blue-900 mb-2">📍 Location Page Templates</h3>
                            <p className="text-blue-800 text-sm">
                                These templates are used for all location-specific pages. Use placeholders like <code className="bg-blue-100 px-2 py-1 rounded">{'{CITY}'}</code>, <code className="bg-blue-100 px-2 py-1 rounded">{'{STATE}'}</code>, and <code className="bg-blue-100 px-2 py-1 rounded">{'{PHONE}'}</code> which will be automatically replaced with location-specific data.
                            </p>
                        </div>
                        {locationContent && Object.keys(locationContent).length > 0 ? (
                        <ContentEditor
                            content={locationContent}
                            onSave={(updated) => saveContent('locationPages', updated)}
                            saving={saving}
                            sectionTitle="📍 Location Pages Content Templates"
                        />
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Location Content Yet</h3>
                                <p className="text-gray-600 mb-6">Load content from content.json or edit via the JSON Editor tab.</p>
                                <button
                                    onClick={loadContentData}
                                    className="bg-[#1e3a5f] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#2d5a8a] transition"
                                >
                                    Refresh Content
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Images Tab */}
                {activeTab === 'add-images' && (
                    <div className="space-y-8">
                        {/* Add Single Image */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Add Single Image</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                                    <input
                                        type="url"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="https://ik.imagekit.io/..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text (Description)</label>
                                    <input
                                        type="text"
                                        value={newImageAlt}
                                        onChange={(e) => setNewImageAlt(e.target.value)}
                                        placeholder="Describe the image"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={newImageCategory}
                                        onChange={(e) => setNewImageCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
                                    >
                                        {IMAGE_CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={addNewImage}
                                        disabled={saving || !newImageUrl.trim()}
                                        className="w-full bg-[#d97706] hover:bg-[#b45309] disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition"
                                    >
                                        {saving ? 'Adding...' : 'Add Image'}
                                    </button>
                                </div>
                            </div>
                            {newImageUrl && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">URL added (no preview to save bandwidth):</p>
                                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                                        <AdminImagePlaceholder url={newImageUrl} alt="New image" fill />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bulk Add Images */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">📦 Smart Bulk Add Images</h2>
                            <p className="text-gray-600 mb-4">
                                Paste any text containing image URLs - we&apos;ll automatically extract and add them.
                                <span className="text-green-600 font-medium"> Duplicates are automatically skipped!</span>
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Paste URLs or text containing image links</label>
                                    <textarea
                                        value={bulkUrls}
                                        onChange={(e) => setBulkUrls(e.target.value)}
                                        placeholder="Paste anything here! Can be:&#10;- URLs one per line&#10;- HTML with image sources&#10;- JSON data&#10;- Any text containing image URLs&#10;&#10;Example:&#10;https://ik.imagekit.io/image1.png&#10;Check out this image: https://example.com/photo.jpg"
                                        rows={10}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category for all images</label>
                                    <select
                                        value={bulkCategory}
                                        onChange={(e) => setBulkCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none mb-4"
                                    >
                                        {IMAGE_CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>

                                    {/* Smart Detection Info */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">🔍</span>
                                            <span className="font-medium text-gray-700">Smart Detection</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {bulkUrls.trim() ? (
                                                <>
                                                    <span className="font-bold text-[#1e3a5f]">
                                                        {extractUrlsFromText(bulkUrls).length}
                                                    </span>
                                                    {' '}image URL{extractUrlsFromText(bulkUrls).length !== 1 ? 's' : ''} detected
                                                </>
                                            ) : (
                                                'Paste text to detect URLs'
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supports: ImageKit, Cloudinary, Unsplash, Pexels, and more
                                        </p>
                                    </div>

                                    <button
                                        onClick={addBulkImages}
                                        disabled={saving || !bulkUrls.trim()}
                                        className="w-full bg-[#1e3a5f] hover:bg-[#2d5a8a] disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition"
                                    >
                                        {saving ? 'Adding...' : 'Add All New Images'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bulk remove unused (duplicate) images */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">🧹 Bulk Remove Unused Images</h2>
                            <p className="text-gray-600 mb-4 text-sm">
                                Removes duplicate image entries (same URL appearing more than once in Hero Gallery or Gallery categories). No requests are made to the image server; only the JSON is cleaned.
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={checkUnusedImages}
                                    disabled={unusedLoading}
                                    className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                                >
                                    {unusedLoading ? 'Checking…' : 'Check for duplicates'}
                                </button>
                                {unusedCount !== null && (
                                    <>
                                        <span className="text-gray-600 text-sm">
                                            {unusedCount === 0
                                                ? 'No duplicate images found.'
                                                : `${unusedCount} duplicate image(s) can be removed.`}
                                        </span>
                                        {unusedCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={removeUnusedImages}
                                                disabled={removeUnusedLoading}
                                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition"
                                            >
                                                {removeUnusedLoading ? 'Removing…' : `Remove ${unusedCount} unused`}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Manage Gallery Images */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">🗂️ Manage Gallery Images</h2>
                            <p className="text-gray-600 mb-6">View and delete images from your galleries. Click the X to remove an image.</p>

                            {/* Hero Gallery */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Hero Gallery</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {((imagesData as { heroGallery?: ImageItem[] })?.heroGallery || []).map((img, idx) => (
                                        <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                                            <AdminImagePlaceholder
                                                url={img.url}
                                                alt={img.alt || 'Hero image'}
                                                fill
                                                size="sm"
                                            />
                                            <button
                                                onClick={() => deleteGalleryImage('heroGallery', idx)}
                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Other Gallery Categories */}
                            {getGallerySections().map((section) => (
                                <div key={section.key} className="mb-8">
                                    <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">{section.name}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {section.images.map((img, idx) => (
                                            <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                                                <AdminImagePlaceholder
                                                    url={img.url}
                                                    alt={img.alt || 'Gallery image'}
                                                    fill
                                                    size="sm"
                                                />
                                                <button
                                                    onClick={() => deleteGalleryImage(section.key, idx)}
                                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {section.images.length === 0 && (
                                            <p className="text-gray-400 text-sm col-span-full">No images in this category</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Selector Tab */}
                {activeTab === 'images' && (
                    <div className="space-y-8">
                        {/* All Available Images Gallery */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">📷 All Available Images ({allGalleryImages.length})</h2>
                            <p className="text-gray-600 mb-4 text-sm">Browse all images in your gallery. Click on a section below to change its image.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                                {allGalleryImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#d97706] transition cursor-pointer group">
                                        <AdminImagePlaceholder
                                            url={img.url}
                                            alt={img.alt || 'Gallery image'}
                                            fill
                                            size="sm"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <span className="text-white text-xs text-center px-1">{img.alt?.substring(0, 30) || 'Image'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section-based Image Selection */}
                        {getImageSections().map((section) => (
                            <div key={section.sectionKey} className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">{section.sectionName}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {section.images.map(({ imageKey, image }) => (
                                        <div key={imageKey} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-gray-200">
                                                {image.url ? (
                                                    <AdminImagePlaceholder
                                                        url={image.url}
                                                        alt={image.alt || imageKey}
                                                        fill
                                                        size="sm"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-gray-800 capitalize mb-1">
                                                {imageKey.replace(/-/g, ' ')}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3 truncate" title={image.alt}>
                                                {image.alt || 'No description'}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSelectedSection(section.sectionKey);
                                                    setSelectedImageKey(imageKey);
                                                    setShowImagePicker(true);
                                                }}
                                                className="w-full bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white text-sm py-2 px-4 rounded-lg transition"
                                            >
                                                Change Image
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Hero Gallery Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">🎠 Hero Gallery (Rotating Images)</h2>
                            <p className="text-gray-600 mb-4 text-sm">These images rotate in the hero section carousel.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                {(imagesData as { heroGallery?: ImageItem[] })?.heroGallery?.map((img, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                                        <AdminImagePlaceholder
                                            url={img.url}
                                            alt={img.alt || `Hero image ${idx + 1}`}
                                            fill
                                            size="sm"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                                            {idx + 1}. {img.alt?.substring(0, 25) || 'Hero image'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* JSON Editor Tab */}
                {activeTab === 'json' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* File List Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">JSON Files</h2>

                                {loading && !files.length ? (
                                    <p className="text-gray-500">Loading...</p>
                                ) : (
                                    <div className="space-y-2">
                                        {files.map((file) => (
                                            <button
                                                key={file.name}
                                                onClick={() => loadFile(file.name)}
                                                className={`w-full text-left p-3 rounded-lg transition ${selectedFile === file.name
                                                    ? 'bg-[#1e3a5f] text-white'
                                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                <div className="font-medium">{file.name}</div>
                                                <div className={`text-xs ${selectedFile === file.name ? 'opacity-80' : 'text-gray-500'}`}>
                                                    {file.category} • {formatFileSize(file.size)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="lg:col-span-3">
                            {selectedFile ? (
                                <div className="bg-white rounded-xl shadow-md">
                                    {/* Editor Header */}
                                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">{selectedFile}</h2>
                                            {fileData && (
                                                <p className="text-sm text-gray-500">
                                                    Last modified: {formatDate(fileData.modified)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {!isValidJson && (
                                                <span className="text-red-600 text-sm font-medium">
                                                    ⚠ Invalid JSON
                                                </span>
                                            )}
                                            <button
                                                onClick={saveFile}
                                                disabled={saving || !isValidJson}
                                                className={`px-6 py-2 rounded-lg font-bold transition ${saving || !isValidJson
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-[#d97706] hover:bg-[#b45309] text-white'
                                                    }`}
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Editor */}
                                    <div className="p-4">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => handleContentChange(e.target.value)}
                                            className={`w-full h-[600px] font-mono text-sm p-4 border rounded-lg focus:outline-none focus:ring-2 ${isValidJson
                                                ? 'border-gray-300 focus:ring-[#1e3a5f]'
                                                : 'border-red-500 focus:ring-red-500 bg-red-50'
                                                }`}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                    <div className="text-6xl mb-4">📁</div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">Select a JSON File</h2>
                                    <p className="text-gray-600">
                                        Choose a file from the sidebar to view and edit its contents.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Picker Modal */}
            {showImagePicker && selectedSection && selectedImageKey && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                Select Image for: <span className="text-[#d97706] capitalize">{selectedImageKey.replace(/-/g, ' ')}</span>
                            </h3>
                            <button
                                onClick={() => setShowImagePicker(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {allGalleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => saveImageSelection(selectedSection, selectedImageKey, img.url)}
                                        disabled={saving}
                                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#d97706] transition group"
                                    >
                                        <AdminImagePlaceholder
                                            url={img.url}
                                            alt={img.alt || 'Gallery image'}
                                            fill
                                            size="sm"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <span className="bg-[#d97706] text-white px-4 py-2 rounded-lg font-medium">
                                                Select
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                                            {img.alt?.substring(0, 30) || 'Image'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
