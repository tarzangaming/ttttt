"use client";

import { useState } from 'react';
import ContentEditor, { type ContentSection } from './ContentEditor';

interface SEOEditorProps {
  seoData: {
    defaults?: Record<string, unknown>;
    pages?: Record<string, { title?: string; description?: string; keywords?: string[]; canonical?: string }>;
    templates?: Record<string, { title?: string; description?: string; canonical?: string }>;
  } | null;
  onSave: (updated: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}

export default function SEOEditor({ seoData, onSave, saving }: SEOEditorProps) {
  const [activeSection, setActiveSection] = useState<'defaults' | 'pages' | 'templates'>('defaults');

  const defaults = seoData?.defaults ?? {};
  const pages = seoData?.pages ?? {};
  const templates = seoData?.templates ?? {};

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-bold text-amber-900 mb-2">🔍 SEO Management</h3>
        <p className="text-amber-800 text-sm">
          Manage meta titles, descriptions, and canonical URLs for all pages. Dynamic templates use placeholders: <code className="bg-amber-100 px-1 rounded">{'{serviceTitle}'}</code>, <code className="bg-amber-100 px-1 rounded">{'{slug}'}</code>, <code className="bg-amber-100 px-1 rounded">{'{cityName}'}</code>, <code className="bg-amber-100 px-1 rounded">{'{state}'}</code>, <code className="bg-amber-100 px-1 rounded">{'{subdomain}'}</code>
        </p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveSection('defaults')}
          className={`px-4 py-2 rounded-lg font-medium transition ${activeSection === 'defaults' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Global Defaults
        </button>
        <button
          onClick={() => setActiveSection('pages')}
          className={`px-4 py-2 rounded-lg font-medium transition ${activeSection === 'pages' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Static Pages
        </button>
        <button
          onClick={() => setActiveSection('templates')}
          className={`px-4 py-2 rounded-lg font-medium transition ${activeSection === 'templates' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Dynamic Templates
        </button>
      </div>

      {activeSection === 'defaults' && (
        <ContentEditor
          content={defaults as unknown as ContentSection}
          onSave={(updated) => onSave({ ...seoData, defaults: updated } as Record<string, unknown>)}
          saving={saving}
          sectionTitle="Global SEO Defaults (titleSuffix, siteName, locale, etc.)"
        />
      )}

      {activeSection === 'pages' && (
        <div className="space-y-6">
          {Object.entries(pages).map(([pageKey, pageData]) => (
            <ContentEditor
              key={pageKey}
              content={(pageData || {}) as unknown as ContentSection}
              onSave={(updated) => onSave({
                ...seoData,
                pages: { ...pages, [pageKey]: updated }
              } as Record<string, unknown>)}
              saving={saving}
              sectionTitle={`Page: ${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)}`}
            />
          ))}
          {Object.keys(pages).length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
              No page SEO data. Edit via JSON Editor tab to add pages (home, about, contact, services, locations, financing, costGuides).
            </div>
          )}
        </div>
      )}

      {activeSection === 'templates' && (
        <div className="space-y-6">
          {Object.entries(templates).map(([templateKey, templateData]) => (
            <ContentEditor
              key={templateKey}
              content={(templateData || {}) as unknown as ContentSection}
              onSave={(updated) => onSave({
                ...seoData,
                templates: { ...templates, [templateKey]: updated }
              } as Record<string, unknown>)}
              saving={saving}
              sectionTitle={`Template: ${templateKey} ({serviceTitle}, {cityName}, {state}, {slug}, {subdomain})`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
