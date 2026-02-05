/**
 * Merge state_wise_locations.json into locations.json
 * - Updates zipCodes for existing locations (matched by id)
 * - Adds new locations with full template (roofing/construction focus)
 *
 * Usage: node scripts/merge-state-wise-locations.js [path-to-state_wise_locations.json]
 * Default path: src/data/state_wise_locations.json
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const DEFAULT_STATE_WISE_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'state_wise_locations.json');
const LOCATIONS_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'locations.json');
const PHONE = '(866) 289-1750';

// Map UN (unknown) to PA - those Mc towns are Pennsylvania
function normalizeState(state) {
  return state === 'UN' ? 'PA' : state;
}

// Template for new locations (Bennett Construction - roofing/construction)
function createLocationTemplate(item) {
  const city = item.name;
  const state = normalizeState(item.state);
  const zipCodes = (item.zipCode && String(item.zipCode).trim()) ? [String(item.zipCode).trim()] : [];
  return {
    id: item.id,
    name: city,
    state,
    fullName: `${city}, ${state}`,
    description: `Professional roofing and construction services in ${city}, ${state}. Bennett Construction & Roofing offers roof repair, replacement, gutters, and siding. Licensed, insured, and trusted. Call ${PHONE} for a free estimate.`,
    phone: PHONE,
    heroTitle: `Roofing Contractor in ${city}, ${state}`,
    heroSubtitle: `Trusted roof repair, replacement, and construction in ${city}. Licensed & insured. Free estimates - Call ${PHONE}!`,
    services: [
      { title: 'Roof Repair', description: `Expert roof repair in ${city}, ${state}.`, icon: '🔧' },
      { title: 'Roof Replacement', description: `Full roof replacement in ${city}, ${state}.`, icon: '🏠' },
      { title: 'Storm Damage', description: `Storm damage repair in ${city}, ${state}.`, icon: '⛈️' },
      { title: 'Gutter Installation', description: `Gutter installation in ${city}, ${state}.`, icon: '🌧️' },
      { title: 'Siding Installation', description: `Siding services in ${city}, ${state}.`, icon: '🏡' },
      { title: 'Leak Detection', description: `Roof leak detection in ${city}, ${state}.`, icon: '🔍' }
    ],
    areas: [city],
    zipCodes,
    image: '/images/default-location.jpg',
    meta: {
      title: `Roofing Contractor in ${city}, ${state} | Bennett Construction`,
      description: `Professional roofing services in ${city}, ${state}. Roof repair, replacement, gutters. Licensed & insured. Call ${PHONE}.`
    },
    faqs: [
      { question: 'Do you offer free estimates?', answer: `Yes, we provide free estimates for all roofing and construction projects in ${city}. Call ${PHONE} to schedule.` },
      { question: 'Are you licensed and insured?', answer: 'Yes, Bennett Construction & Roofing is fully licensed, bonded, and insured for your protection.' }
    ],
    testimonials: []
  };
}

function main() {
  const stateWisePath = process.argv[2] || DEFAULT_STATE_WISE_PATH;

  if (!fs.existsSync(stateWisePath)) {
    console.error(`Error: state_wise_locations.json not found at ${stateWisePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(LOCATIONS_PATH)) {
    console.error(`Error: locations.json not found at ${LOCATIONS_PATH}`);
    process.exit(1);
  }

  const stateWiseData = JSON.parse(fs.readFileSync(stateWisePath, 'utf8'));
  const locationsData = JSON.parse(fs.readFileSync(LOCATIONS_PATH, 'utf8'));

  // Flatten state-wise to array (key = state code, value = array of locations)
  const allFromStateWise = [];
  for (const [stateCode, locs] of Object.entries(stateWiseData)) {
    if (Array.isArray(locs)) {
      for (const loc of locs) {
        allFromStateWise.push({ ...loc, state: normalizeState(loc.state || stateCode) });
      }
    }
  }

  const existingById = new Map();
  for (const loc of locationsData.locations) {
    existingById.set(loc.id, loc);
  }

  let updated = 0;
  let added = 0;

  for (const item of allFromStateWise) {
    const zipCodes = (item.zipCode && String(item.zipCode).trim()) ? [String(item.zipCode).trim()] : [];

    if (existingById.has(item.id)) {
      const existing = existingById.get(item.id);
      if (zipCodes.length > 0) {
        const merged = [...new Set([...zipCodes, ...(existing.zipCodes || [])])];
        existing.zipCodes = merged;
        if (!existing.zipCode) existing.zipCode = zipCodes[0];
        updated++;
      }
    } else {
      const newLoc = createLocationTemplate(item);
      locationsData.locations.push(newLoc);
      existingById.set(item.id, newLoc);
      added++;
    }
  }

  fs.writeFileSync(LOCATIONS_PATH, JSON.stringify(locationsData, null, 2), 'utf8');
  console.log(`Merge complete. Updated ${updated} existing locations, added ${added} new locations.`);
}

main();
