"use client";

import { useState, useEffect, useCallback } from 'react';

interface ServiceBasic {
    slug: string;
    title: string;
    shortTitle?: string;
    icon: string;
    heroTitle?: string;
    heroSubtitle?: string;
    description: string;
    metaTitle?: string;
    metaDescription?: string;
    signs?: string[];
    features?: string[];
    approach?: string;
    materials?: string[];
    faqs?: Array<{ question: string; answer: string }>;
    relatedServices?: string[];
    [key: string]: unknown;
}

interface ServiceTemplate {
    hero: { title: string; subheading: string; intro: string };
    includes: { title: string; items: string[] };
    materials?: { title: string; items: Array<{ name: string; description: string }> };
    whyChooseUs: { title: string; items: string[] };
    process: { title: string; items: Array<{ step: string; description: string }> };
    signs: { title: string; intro: string; items: string[]; outro: string };
    faqs: { title: string; items: Array<{ question: string; answer: string }> };
}

interface Props {
    saving: boolean;
}

export default function ServicePageEditor({ saving }: Props) {
    const [services, setServices] = useState<ServiceBasic[]>([]);
    const [servicesJson, setServicesJson] = useState<any>(null);
    const [templates, setTemplates] = useState<Record<string, ServiceTemplate>>({});
    const [selectedSlug, setSelectedSlug] = useState<string>('');
    const [activeSection, setActiveSection] = useState<'basic' | 'template'>('basic');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [editBasic, setEditBasic] = useState<ServiceBasic | null>(null);
    const [editTemplate, setEditTemplate] = useState<ServiceTemplate | null>(null);

    const loadData = useCallback(async () => {
        try {
            const [svcRes, tplRes] = await Promise.all([
                fetch('/api/admin/json?file=services.json'),
                fetch('/api/admin/json?file=service-content.json'),
            ]);
            const svcData = await svcRes.json();
            const tplData = await tplRes.json();

            if (svcData.success) {
                setServicesJson(svcData.data);
                const byCategory = svcData.data.servicesByCategory || {};
                const all: ServiceBasic[] = Object.values(byCategory).flat() as ServiceBasic[];
                setServices(all);
                if (!selectedSlug && all.length > 0) setSelectedSlug(all[0].slug);
            }
            if (tplData.success && tplData.data?.templates) {
                setTemplates(tplData.data.templates);
            }
        } catch (err) {
            console.error('Failed to load service data:', err);
        }
    }, [selectedSlug]);

    useEffect(() => { loadData(); }, [loadData]);

    useEffect(() => {
        if (!selectedSlug) return;
        const svc = services.find(s => s.slug === selectedSlug);
        setEditBasic(svc ? { ...svc } : null);
        const tpl = templates[selectedSlug];
        if (tpl) {
            const safe = JSON.parse(JSON.stringify(tpl));
            safe.hero = safe.hero || { title: '', subheading: '', intro: '' };
            safe.hero.title = safe.hero.title || '';
            safe.hero.subheading = safe.hero.subheading || '';
            safe.hero.intro = safe.hero.intro || '';
            safe.includes = safe.includes || { title: '', items: [] };
            safe.includes.title = safe.includes.title || '';
            safe.includes.items = safe.includes.items || [];
            safe.whyChooseUs = safe.whyChooseUs || { title: '', items: [] };
            safe.whyChooseUs.title = safe.whyChooseUs.title || '';
            safe.whyChooseUs.items = safe.whyChooseUs.items || [];
            safe.process = safe.process || { title: '', items: [] };
            safe.process.title = safe.process.title || '';
            safe.process.items = safe.process.items || [];
            safe.signs = safe.signs || { title: '', intro: '', items: [], outro: '' };
            safe.signs.title = safe.signs.title || '';
            safe.signs.intro = safe.signs.intro || '';
            safe.signs.items = safe.signs.items || [];
            safe.signs.outro = safe.signs.outro || '';
            safe.faqs = safe.faqs || { title: '', items: [] };
            safe.faqs.title = safe.faqs.title || '';
            safe.faqs.items = safe.faqs.items || [];
            setEditTemplate(safe);
        } else {
            setEditTemplate(null);
        }
    }, [selectedSlug, services, templates]);

    const selectedService = services.find(s => s.slug === selectedSlug);

    const saveBasic = async () => {
        if (!editBasic || !servicesJson) return;
        setIsSaving(true);
        setMessage(null);
        try {
            const updated = JSON.parse(JSON.stringify(servicesJson));
            for (const cat of Object.keys(updated.servicesByCategory)) {
                const list = updated.servicesByCategory[cat];
                const idx = list.findIndex((s: any) => s.slug === selectedSlug);
                if (idx !== -1) {
                    updated.servicesByCategory[cat][idx] = { ...list[idx], ...editBasic };
                    break;
                }
            }
            const res = await fetch('/api/admin/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: 'services.json', data: updated }),
            });
            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Service basic info saved!' });
                setServicesJson(updated);
                const all: ServiceBasic[] = Object.values(updated.servicesByCategory).flat() as ServiceBasic[];
                setServices(all);
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to save' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Save failed. Check console.' });
        }
        setIsSaving(false);
    };

    const saveTemplate = async () => {
        if (!editTemplate) return;
        setIsSaving(true);
        setMessage(null);
        try {
            const allTemplates = { ...templates, [selectedSlug]: editTemplate };
            const res = await fetch('/api/admin/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: 'service-content.json', data: { templates: allTemplates } }),
            });
            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Service page template saved!' });
                setTemplates(allTemplates);
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to save' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Save failed. Check console.' });
        }
        setIsSaving(false);
    };

    const updateBasicField = (field: string, value: any) => {
        if (!editBasic) return;
        setEditBasic({ ...editBasic, [field]: value });
    };

    const updateTemplateField = (path: string, value: any) => {
        if (!editTemplate) return;
        const copy = JSON.parse(JSON.stringify(editTemplate));
        const keys = path.split('.');
        let obj: any = copy;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (k.match(/^\d+$/)) obj = obj[parseInt(k)];
            else obj = obj[k];
        }
        const lastKey = keys[keys.length - 1];
        if (lastKey.match(/^\d+$/)) obj[parseInt(lastKey)] = value;
        else obj[lastKey] = value;
        setEditTemplate(copy);
    };

    const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a2c17] focus:outline-none text-sm";
    const textareaCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a2c17] focus:outline-none text-sm min-h-[80px] resize-y";
    const labelCls = "block text-sm font-semibold text-gray-700 mb-1";
    const sectionCls = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">🔧 Individual Service Page Editor</h3>
                <p className="text-blue-800 text-sm">
                    Edit the content for each <code className="bg-blue-100 px-1.5 py-0.5 rounded">/services/[slug]</code> page.
                    <strong> Basic Info</strong> controls the service card data (title, description, hero, FAQs).
                    <strong> Page Template</strong> controls the full page sections (includes, materials, process, signs, why choose us).
                    Placeholders: <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{{CITY}}'}</code> <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{{STATE}}'}</code> <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{{COMPANY_NAME}}'}</code> <code className="bg-blue-100 px-1.5 py-0.5 rounded">{'{{PHONE}}'}</code>
                </p>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Service Selector */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 w-full">
                    <label className={labelCls}>Select Service</label>
                    <select
                        value={selectedSlug}
                        onChange={(e) => setSelectedSlug(e.target.value)}
                        className={inputCls + " font-medium"}
                    >
                        {services.map(s => (
                            <option key={s.slug} value={s.slug}>{s.icon} {s.title} — /{s.slug}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveSection('basic')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'basic' ? 'bg-[#4a2c17] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Basic Info
                    </button>
                    <button
                        onClick={() => setActiveSection('template')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'template' ? 'bg-[#4a2c17] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Page Template
                    </button>
                </div>
            </div>

            {/* ═══ BASIC INFO EDITOR ═══ */}
            {activeSection === 'basic' && editBasic && (
                <div className="space-y-6">
                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Core Info</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Title</label>
                                <input className={inputCls} value={editBasic.title} onChange={e => updateBasicField('title', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelCls}>Short Title</label>
                                <input className={inputCls} value={editBasic.shortTitle || ''} onChange={e => updateBasicField('shortTitle', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelCls}>Icon (emoji)</label>
                                <input className={inputCls} value={editBasic.icon} onChange={e => updateBasicField('icon', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelCls}>Slug (URL)</label>
                                <input className={inputCls + " bg-gray-50"} value={editBasic.slug} disabled />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Description</label>
                            <textarea className={textareaCls} value={editBasic.description} onChange={e => updateBasicField('description', e.target.value)} />
                        </div>
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Hero Section</h4>
                        <div>
                            <label className={labelCls}>Hero Title</label>
                            <input className={inputCls} value={editBasic.heroTitle || ''} onChange={e => updateBasicField('heroTitle', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Hero Subtitle</label>
                            <textarea className={textareaCls} value={editBasic.heroSubtitle || ''} onChange={e => updateBasicField('heroSubtitle', e.target.value)} />
                        </div>
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">SEO</h4>
                        <div>
                            <label className={labelCls}>Meta Title</label>
                            <input className={inputCls} value={editBasic.metaTitle || ''} onChange={e => updateBasicField('metaTitle', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Meta Description</label>
                            <textarea className={textareaCls} value={editBasic.metaDescription || ''} onChange={e => updateBasicField('metaDescription', e.target.value)} />
                        </div>
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Approach</h4>
                        <textarea className={textareaCls} value={editBasic.approach || ''} onChange={e => updateBasicField('approach', e.target.value)} />
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Features</h4>
                        <ListEditor items={editBasic.features || []} onChange={val => updateBasicField('features', val)} />
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Signs You Need This Service</h4>
                        <ListEditor items={editBasic.signs || []} onChange={val => updateBasicField('signs', val)} />
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Materials</h4>
                        <ListEditor items={editBasic.materials || []} onChange={val => updateBasicField('materials', val)} />
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">FAQs</h4>
                        <FaqEditor items={editBasic.faqs || []} onChange={val => updateBasicField('faqs', val)} />
                    </div>

                    <div className={sectionCls}>
                        <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Related Services</h4>
                        <p className="text-sm text-gray-500">Select services shown in the &quot;More Services&quot; section at the bottom.</p>
                        <RelatedServicesPicker
                            selected={editBasic.relatedServices || []}
                            allServices={services}
                            currentSlug={selectedSlug}
                            onChange={val => updateBasicField('relatedServices', val)}
                        />
                    </div>

                    <button
                        onClick={saveBasic}
                        disabled={isSaving || saving}
                        className="w-full bg-[#c4841d] hover:bg-[#8b5e14] text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Basic Info (services.json)'}
                    </button>
                </div>
            )}

            {/* ═══ TEMPLATE EDITOR ═══ */}
            {activeSection === 'template' && (
                <div className="space-y-6">
                    {editTemplate && editTemplate.hero && editTemplate.includes && editTemplate.whyChooseUs && editTemplate.process && editTemplate.signs && editTemplate.faqs ? (
                        <>
                            <div className={sectionCls}>
                                <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Hero</h4>
                                <div>
                                    <label className={labelCls}>Title</label>
                                    <input className={inputCls} value={editTemplate.hero.title} onChange={e => updateTemplateField('hero.title', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Subheading</label>
                                    <textarea className={textareaCls} value={editTemplate.hero.subheading} onChange={e => updateTemplateField('hero.subheading', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Intro Paragraphs</label>
                                    <textarea className={textareaCls + " min-h-[140px]"} value={editTemplate.hero.intro} onChange={e => updateTemplateField('hero.intro', e.target.value)} />
                                </div>
                            </div>

                            <div className={sectionCls}>
                                <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">What&apos;s Included</h4>
                                <div>
                                    <label className={labelCls}>Section Title</label>
                                    <input className={inputCls} value={editTemplate.includes.title} onChange={e => updateTemplateField('includes.title', e.target.value)} />
                                </div>
                                <ListEditor
                                    items={editTemplate.includes.items}
                                    onChange={val => updateTemplateField('includes.items', val)}
                                />
                            </div>

                            {editTemplate.materials && (
                                <div className={sectionCls}>
                                    <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Materials</h4>
                                    <div>
                                        <label className={labelCls}>Section Title</label>
                                        <input className={inputCls} value={editTemplate.materials.title} onChange={e => updateTemplateField('materials.title', e.target.value)} />
                                    </div>
                                    {editTemplate.materials.items.map((mat, i) => (
                                        <div key={i} className="bg-gray-50 p-4 rounded-lg space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-500">Material #{i + 1}</span>
                                                <button onClick={() => {
                                                    const items = [...editTemplate.materials!.items];
                                                    items.splice(i, 1);
                                                    updateTemplateField('materials.items', items);
                                                }} className="text-red-500 text-sm hover:underline">Remove</button>
                                            </div>
                                            <input className={inputCls} placeholder="Name" value={mat.name} onChange={e => updateTemplateField(`materials.items.${i}.name`, e.target.value)} />
                                            <textarea className={textareaCls} placeholder="Description" value={mat.description} onChange={e => updateTemplateField(`materials.items.${i}.description`, e.target.value)} />
                                        </div>
                                    ))}
                                    <button onClick={() => {
                                        const items = [...editTemplate.materials!.items, { name: '', description: '' }];
                                        updateTemplateField('materials.items', items);
                                    }} className="text-sm text-[#c4841d] font-medium hover:underline">+ Add Material</button>
                                </div>
                            )}

                            <div className={sectionCls}>
                                <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Why Choose Us</h4>
                                <div>
                                    <label className={labelCls}>Section Title</label>
                                    <input className={inputCls} value={editTemplate.whyChooseUs.title} onChange={e => updateTemplateField('whyChooseUs.title', e.target.value)} />
                                </div>
                                <ListEditor
                                    items={editTemplate.whyChooseUs.items}
                                    onChange={val => updateTemplateField('whyChooseUs.items', val)}
                                />
                            </div>

                            <div className={sectionCls}>
                                <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Process Steps</h4>
                                <div>
                                    <label className={labelCls}>Section Title</label>
                                    <input className={inputCls} value={editTemplate.process.title} onChange={e => updateTemplateField('process.title', e.target.value)} />
                                </div>
                                {editTemplate.process.items.map((step, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Step {i + 1}</span>
                                            <button onClick={() => {
                                                const items = [...editTemplate.process.items];
                                                items.splice(i, 1);
                                                updateTemplateField('process.items', items);
                                            }} className="text-red-500 text-sm hover:underline">Remove</button>
                                        </div>
                                        <input className={inputCls} placeholder="Step name" value={step.step} onChange={e => updateTemplateField(`process.items.${i}.step`, e.target.value)} />
                                        <textarea className={textareaCls} placeholder="Description" value={step.description} onChange={e => updateTemplateField(`process.items.${i}.description`, e.target.value)} />
                                    </div>
                                ))}
                                <button onClick={() => {
                                    const items = [...editTemplate.process.items, { step: '', description: '' }];
                                    updateTemplateField('process.items', items);
                                }} className="text-sm text-[#c4841d] font-medium hover:underline">+ Add Step</button>
                            </div>

                            <div className={sectionCls}>
                                <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">Signs You Need This Service</h4>
                                <div>
                                    <label className={labelCls}>Section Title</label>
                                    <input className={inputCls} value={editTemplate.signs.title} onChange={e => updateTemplateField('signs.title', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Intro Text</label>
                                    <input className={inputCls} value={editTemplate.signs.intro} onChange={e => updateTemplateField('signs.intro', e.target.value)} />
                                </div>
                                <ListEditor
                                    items={editTemplate.signs.items}
                                    onChange={val => updateTemplateField('signs.items', val)}
                                />
                                <div>
                                    <label className={labelCls}>Outro Text</label>
                                    <input className={inputCls} value={editTemplate.signs.outro} onChange={e => updateTemplateField('signs.outro', e.target.value)} />
                                </div>
                            </div>

                            <div className={sectionCls}>
                                <h4 className="text-lg font-bold text-[#4a2c17] border-b pb-2">FAQs</h4>
                                <div>
                                    <label className={labelCls}>Section Title</label>
                                    <input className={inputCls} value={editTemplate.faqs.title} onChange={e => updateTemplateField('faqs.title', e.target.value)} />
                                </div>
                                <FaqEditor
                                    items={editTemplate.faqs.items}
                                    onChange={val => updateTemplateField('faqs.items', val)}
                                />
                            </div>

                            <button
                                onClick={saveTemplate}
                                disabled={isSaving || saving}
                                className="w-full bg-[#c4841d] hover:bg-[#8b5e14] text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Page Template (service-content.json)'}
                            </button>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Template Found for &quot;{selectedService?.title}&quot;</h3>
                            <p className="text-gray-600 mb-6">
                                This service doesn&apos;t have a page template in <code>service-content.json</code> yet.
                            </p>
                            <button
                                onClick={() => {
                                    setEditTemplate({
                                        hero: { title: `Professional ${selectedService?.title || 'Service'} in {{CITY}}, {{STATE}}`, subheading: '', intro: '' },
                                        includes: { title: `What's Included in Our ${selectedService?.title || 'Service'}`, items: [] },
                                        materials: { title: 'Materials We Use', items: [] },
                                        whyChooseUs: { title: `Why Choose {{COMPANY_NAME}} for ${selectedService?.title || 'This Service'}`, items: [] },
                                        process: { title: `Our ${selectedService?.title || 'Service'} Process`, items: [] },
                                        signs: { title: `Do You Need ${selectedService?.title || 'This Service'}?`, intro: 'You may need this service if you notice:', items: [], outro: 'Call us today for a free inspection.' },
                                        faqs: { title: `${selectedService?.title || 'Service'} FAQ`, items: [] },
                                    });
                                }}
                                className="bg-[#4a2c17] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#6b3d22] transition"
                            >
                                Create Template for This Service
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ListEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a2c17] focus:outline-none text-sm"
                        value={item}
                        onChange={e => {
                            const copy = [...items];
                            copy[i] = e.target.value;
                            onChange(copy);
                        }}
                    />
                    <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2" title="Remove">✕</button>
                </div>
            ))}
            <button onClick={() => onChange([...items, ''])} className="text-sm text-[#c4841d] font-medium hover:underline">+ Add Item</button>
        </div>
    );
}

function FaqEditor({ items, onChange }: { items: Array<{ question: string; answer: string }>; onChange: (v: Array<{ question: string; answer: string }>) => void }) {
    return (
        <div className="space-y-4">
            {items.map((faq, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">FAQ #{i + 1}</span>
                        <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-500 text-sm hover:underline">Remove</button>
                    </div>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a2c17] focus:outline-none text-sm"
                        placeholder="Question"
                        value={faq.question}
                        onChange={e => {
                            const copy = [...items];
                            copy[i] = { ...copy[i], question: e.target.value };
                            onChange(copy);
                        }}
                    />
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a2c17] focus:outline-none text-sm min-h-[60px] resize-y"
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={e => {
                            const copy = [...items];
                            copy[i] = { ...copy[i], answer: e.target.value };
                            onChange(copy);
                        }}
                    />
                </div>
            ))}
            <button onClick={() => onChange([...items, { question: '', answer: '' }])} className="text-sm text-[#c4841d] font-medium hover:underline">+ Add FAQ</button>
        </div>
    );
}

function RelatedServicesPicker({ selected, allServices, currentSlug, onChange }: {
    selected: string[];
    allServices: ServiceBasic[];
    currentSlug: string;
    onChange: (v: string[]) => void;
}) {
    const others = allServices.filter(s => s.slug !== currentSlug);
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {others.map(s => {
                const isSelected = selected.includes(s.slug);
                return (
                    <button
                        key={s.slug}
                        type="button"
                        onClick={() => {
                            if (isSelected) onChange(selected.filter(sl => sl !== s.slug));
                            else onChange([...selected, s.slug]);
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-sm border transition ${isSelected ? 'bg-[#4a2c17] text-white border-[#4a2c17]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#c4841d]'}`}
                    >
                        {s.icon} {s.shortTitle || s.title}
                    </button>
                );
            })}
        </div>
    );
}
