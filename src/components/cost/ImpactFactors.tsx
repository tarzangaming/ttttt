import React from 'react';

export default function ImpactFactors() {
    const factors = [
        { icon: '📐', title: 'Roof Complexity', desc: 'Steep slopes and many angles increase labor time.' },
        { icon: '🏗️', title: 'Accessibility', desc: 'Hard-to-reach roofs may require special equipment.' },
        { icon: '🪵', title: 'Decking Damage', desc: 'Rotten wood found during tear-off adds to the cost.' },
        { icon: '🧱', title: 'Materials', desc: 'Premium materials like Metal or Tile cost more upfront.' },
        { icon: '📜', title: 'Permits & Fees', desc: 'City permits and disposal fees vary by location.' },
        { icon: '🌬️', title: 'Ventilation', desc: 'Adding ridge vents or intake vents improves longevity.' },
    ];

    return (
        <div className="py-12">
            <h3 className="text-2xl font-bold text-[#4a2c17] mb-8 text-center">What Affects Your Quote?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {factors.map((f, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-3xl bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                            {f.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-[#4a2c17]">{f.title}</h4>
                            <p className="text-sm text-gray-600 leading-snug">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
