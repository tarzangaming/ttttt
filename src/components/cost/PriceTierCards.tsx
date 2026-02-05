import React from 'react';

interface PriceTierCardsProps {
    serviceName: string;
    low: number;
    high: number;
}

export default function PriceTierCards({ serviceName, low, high }: PriceTierCardsProps) {
    const tiers = [
        {
            name: 'Budget / Basic',
            range: `${Math.round(low * 0.9).toLocaleString()} - ${Math.round(low * 1.1).toLocaleString()}`,
            desc: 'Standard 3-tab shingles or basic overlay. Good protection for tight budgets.',
            color: 'border-gray-200'
        },
        {
            name: 'Standard / Recommended',
            range: `${Math.round(low * 1.2).toLocaleString()} - ${Math.round(high * 0.9).toLocaleString()}`,
            desc: 'Architectural shingles with 30-50yr warranty. Best value for most homeowners.',
            color: 'border-[#d97706] ring-1 ring-[#d97706] shadow-lg scale-105 z-10'
        },
        {
            name: 'Premium / High-End',
            range: `${Math.round(high).toLocaleString()} - ${Math.round(high * 1.3).toLocaleString()}`,
            desc: 'Designer shingles, Tile, or Metal. Maximum curb appeal and longevity.',
            color: 'border-gray-200'
        }
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6 py-12">
            {tiers.map((tier, idx) => (
                <div key={idx} className={`bg-white rounded-xl p-6 border ${tier.color} flex flex-col`}>
                    <h4 className="text-lg font-bold text-[#1e3a5f] mb-2">{tier.name}</h4>
                    <div className="text-2xl font-extrabold text-[#d97706] mb-4">${tier.range}</div>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{tier.desc}</p>
                    <ul className="space-y-2 text-xs text-gray-500 mb-0">
                        <li className="flex gap-2"><span>✓</span> Material Warranty</li>
                        <li className="flex gap-2"><span>✓</span> Standard Underlayment</li>
                        {idx > 0 && <li className="flex gap-2"><span>✓</span> Enhanced Wind Rating</li>}
                        {idx > 1 && <li className="flex gap-2"><span>✓</span> Premium Curb Appeal</li>}
                    </ul>
                </div>
            ))}
        </div>
    );
}
