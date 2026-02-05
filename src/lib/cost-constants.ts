
export const CALCULATOR_CONSTANTS = {
    difficulties: {
        simple: { label: 'Simple (Walkable)', multiplier: 1.0 },
        moderate: { label: 'Moderate (Some Steep Areas)', multiplier: 1.15 },
        complex: { label: 'Complex (Steep/Many Angles)', multiplier: 1.35 },
    },
    stories: {
        one: { label: '1 Story', multiplier: 1.0 },
        two: { label: '2 Stories', multiplier: 1.1 },
        three: { label: '3+ Stories', multiplier: 1.25 },
    },
    tearOff: {
        none: { label: 'No Tear-off Needed (Overlay)', costPerSq: 0 },
        one: { label: '1 Layer Tear-off', costPerSq: 50 },
        two: { label: '2+ Layers Tear-off', costPerSq: 100 },
    }
};

export type CalculatorFieldType = 'number' | 'select' | 'toggle';

export interface CalculatorField {
    type: CalculatorFieldType;
    name: string;
    label: string;
    defaultValue: any;
    options?: { label: string; value: string }[];
    min?: number;
    max?: number; // Added max property
    step?: number;
    suffix?: string;
    tooltip?: string;
}

export const ROOFING_CALCULATOR_FIELDS: CalculatorField[] = [
    {
        type: 'number',
        name: 'size',
        label: 'Roof Area',
        defaultValue: 2000,
        min: 500,
        max: 50000, // Added reasonable max
        step: 50,
        suffix: 'sq ft'
    },
    {
        type: 'select',
        name: 'pitch',
        label: 'Roof Pitch/Steepness',
        defaultValue: 'simple',
        options: [
            { label: 'Flat / Low Slope', value: 'flat' },
            { label: 'Walkable (Up to 6/12)', value: 'simple' },
            { label: 'Steep (7/12 to 9/12)', value: 'moderate' },
            { label: 'Very Steep (10/12+)', value: 'complex' },
        ]
    },
    {
        type: 'select',
        name: 'stories',
        label: 'Number of Stories',
        defaultValue: 'one',
        options: [
            { label: '1 Story', value: 'one' },
            { label: '2 Stories', value: 'two' },
            { label: '3+ Stories', value: 'three' },
        ]
    },
    {
        type: 'select',
        name: 'tearOff',
        label: 'Existing Roof Removal',
        defaultValue: 'one',
        options: [
            { label: 'No Tear-off (New Build/Overlay)', value: 'none' },
            { label: 'Remove 1 Layer', value: 'one' },
            { label: 'Remove 2+ Layers', value: 'two' },
        ]
    }
];
