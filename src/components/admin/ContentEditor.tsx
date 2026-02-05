"use client";

import { useState } from 'react';

export interface ContentSection {
    [key: string]: string | number | boolean | ContentSection | ContentSection[];
}

interface ContentEditorProps {
    content: ContentSection;
    onSave: (updatedContent: ContentSection) => Promise<void>;
    saving: boolean;
    sectionTitle: string;
}

export default function ContentEditor({
    content,
    onSave,
    saving,
    sectionTitle
}: ContentEditorProps) {
    const [editedContent, setEditedContent] = useState<ContentSection>(content);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const toggleSection = (path: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedSections(newExpanded);
    };

    const updateValue = (path: string[], value: string | number | boolean) => {
        const newContent = JSON.parse(JSON.stringify(editedContent));
        let current: any = newContent;

        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }

        current[path[path.length - 1]] = value;
        setEditedContent(newContent);
    };

    const renderField = (key: string, value: any, path: string[] = []): React.ReactElement => {
        const currentPath = [...path, key];
        const pathString = currentPath.join('.');

        // Handle primitive values
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return (
                <div key={pathString} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    {typeof value === 'boolean' ? (
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateValue(currentPath, e.target.checked)}
                            className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
                        />
                    ) : typeof value === 'string' && value.length > 100 ? (
                        <textarea
                            value={value}
                            onChange={(e) => updateValue(currentPath, e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
                        />
                    ) : (
                        <input
                            type={typeof value === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={(e) => updateValue(currentPath, typeof value === 'number' ? Number(e.target.value) : e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
                        />
                    )}
                </div>
            );
        }

        // Handle arrays
        if (Array.isArray(value)) {
            return (
                <div key={pathString} className="mb-6 border border-gray-200 rounded-lg p-4">
                    <button
                        onClick={() => toggleSection(pathString)}
                        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2"
                    >
                        <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ({value.length} items)</span>
                        <span className="text-gray-500">{expandedSections.has(pathString) ? '▼' : '▶'}</span>
                    </button>
                    {expandedSections.has(pathString) && (
                        <div className="space-y-4 mt-4">
                            {value.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-3">Item {index + 1}</h4>
                                    {typeof item === 'object' && item !== null ? (
                                        Object.entries(item).map(([itemKey, itemValue]) =>
                                            renderField(itemKey, itemValue, [...currentPath, String(index)])
                                        )
                                    ) : (
                                        renderField(String(index), item, currentPath)
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Handle objects
        if (typeof value === 'object' && value !== null) {
            return (
                <div key={pathString} className="mb-6 border border-gray-200 rounded-lg p-4">
                    <button
                        onClick={() => toggleSection(pathString)}
                        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-2"
                    >
                        <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        <span className="text-gray-500">{expandedSections.has(pathString) ? '▼' : '▶'}</span>
                    </button>
                    {expandedSections.has(pathString) && (
                        <div className="space-y-4 mt-4">
                            {Object.entries(value).map(([subKey, subValue]) =>
                                renderField(subKey, subValue, currentPath)
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return <div key={pathString}></div>;
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
                <button
                    onClick={() => onSave(editedContent)}
                    disabled={saving}
                    className="bg-[#d97706] hover:bg-[#b45309] disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-4">
                {Object.entries(editedContent).map(([key, value]) =>
                    renderField(key, value)
                )}
            </div>
        </div>
    );
}
