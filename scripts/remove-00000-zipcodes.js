/**
 * Removes "00000" from all zipCodes arrays in locations JSON files.
 * Run: node scripts/remove-00000-zipcodes.js
 * Run with --original to also clean locations.original.json
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = ['locations.json'];
if (process.argv.includes('--original')) {
  files.push('locations.original.json');
}

for (const fileName of files) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) continue;

  let buf = fs.readFileSync(filePath);
  let raw;
  if (buf[0] === 0xFF && buf[1] === 0xFE) {
    raw = buf.subarray(2).toString('utf16le');
  } else if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    raw = buf.subarray(3).toString('utf-8');
  } else {
    raw = buf.toString('utf-8');
  }
  const data = JSON.parse(raw);
  let removedCount = 0;
  let locationsUpdated = 0;

  for (const loc of data.locations || []) {
    if (Array.isArray(loc.zipCodes)) {
      const before = loc.zipCodes.length;
      loc.zipCodes = loc.zipCodes.filter(z => z !== '00000' && z !== '0');
      const after = loc.zipCodes.length;
      if (before !== after) {
        removedCount += before - after;
        locationsUpdated++;
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`${fileName}: Removed ${removedCount} "00000" from ${locationsUpdated} locations.`);
}
