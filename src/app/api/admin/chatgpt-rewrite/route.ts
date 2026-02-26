import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';
import { ADMIN_AUTH_DISABLED } from '@/lib/admin-auth';

async function requireAuth() {
  if (ADMIN_AUTH_DISABLED) return true;
  const session = await auth();
  return !!session?.user;
}

const ALLOWED_FILES = [
  'content.json',
  'services.json',
  'service-content.json',
  'seo.json',
  'site.config.json',
  'hero-content.json',
  'location-extras.json',
  'location-services.json',
  'footer.json',
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

type TextEntry = { path: string; value: string };

/**
 * Recursively walk a JSON object and extract all string values,
 * skipping keys that are structural/non-text (urls, icons, colors, hrefs, etc.)
 */
function extractTexts(obj: unknown, currentPath: string = ''): TextEntry[] {
  const entries: TextEntry[] = [];
  const SKIP_KEYS = new Set([
    'url', 'placeholder', 'key', 'href', 'icon', 'image', 'src',
    'color', 'colors', 'primary', 'primaryLight', 'primaryDark',
    'accent', 'accentLight', 'accentDark', 'background', 'backgroundAlt',
    'text', 'textLight', 'social', 'facebook', 'instagram', 'twitter',
    'linkedin', 'youtube', 'domain', 'canonicalBase', 'email',
    'phoneClean', 'slug', 'id', 'hideOnSubdomain',
  ]);

  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    if (trimmed.length > 0 && !trimmed.startsWith('http') && !trimmed.startsWith('#')) {
      entries.push({ path: currentPath, value: trimmed });
    }
    return entries;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      entries.push(...extractTexts(item, `${currentPath}[${index}]`));
    });
    return entries;
  }

  if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      entries.push(...extractTexts(value, newPath));
    }
  }

  return entries;
}

/**
 * Set a value deep inside an object using a dot/bracket path like
 * "mainWebsite.homepage.hero.title" or "features[0].title"
 */
function setByPath(obj: Record<string, unknown>, pathStr: string, value: string): void {
  const segments: (string | number)[] = [];
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(pathStr)) !== null) {
    if (match[2] !== undefined) {
      segments.push(parseInt(match[2], 10));
    } else {
      segments.push(match[1]);
    }
  }

  let current: unknown = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (typeof seg === 'number') {
      current = (current as unknown[])[seg];
    } else {
      current = (current as Record<string, unknown>)[seg];
    }
  }

  const lastSeg = segments[segments.length - 1];
  if (typeof lastSeg === 'number') {
    (current as unknown[])[lastSeg] = value;
  } else {
    (current as Record<string, unknown>)[lastSeg] = value;
  }
}

// GET - Export text-only content from a JSON file
export async function GET(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return NextResponse.json({
      success: true,
      allowedFiles: ALLOWED_FILES,
      description: 'Pass ?file=content.json to export text values for rewriting',
    });
  }

  if (!ALLOWED_FILES.includes(fileName)) {
    return NextResponse.json(
      { success: false, error: `File "${fileName}" is not supported for rewrite export` },
      { status: 403 }
    );
  }

  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: `File "${fileName}" not found` },
        { status: 404 }
      );
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const entries = extractTexts(data);

    // Build the numbered text block for ChatGPT
    const textBlock = entries
      .map((e, i) => `[${i + 1}] ${e.value}`)
      .join('\n');

    // Return both structured data and the plain text
    return NextResponse.json({
      success: true,
      fileName,
      totalEntries: entries.length,
      entries,
      textBlock,
      instructions: [
        `This file has ${entries.length} text entries.`,
        'Copy the "textBlock" field below and paste it into ChatGPT.',
        'Ask ChatGPT to rewrite the text while keeping the [N] numbering exactly the same.',
        'Important: Tell ChatGPT to NOT add or remove lines, and to keep placeholders like {CITY}, {STATE}, {PHONE}, {COMPANY}, {{CITY}}, {{STATE}} unchanged.',
        'Then paste the rewritten text back using the Import endpoint.',
      ],
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export file' },
      { status: 500 }
    );
  }
}

// POST - Import rewritten text back into the JSON file
export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fileName, rewrittenText } = body;

    if (!fileName || !rewrittenText) {
      return NextResponse.json(
        { success: false, error: 'Missing fileName or rewrittenText' },
        { status: 400 }
      );
    }

    if (!ALLOWED_FILES.includes(fileName)) {
      return NextResponse.json(
        { success: false, error: `File "${fileName}" is not supported` },
        { status: 403 }
      );
    }

    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: `File "${fileName}" not found` },
        { status: 404 }
      );
    }

    // Read the original file and extract the structure
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const originalEntries = extractTexts(data);

    // Parse the rewritten text: lines like "[1] New text here"
    const lines = (rewrittenText as string)
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);

    const rewrittenMap = new Map<number, string>();
    for (const line of lines) {
      const match = line.match(/^\[(\d+)\]\s*(.+)$/);
      if (match) {
        const idx = parseInt(match[1], 10);
        rewrittenMap.set(idx, match[2].trim());
      }
    }

    // Validate
    const missing: number[] = [];
    const extra: number[] = [];

    for (let i = 1; i <= originalEntries.length; i++) {
      if (!rewrittenMap.has(i)) missing.push(i);
    }
    for (const key of rewrittenMap.keys()) {
      if (key < 1 || key > originalEntries.length) extra.push(key);
    }

    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing entries: [${missing.join(', ')}]. Expected ${originalEntries.length} entries total.`,
        expected: originalEntries.length,
        received: rewrittenMap.size,
        missingEntries: missing,
      }, { status: 400 });
    }

    if (extra.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Extra entries found: [${extra.join(', ')}]. Expected max [${originalEntries.length}].`,
        expected: originalEntries.length,
        received: rewrittenMap.size,
        extraEntries: extra,
      }, { status: 400 });
    }

    // Validate placeholders are preserved
    const placeholderRegex = /\{[A-Z_]+\}|{{[A-Z_]+}}/g;
    const placeholderErrors: string[] = [];

    for (let i = 0; i < originalEntries.length; i++) {
      const origPlaceholders = (originalEntries[i].value.match(placeholderRegex) || []).sort();
      const newText = rewrittenMap.get(i + 1)!;
      const newPlaceholders = (newText.match(placeholderRegex) || []).sort();

      if (JSON.stringify(origPlaceholders) !== JSON.stringify(newPlaceholders)) {
        placeholderErrors.push(
          `[${i + 1}] Original placeholders: ${origPlaceholders.join(', ') || 'none'} | ` +
          `New placeholders: ${newPlaceholders.join(', ') || 'none'}`
        );
      }
    }

    if (placeholderErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Placeholder mismatch detected. Placeholders like {CITY}, {STATE}, {PHONE}, {COMPANY} must be preserved exactly.',
        details: placeholderErrors,
      }, { status: 400 });
    }

    // Create backup before writing
    const backupDir = path.join(DATA_DIR, '.backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
    fs.copyFileSync(filePath, backupPath);

    // Apply the rewritten text back into the original structure
    const updatedData = JSON.parse(raw); // fresh copy
    for (let i = 0; i < originalEntries.length; i++) {
      const entry = originalEntries[i];
      const newValue = rewrittenMap.get(i + 1)!;
      setByPath(updatedData, entry.path, newValue);
    }

    // Write updated file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${rewrittenMap.size} rewritten entries into "${fileName}".`,
      fileName,
      entriesUpdated: rewrittenMap.size,
      backupPath: path.basename(backupPath),
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import rewritten text' },
      { status: 500 }
    );
  }
}
