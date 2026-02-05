/**
 * Update locations.json from city-zipcodes-matched.json by matching on id.
 * Matches by location id (e.g., "arlington-tx") for state-aware zipcode updates.
 *
 * Usage: node scripts/update-from-matched.js [path-to-matched.json]
 * Default: src/data/city-zipcodes-matched.json (or Downloads path if not found)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCATIONS_PATH = path.join(ROOT, 'src', 'data', 'locations.json');
const DEFAULT_MATCHED = path.join(ROOT, 'src', 'data', 'city-zipcodes-matched.json');
const DOWNLOADS_MATCHED = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  'Downloads',
  'VALENTINE 1000',
  'upscale valentine',
  'city-zipcodes-matched.json'
);

function findMatchedFile() {
  const arg = process.argv[2];
  if (arg && fs.existsSync(arg)) return arg;
  if (fs.existsSync(DEFAULT_MATCHED)) return DEFAULT_MATCHED;
  if (fs.existsSync(DOWNLOADS_MATCHED)) return DOWNLOADS_MATCHED;
  return null;
}

const matchedPath = findMatchedFile();
if (!matchedPath) {
  console.error('city-zipcodes-matched.json not found.');
  console.error('Place it at src/data/city-zipcodes-matched.json or pass path as argument.');
  process.exit(1);
}

console.log('Using matched file:', matchedPath);

const matched = JSON.parse(fs.readFileSync(matchedPath, 'utf8'));
const idToZip = {};
for (const m of matched) {
  if (m.id && m.zipCode) idToZip[m.id] = m.zipCode;
}
console.log(`Loaded ${Object.keys(idToZip).length} id->zipCode mappings`);

const locationsData = JSON.parse(fs.readFileSync(LOCATIONS_PATH, 'utf8'));
let updated = 0;

for (const loc of locationsData.locations) {
  const zip = idToZip[loc.id];
  if (zip) {
    loc.zipCode = zip;
    if (loc.zipCodes && Array.isArray(loc.zipCodes) && !loc.zipCodes.includes(zip)) {
      loc.zipCodes = [zip, ...loc.zipCodes.filter((z) => z !== zip)];
    } else if (!loc.zipCodes || !Array.isArray(loc.zipCodes)) {
      loc.zipCodes = [zip];
    }
    updated++;
  }
}

fs.writeFileSync(LOCATIONS_PATH, JSON.stringify(locationsData, null, 2), 'utf8');
console.log(`Updated ${updated} locations with zipcodes from matched file`);
