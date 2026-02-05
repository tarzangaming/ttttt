import locationsJson from '@/data/locations.json';
import { ROOFING_CALCULATOR_FIELDS } from './cost-constants';

const LOCATIONS_DATA = (locationsJson as any).locations || [];

export interface LocationData {
    city: string;
    state: string;
    slug: string; // e.g. "phoenix-az"
    zipCodes: string[];
    climateTag: 'desert' | 'mountain' | 'urban';
}

// Full State Map for Universal Coverage
const STATE_MAP: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new-hampshire': 'NH', 'new-jersey': 'NJ',
    'new-mexico': 'NM', 'new-york': 'NY', 'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
    'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
};

const getClimate = (state: string): 'desert' | 'mountain' | 'urban' => {
    const deserts = ['AZ', 'NV', 'NM', 'TX'];
    const mountains = ['CO', 'UT', 'ID', 'MT', 'WY'];
    if (deserts.includes(state)) return 'desert';
    if (mountains.includes(state)) return 'mountain';
    return 'urban';
};

// Generate all 50 State Location Objects
const STATE_LOCATIONS: LocationData[] = Object.entries(STATE_MAP).map(([slug, code]) => ({
    city: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), // e.g. "New York"
    state: code,
    slug: slug,
    zipCodes: [],
    climateTag: getClimate(code)
}));

export const SERVICE_COST_CONFIGS: Record<string, any> = {
    'roof-replacement': {
        baseCostPerSq: { low: 450, high: 850 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS,
        materialMultipliers: { 'asphalt': 1.0, 'tile': 1.8, 'metal': 2.2, 'flat': 1.3 }
    },
    'shingle-roofing': {
        baseCostPerSq: { low: 450, high: 650 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS,
    },
    'tile-roofing': {
        baseCostPerSq: { low: 800, high: 1400 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS,
    },
    'metal-roofing': {
        baseCostPerSq: { low: 900, high: 1600 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS,
    },
    'roof-installation': {
        baseCostPerSq: { low: 400, high: 750 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS,
    },
    'new-roof-installation': {
        baseCostPerSq: { low: 400, high: 750 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS,
    },
    'foam-roofing': {
        baseCostPerSq: { low: 450, high: 650 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS.filter(f => f.name !== 'pitch' && f.name !== 'stories'),
    },
    'flat-roofing-systems': {
        baseCostPerSq: { low: 500, high: 900 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS.filter(f => f.name !== 'pitch' && f.name !== 'stories'),
    },
    'commercial-roofing': {
        baseCostPerSq: { low: 550, high: 950 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS.filter(f => f.name !== 'pitch' && f.name !== 'stories'),
    },
    'roof-repair': {
        baseCostPerSq: { low: 350, high: 1200 },
        unit: 'fixed',
        calculatorFields: [
            {
                type: 'select', name: 'severity', label: 'Damage Severity', defaultValue: 'minor', options: [
                    { label: 'Minor Leaks / Missing Shingles', value: 'minor' },
                    { label: 'Moderate Damage / Valley Repair', value: 'moderate' },
                    { label: 'Major Structural / Large Area', value: 'major' }
                ]
            }
        ]
    },
    'roof-leak-repair': {
        baseCostPerSq: { low: 300, high: 1000 },
        unit: 'fixed',
        calculatorFields: [
            {
                type: 'select', name: 'severity', label: 'Leak Severity', defaultValue: 'minor', options: [
                    { label: 'Single Drip / Spot', value: 'minor' },
                    { label: 'Active Flow / Ceiling Stain', value: 'moderate' },
                    { label: 'Multiple Leaks / saturated', value: 'major' }
                ]
            }
        ]
    },
    'storm-damage-roof-repair': {
        baseCostPerSq: { low: 500, high: 2500 },
        unit: 'fixed',
        calculatorFields: [
            {
                type: 'select', name: 'severity', label: 'Storm Impact', defaultValue: 'moderate', options: [
                    { label: 'Few Missing Shingles', value: 'minor' },
                    { label: 'Visible Hail/Wind Patches', value: 'moderate' },
                    { label: 'Tree Impact / Structural', value: 'major' }
                ]
            }
        ]
    },
    'emergency-roof-repair': {
        baseCostPerSq: { low: 500, high: 1500 },
        unit: 'fixed',
        calculatorFields: [
            {
                type: 'select', name: 'severity', label: 'Emergency Level', defaultValue: 'moderate', options: [
                    { label: 'Tarping Only', value: 'minor' },
                    { label: 'Active Leak Stop', value: 'moderate' },
                    { label: 'Structural Stabilization', value: 'major' }
                ]
            }
        ]
    },
    'flat-roof-repair': {
        baseCostPerSq: { low: 400, high: 1500 },
        unit: 'fixed',
        calculatorFields: [
            {
                type: 'select', name: 'severity', label: 'Repair Scope', defaultValue: 'moderate', options: [
                    { label: 'Patching / Sealing', value: 'minor' },
                    { label: 'Drake / Scupper Repair', value: 'moderate' },
                    { label: 'Large Section Re-ply', value: 'major' }
                ]
            }
        ]
    },
    default: {
        baseCostPerSq: { low: 450, high: 850 },
        unit: 'squares',
        calculatorFields: ROOFING_CALCULATOR_FIELDS,
        materialMultipliers: { 'asphalt': 1.0, 'tile': 1.8, 'metal': 2.2, 'flat': 1.3 }
    }
};

export const getServiceCostConfig = (slug: string) => {
    return SERVICE_COST_CONFIGS[slug] ?? SERVICE_COST_CONFIGS['default'];
};

export const getCityFromSlug = (slug: string): LocationData | undefined => {
    // 1. Try generic state map
    const stateMatch = STATE_LOCATIONS.find(l => l.slug === slug);
    if (stateMatch) return stateMatch;

    // 2. Search large JSON
    const match = LOCATIONS_DATA.find((l: any) => l.id === slug);
    if (match) {
        return {
            city: match.name,
            state: match.state,
            slug: match.id,
            zipCodes: match.zipCodes || [],
            climateTag: getClimate(match.state)
        };
    }

    return undefined;
};

// Deprecated: Exporting full list is discouraged due to size, but kept for compatibility if needed.
// Preferably use getCityFromSlug only.
export const LOCATIONS: LocationData[] = []; // Intentionally empty to force usage of getCityFromSlug
