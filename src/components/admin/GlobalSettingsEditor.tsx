"use client";

import { useState, useEffect } from 'react';

interface Props {
    onSaved?: () => void;
}

export default function GlobalSettingsEditor({ onSaved }: Props) {
    const [config, setConfig] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin/json?file=site.config.json')
            .then(r => r.json())
            .then(d => { if (d.success) setConfig(d.data); })
            .catch(() => {});
    }, []);

    const save = async () => {
        if (!config) return;
        setSaving(true);
        setMessage(null);

        const cleanPhone = config.phone.replace(/\D/g, '');
        const updated = { ...config, phoneClean: cleanPhone };

        if (config.domain) {
            updated.canonicalBase = `https://${config.domain}`;
            updated.email = config.email || `info@${config.domain}`;
        }

        try {
            const res = await fetch('/api/admin/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: 'site.config.json', data: updated }),
            });
            const result = await res.json();
            if (result.success) {
                setConfig(updated);
                setMessage({ type: 'success', text: 'Global settings saved! Changes will reflect across the entire site.' });
                onSaved?.();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to save' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Save failed' });
        }
        setSaving(false);
    };

    const u = (field: string, value: any) => setConfig((prev: any) => ({ ...prev, [field]: value }));
    const uNested = (parent: string, field: string, value: any) =>
        setConfig((prev: any) => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));

    const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a2c17] focus:outline-none text-sm";
    const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

    if (!config) return <div className="text-center py-12 text-gray-500">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">⚡ Global Site Settings</h2>
                <p className="text-gray-600 text-sm">
                    These values are used <strong>everywhere</strong> across the site. Changing them here updates the phone number, company name, domain, email, etc. in one shot.
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Company Identity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#4a2c17] mb-4 border-b pb-2">Company Identity</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Company Name</label>
                        <input className={inputCls} value={config.companyName || ''} onChange={e => u('companyName', e.target.value)} />
                        <p className="text-xs text-gray-400 mt-1">Appears in headers, footers, titles everywhere</p>
                    </div>
                    <div>
                        <label className={labelCls}>Short Name</label>
                        <input className={inputCls} value={config.shortName || ''} onChange={e => u('shortName', e.target.value)} />
                        <p className="text-xs text-gray-400 mt-1">Used in compact areas (mobile nav, etc.)</p>
                    </div>
                    <div>
                        <label className={labelCls}>Main Service Type</label>
                        <input className={inputCls} value={config.serviceMain || ''} onChange={e => u('serviceMain', e.target.value)} />
                        <p className="text-xs text-gray-400 mt-1">e.g. &quot;Steel Roofing&quot;, &quot;General Contracting&quot;</p>
                    </div>
                    <div>
                        <label className={labelCls}>Tagline</label>
                        <input className={inputCls} value={config.tagline || ''} onChange={e => u('tagline', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelCls}>Company Description</label>
                        <textarea className={inputCls + " min-h-[70px] resize-y"} value={config.description || ''} onChange={e => u('description', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#4a2c17] mb-4 border-b pb-2">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Phone Number</label>
                        <input className={inputCls + " text-lg font-bold"} value={config.phone || ''} onChange={e => u('phone', e.target.value)} placeholder="(866) 289-1750" />
                        <p className="text-xs text-gray-400 mt-1">Shows on every page — header, footer, CTAs, service pages</p>
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input className={inputCls} type="email" value={config.email || ''} onChange={e => u('email', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Domain</label>
                        <input className={inputCls} value={config.domain || ''} onChange={e => u('domain', e.target.value)} placeholder="example.com" />
                        <p className="text-xs text-gray-400 mt-1">Used for canonical URLs, SEO, subdomains</p>
                    </div>
                    <div>
                        <label className={labelCls}>Years in Business</label>
                        <input className={inputCls} value={config.yearsInBusiness || ''} onChange={e => u('yearsInBusiness', e.target.value)} placeholder="15+" />
                    </div>
                    <div>
                        <label className={labelCls}>Founded Year</label>
                        <input className={inputCls} type="number" value={config.foundedYear || ''} onChange={e => u('foundedYear', parseInt(e.target.value) || 2010)} />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#4a2c17] mb-4 border-b pb-2">Business Address</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className={labelCls}>Street</label>
                        <input className={inputCls} value={config.address?.street || ''} onChange={e => uNested('address', 'street', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>City</label>
                        <input className={inputCls} value={config.address?.city || ''} onChange={e => uNested('address', 'city', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>State</label>
                        <input className={inputCls} value={config.address?.state || ''} onChange={e => uNested('address', 'state', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>ZIP</label>
                        <input className={inputCls} value={config.address?.zip || ''} onChange={e => uNested('address', 'zip', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#4a2c17] mb-4 border-b pb-2">Business Hours</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Weekdays</label>
                        <input className={inputCls} value={config.hours?.weekdays || ''} onChange={e => uNested('hours', 'weekdays', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Saturday</label>
                        <input className={inputCls} value={config.hours?.saturday || ''} onChange={e => uNested('hours', 'saturday', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Sunday</label>
                        <input className={inputCls} value={config.hours?.sunday || ''} onChange={e => uNested('hours', 'sunday', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Emergency</label>
                        <input className={inputCls} value={config.hours?.emergency || ''} onChange={e => uNested('hours', 'emergency', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#4a2c17] mb-4 border-b pb-2">Social Media Links</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map(platform => (
                        <div key={platform}>
                            <label className={labelCls}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                            <input className={inputCls} value={config.social?.[platform] || ''} onChange={e => uNested('social', platform, e.target.value)} placeholder={`https://${platform}.com/...`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Save */}
            <button
                onClick={save}
                disabled={saving}
                className="w-full bg-[#c4841d] hover:bg-[#8b5e14] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-lg transition shadow-lg"
            >
                {saving ? 'Saving...' : 'Save Global Settings (Updates Entire Site)'}
            </button>
        </div>
    );
}
