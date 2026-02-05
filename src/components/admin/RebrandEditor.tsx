"use client";

import { useState } from "react";

interface RebrandEditorProps {
  onComplete?: () => void;
}

export default function RebrandEditor({ onComplete }: RebrandEditorProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Record<string, object> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    industry: "",
    tone: "professional" as "professional" | "bold" | "friendly",
    country: "USA",
    scope: "full" as "full" | "homepage",
    // Advanced
    shortName: "",
    domain: "",
    phone: "",
    email: "",
    tagline: "",
    yearsInBusiness: "25+",
  });

  const handleSubmit = async (apply: boolean) => {
    if (!form.brandName?.trim()) {
      setMessage({ type: "error", text: "Please enter the new Brand Name." });
      return;
    }

    setLoading(true);
    setMessage(null);
    setPreview(null);

    try {
      const payload: Record<string, unknown> = {
        brandName: form.brandName.trim(),
        industry: form.industry || "roofing",
        tone: form.tone,
        country: form.country,
        scope: form.scope,
        apply,
      };
      if (form.shortName) payload.shortName = form.shortName;
      if (form.domain) payload.domain = form.domain;
      if (form.phone) payload.phone = form.phone;
      if (form.email) payload.email = form.email;
      if (form.tagline) payload.tagline = form.tagline;
      if (form.yearsInBusiness) payload.yearsInBusiness = form.yearsInBusiness;

      const response = await fetch("/api/rebrand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rebrand failed");
      }

      setMessage({
        type: data.success ? "success" : "error",
        text: data.message || (data.errors ? data.errors.join(" ") : "Done"),
      });

      if (data.results) {
        setPreview(data.results);
      }

      if (apply && data.success) {
        onComplete?.();
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Rebrand failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-bold text-amber-900 mb-2">🔄 1-Click Rebrand</h3>
        <p className="text-amber-800 text-sm">
          Update all website content in one click using AI. Choose <strong>Full Site</strong> to rebrand every page (homepage, about, contact, services, SEO, config) or <strong>Homepage Only</strong> to update just the homepage sections. Backups are auto-created before overwriting.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">New Website Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
            <input
              type="text"
              value={form.brandName}
              onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
              placeholder="ABC Roofing & Construction"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <input
              type="text"
              value={form.industry}
              onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              placeholder="roofing, plumbing, construction..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <select
              value={form.tone}
              onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value as typeof form.tone }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
            >
              <option value="professional">Professional</option>
              <option value="bold">Bold</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              placeholder="USA"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
            <select
              value={form.scope}
              onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value as typeof form.scope }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
            >
              <option value="full">Full Site — All pages (homepage, about, contact, services, SEO, config)</option>
              <option value="homepage">Homepage Only — Hero, features, why choose us, coverage, CTAs</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          className="mt-4 text-sm text-[#1e3a5f] hover:underline"
        >
          {showAdvanced ? "− Hide" : "+ Show"} advanced (domain, phone, email, tagline)
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label>
              <input
                type="text"
                value={form.shortName}
                onChange={(e) => setForm((f) => ({ ...f, shortName: e.target.value }))}
                placeholder="ABC"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
              <input
                type="text"
                value={form.domain}
                onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                placeholder="abcroofing.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="info@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                placeholder="Quality Roofing You Can Trust"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
              <input
                type="text"
                value={form.yearsInBusiness}
                onChange={(e) => setForm((f) => ({ ...f, yearsInBusiness: e.target.value }))}
                placeholder="25+"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {loading ? "Processing..." : "Preview"}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="bg-[#d97706] hover:bg-[#b45309] disabled:bg-gray-300 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
          >
            {loading ? "Processing..." : "🚀 1-Click Rebrand Website"}
          </button>
        </div>
      </div>

      {preview && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Preview Results</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(preview).map(([fileName, data]) => (
              <details key={fileName} className="border border-gray-200 rounded-lg">
                <summary className="p-3 cursor-pointer font-medium text-gray-800 bg-gray-50 rounded-t-lg">
                  {fileName}
                  {(data as { _skipped?: boolean })._skipped && " (skipped)"}
                  {(data as { _error?: string })._error && " (error)"}
                </summary>
                <pre className="p-4 text-xs overflow-x-auto bg-gray-900 text-green-400 rounded-b-lg max-h-64 overflow-y-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
