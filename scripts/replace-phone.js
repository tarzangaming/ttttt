/**
 * Replaces old phone numbers with new number +18662891750
 * Display: (866) 289-1750, Clean: 8662891750
 * Run: node scripts/replace-phone.js
 */

const fs = require('fs');
const path = require('path');

const NEW_DISPLAY = '(866) 289-1750';
const NEW_CLEAN = '8662891750';

const OLD_NUMBERS = [
  '(833) 609-0936',
  '8336090936',
  '(833) 445-0128',
  '8334450128',
  '833-609-0936',
  '+1-833-609-0936',
];

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  for (const old of OLD_NUMBERS) {
    if (content.includes(old)) {
      const replacement = old.length <= 10 ? NEW_CLEAN : NEW_DISPLAY;
      content = content.split(old).join(replacement);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated:', filePath);
  }
}

const root = path.join(__dirname, '..');
const ext = ['.tsx', '.ts', '.js', '.json', '.md'];
function walk(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!['node_modules', '.next', '.git', '.backups'].includes(e.name)) walk(full);
      } else if (ext.some(x => e.name.endsWith(x))) {
        replaceInFile(full);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

walk(root);
console.log('Done. New number:', NEW_DISPLAY, '/', NEW_CLEAN);
