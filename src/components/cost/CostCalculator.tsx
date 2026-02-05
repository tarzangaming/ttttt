'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorField, CALCULATOR_CONSTANTS } from '@/lib/cost-constants';

interface CostCalculatorProps {
    serviceSlug: string;
    city: string;
    config: any;
}

export default function CostCalculator({ serviceSlug, city, config }: CostCalculatorProps) {
    const [values, setValues] = useState<Record<string, any>>({});
    const [estimatedCost, setEstimatedCost] = useState<{ low: number; high: number } | null>(null);

    // Initialize defaults
    useEffect(() => {
        const defaults: Record<string, any> = {};
        config.calculatorFields.forEach((field: CalculatorField) => {
            defaults[field.name] = field.defaultValue;
        });
        setValues(defaults);
    }, [config]);

    // Calculation Logic
    useEffect(() => {
        if (!values.size && config.unit !== 'fixed') return;

        let baseLow = config.baseCostPerSq.low;
        let baseHigh = config.baseCostPerSq.high;

        // Apply modifiers
        if (values.pitch) {
            const mult = (CALCULATOR_CONSTANTS.difficulties as any)[values.pitch]?.multiplier || 1.0;
            baseLow *= mult;
            baseHigh *= mult;
        }

        if (values.stories) {
            const mult = (CALCULATOR_CONSTANTS.stories as any)[values.stories]?.multiplier || 1.0;
            baseLow *= mult;
            baseHigh *= mult;
        }

        if (values.tearOff && values.tearOff !== 'none') {
            const tearOffCost = (CALCULATOR_CONSTANTS.tearOff as any)[values.tearOff]?.costPerSq || 0;
            baseLow += tearOffCost;
            baseHigh += tearOffCost;
        }

        let totalLow = 0;
        let totalHigh = 0;

        if (config.unit === 'squares') {
            const squares = (values.size || 0) / 100;
            totalLow = baseLow * squares;
            totalHigh = baseHigh * squares;
        } else if (config.unit === 'fixed') {
            // Simple Fixed Logic for repairs
            if (values.severity === 'minor') { totalLow = 350; totalHigh = 650; }
            else if (values.severity === 'moderate') { totalLow = 700; totalHigh = 1500; }
            else { totalLow = 1800; totalHigh = 3500; }
        }

        setEstimatedCost({ low: Math.round(totalLow), high: Math.round(totalHigh) });

    }, [values, config]);

    const handleChange = (name: string, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col w-full">
            {/* Input Section - Top - Horizontal Grid */}
            <div className="p-8 bg-gray-50/50 border-b border-gray-100 w-full">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                    <span>🧮</span> Calculate Your Estimate
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {config.calculatorFields.map((field: CalculatorField) => (
                        <div key={field.name} className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {field.label}
                            </label>

                            {field.type === 'number' && (
                                <div className="relative">
                                    <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mb-2">
                                        <span className="font-bold text-[#1e3a5f]">
                                            {(values[field.name] || field.defaultValue).toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 text-sm">{field.suffix}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
                                        value={values[field.name] || field.defaultValue}
                                        onChange={(e) => handleChange(field.name, Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#d97706]"
                                    />
                                </div>
                            )}

                            {field.type === 'select' && (
                                <div className="flex flex-col gap-2">
                                    <select
                                        value={values[field.name] || field.defaultValue}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition shadow-sm appearance-none"
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        {field.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Result Section - Bottom - Full Width Bar */}
            <div className="p-8 bg-[#1e3a5f] text-white flex flex-col justify-center relative overflow-hidden min-h-[auto] py-12">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#d97706]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="relative z-10 max-w-6xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

                        <div className="flex-1">
                            <p className="text-white/80 uppercase tracking-wider text-xs font-bold mb-2">Estimated Market Price</p>
                            <div className="flex flex-col sm:flex-row items-center md:items-baseline gap-2 sm:gap-4 justify-center md:justify-start">
                                <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                                    ${estimatedCost?.low.toLocaleString()}
                                </span>
                                <span className="text-3xl md:text-4xl text-[#d97706] font-bold">
                                    - ${estimatedCost?.high.toLocaleString()}
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-white/70">
                                *Rough estimation based on standard market rates in {city}.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                            <a href="tel:8662891750" className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-[1.02] text-center whitespace-nowrap min-w-[200px]">
                                Get Exact Quote
                            </a>
                            <button className="bg-white text-[#1e3a5f] font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition shadow-lg whitespace-nowrap min-w-[200px]">
                                Request Inspection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
