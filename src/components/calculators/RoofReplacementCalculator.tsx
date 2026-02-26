'use client';

import { useState } from 'react';
import siteConfig from '@/data/site.config.json';

interface CalculatorProps {
    city: string;
    state: string;
    stateName: string;
    regionMultiplier: number;
}

interface EstimateResult {
    low: number;
    mid: number;
    high: number;
}

const roofTypes = [
    { value: 'shingle', label: 'Asphalt Shingle', rates: { low: 3.50, mid: 5.50, high: 8.00 } },
    { value: 'tile', label: 'Tile (Clay/Concrete)', rates: { low: 8.00, mid: 12.00, high: 18.00 } },
    { value: 'metal', label: 'Metal', rates: { low: 7.00, mid: 10.00, high: 15.00 } },
    { value: 'flat', label: 'Flat/Low-Slope', rates: { low: 4.00, mid: 6.50, high: 10.00 } },
    { value: 'foam', label: 'Spray Foam', rates: { low: 5.00, mid: 7.00, high: 10.00 } },
];

export default function RoofReplacementCalculator({ city, state, stateName, regionMultiplier }: CalculatorProps) {
    const [roofSize, setRoofSize] = useState<number>(2000);
    const [roofType, setRoofType] = useState<string>('shingle');
    const [stories, setStories] = useState<number>(1);
    const [tearOff, setTearOff] = useState<boolean>(true);
    const [complexity, setComplexity] = useState<string>('standard');
    const [estimate, setEstimate] = useState<EstimateResult | null>(null);

    const calculateEstimate = () => {
        const selectedType = roofTypes.find(t => t.value === roofType);
        if (!selectedType) return;

        const baseRates = selectedType.rates;

        // Apply multipliers
        let multiplier = regionMultiplier;

        // Story multiplier
        if (stories === 2) multiplier *= 1.15;
        if (stories >= 3) multiplier *= 1.30;

        // Tear-off adds cost
        const tearOffCost = tearOff ? roofSize * 1.50 : 0;

        // Complexity multiplier
        if (complexity === 'complex') multiplier *= 1.25;
        if (complexity === 'very-complex') multiplier *= 1.50;

        const result: EstimateResult = {
            low: Math.round((roofSize * baseRates.low * multiplier) + tearOffCost),
            mid: Math.round((roofSize * baseRates.mid * multiplier) + tearOffCost),
            high: Math.round((roofSize * baseRates.high * multiplier) + tearOffCost),
        };

        setEstimate(result);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#4a2c17] mb-6">
                Roof Replacement Cost Calculator for {city}, {state}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Roof Size */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Roof Size (sq ft)
                    </label>
                    <input
                        type="number"
                        value={roofSize}
                        onChange={(e) => setRoofSize(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c4841d] focus:border-transparent"
                        min="100"
                        max="50000"
                    />
                </div>

                {/* Roof Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Roofing Material
                    </label>
                    <select
                        value={roofType}
                        onChange={(e) => setRoofType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c4841d] focus:border-transparent"
                    >
                        {roofTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                {/* Stories */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Stories
                    </label>
                    <select
                        value={stories}
                        onChange={(e) => setStories(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c4841d] focus:border-transparent"
                    >
                        <option value={1}>1 Story</option>
                        <option value={2}>2 Stories</option>
                        <option value={3}>3+ Stories</option>
                    </select>
                </div>

                {/* Complexity */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Roof Complexity
                    </label>
                    <select
                        value={complexity}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c4841d] focus:border-transparent"
                    >
                        <option value="simple">Simple (few angles)</option>
                        <option value="standard">Standard</option>
                        <option value="complex">Complex (many angles, dormers)</option>
                        <option value="very-complex">Very Complex (steep, multiple sections)</option>
                    </select>
                </div>

                {/* Tear-off */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={tearOff}
                            onChange={(e) => setTearOff(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-[#c4841d] focus:ring-[#c4841d]"
                        />
                        <span className="text-gray-700">
                            Include tear-off of existing roof (adds ~$1.50/sq ft)
                        </span>
                    </label>
                </div>
            </div>

            <button
                onClick={calculateEstimate}
                className="w-full bg-[#c4841d] hover:bg-[#8b5e14] text-white font-bold py-4 rounded-xl text-lg transition"
            >
                Calculate Estimate
            </button>

            {/* Results */}
            {estimate && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-xl font-bold text-[#4a2c17] mb-4">
                        Estimated Cost in {city}, {stateName}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Budget</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(estimate.low)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center border-2 border-[#c4841d]">
                            <p className="text-sm text-gray-500 mb-1">Average</p>
                            <p className="text-3xl font-bold text-[#4a2c17]">{formatCurrency(estimate.mid)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Premium</p>
                            <p className="text-2xl font-bold text-[#4a2c17]">{formatCurrency(estimate.high)}</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Disclaimer:</strong> This is an estimate only. Actual costs vary based on
                            specific conditions, material choices, and contractor. Get a free, personalized
                            quote for accurate pricing.
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <a
                            href={`tel:${siteConfig.phoneClean}`}
                            className="inline-flex items-center bg-[#4a2c17] hover:bg-[#2d1a0e] text-white font-bold px-8 py-4 rounded-xl text-lg transition"
                        >
                            Get Accurate Quote: {siteConfig.phone}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
