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

const SKIP_KEYS = new Set([
  'url', 'placeholder', 'key', 'href', 'icon', 'image', 'src',
  'color', 'colors', 'primary', 'primaryLight', 'primaryDark',
  'accent', 'accentLight', 'accentDark', 'background', 'backgroundAlt',
  'text', 'textLight', 'social', 'facebook', 'instagram', 'twitter',
  'linkedin', 'youtube', 'domain', 'canonicalBase', 'email',
  'phoneClean', 'slug', 'id', 'hideOnSubdomain',
]);

// Keys whose values are short labels/buttons — skip in smart mode
const SMART_SKIP_KEYS = new Set([
  'label', 'badge', 'shortTitle', 'icon', 'step', 'buttonText',
  'primaryButton', 'secondaryButton', 'primaryButtonText', 'secondaryButtonText',
  'ctaText', 'ctaLabel', 'titleHighlight', 'value',
]);

// Keys whose values are always important content worth rewriting
const IMPORTANT_KEYS = new Set([
  'title', 'subtitle', 'description', 'heading', 'subheading',
  'intro', 'paragraph', 'answer', 'question', 'text', 'content',
  'approach', 'metaTitle', 'metaDescription', 'heroTitle', 'heroSubtitle',
  'outro', 'name',
]);

function extractTexts(obj: unknown, currentPath: string = '', smart: boolean = false): TextEntry[] {
  const entries: TextEntry[] = [];

  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    if (trimmed.length === 0 || trimmed.startsWith('http') || trimmed.startsWith('#')) return entries;

    if (smart) {
      const lastKey = currentPath.split('.').pop()?.replace(/\[\d+\]$/, '') || '';
      if (SMART_SKIP_KEYS.has(lastKey)) return entries;
      const isImportantKey = IMPORTANT_KEYS.has(lastKey);
      // In smart mode: skip strings shorter than 20 chars unless they're in an important key
      if (!isImportantKey && trimmed.length < 20) return entries;
      // Skip pure emoji or single-word entries
      if (/^[\p{Emoji}\s]+$/u.test(trimmed)) return entries;
      if (!trimmed.includes(' ') && trimmed.length < 30) return entries;
    }

    entries.push({ path: currentPath, value: trimmed });
    return entries;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      entries.push(...extractTexts(item, `${currentPath}[${index}]`, smart));
    });
    return entries;
  }

  if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      entries.push(...extractTexts(value, newPath, smart));
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

function exportSingleFile(fileName: string, smart: boolean = false): { success: boolean; error?: string; fileName: string; totalEntries: number; entries: TextEntry[]; textBlock: string } | null {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const entries = extractTexts(data, '', smart);
  const textBlock = entries.map((e, i) => `[${i + 1}] ${e.value}`).join('\n');
  return { success: true, fileName, totalEntries: entries.length, entries, textBlock };
}

// GET - Export text-only content from JSON files
export async function GET(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');
  const mode = searchParams.get('mode'); // 'all' to export everything
  const smart = searchParams.get('smart') === 'true';

  // Export ALL files as one mega-block
  if (mode === 'all') {
    try {
      const allBlocks: string[] = [];
      const fileSummary: Array<{ file: string; entries: number; startLine: number; endLine: number }> = [];
      let globalIndex = 1;

      for (const f of ALLOWED_FILES) {
        const filePath = path.join(DATA_DIR, f);
        if (!fs.existsSync(filePath)) continue;
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        const entries = extractTexts(data, '', smart);
        if (entries.length === 0) continue;

        const startLine = globalIndex;
        allBlocks.push(`\n===== FILE: ${f} (${entries.length} entries) =====`);
        for (const e of entries) {
          allBlocks.push(`[${globalIndex}] ${e.value}`);
          globalIndex++;
        }
        fileSummary.push({ file: f, entries: entries.length, startLine, endLine: globalIndex - 1 });
      }

      const totalEntries = globalIndex - 1;
      const textBlock = allBlocks.join('\n');

      return NextResponse.json({
        success: true,
        mode: 'all',
        totalEntries,
        totalFiles: fileSummary.length,
        fileSummary,
        textBlock,
        instructions: [
          `This export contains ${totalEntries} text entries across ${fileSummary.length} files.`,
          'Each file section starts with ===== FILE: filename =====',
          'Keep the [N] numbering EXACTLY as-is. Do NOT add or remove lines.',
          'Keep all placeholders like {CITY}, {STATE}, {PHONE}, {COMPANY}, {{CITY}}, {{STATE}}, {{COMPANY_NAME}}, {{PHONE}} EXACTLY as they are.',
          'Only rewrite the actual text content to be more professional and engaging.',
          'When done, paste the FULL rewritten text back in the Import step.',
        ],
      });
    } catch (error) {
      console.error('Export all error:', error);
      return NextResponse.json({ success: false, error: 'Failed to export all files' }, { status: 500 });
    }
  }

  if (!fileName) {
    return NextResponse.json({
      success: true,
      allowedFiles: ALLOWED_FILES,
      description: 'Pass ?file=content.json to export one file, or ?mode=all to export everything',
    });
  }

  if (!ALLOWED_FILES.includes(fileName)) {
    return NextResponse.json(
      { success: false, error: `File "${fileName}" is not supported for rewrite export` },
      { status: 403 }
    );
  }

  try {
    const result = exportSingleFile(fileName, smart);
    if (!result) {
      return NextResponse.json({ success: false, error: `File "${fileName}" not found` }, { status: 404 });
    }

    return NextResponse.json({
      ...result,
      instructions: [
        `This file has ${result.totalEntries} text entries.`,
        'Copy the text block below and paste it into ChatGPT.',
        'Ask ChatGPT to rewrite the text while keeping the [N] numbering exactly the same.',
        'Important: Do NOT add or remove lines. Keep all placeholders like {CITY}, {STATE}, {PHONE}, {COMPANY}, {{CITY}}, {{STATE}} unchanged.',
        'Then paste the rewritten text back in the Import step.',
      ],
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ success: false, error: 'Failed to export file' }, { status: 500 });
  }
}

function importSingleFile(fileName: string, rewrittenMap: Map<number, string>, offset: number): { success: boolean; error?: string; entriesUpdated?: number; backupPath?: string; details?: string[] } {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) return { success: false, error: `File "${fileName}" not found` };

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const originalEntries = extractTexts(data);

  const missing: number[] = [];
  for (let i = 0; i < originalEntries.length; i++) {
    const globalIdx = offset + i + 1;
    if (!rewrittenMap.has(globalIdx)) missing.push(globalIdx);
  }
  if (missing.length > 0) {
    return { success: false, error: `Missing entries for ${fileName}: [${missing.slice(0, 10).join(', ')}${missing.length > 10 ? '...' : ''}]` };
  }

  const placeholderRegex = /\{[A-Z_]+\}|{{[A-Z_]+}}/g;
  const placeholderErrors: string[] = [];
  for (let i = 0; i < originalEntries.length; i++) {
    const globalIdx = offset + i + 1;
    const origPlaceholders = (originalEntries[i].value.match(placeholderRegex) || []).sort();
    const newText = rewrittenMap.get(globalIdx)!;
    const newPlaceholders = (newText.match(placeholderRegex) || []).sort();
    if (JSON.stringify(origPlaceholders) !== JSON.stringify(newPlaceholders)) {
      placeholderErrors.push(`[${globalIdx}] Expected: ${origPlaceholders.join(', ') || 'none'} | Got: ${newPlaceholders.join(', ') || 'none'}`);
    }
  }
  if (placeholderErrors.length > 0) {
    return { success: false, error: `Placeholder mismatch in ${fileName}`, details: placeholderErrors };
  }

  const backupDir = path.join(DATA_DIR, '.backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
  fs.copyFileSync(filePath, backupPath);

  const updatedData = JSON.parse(raw);
  for (let i = 0; i < originalEntries.length; i++) {
    const globalIdx = offset + i + 1;
    setByPath(updatedData, originalEntries[i].path, rewrittenMap.get(globalIdx)!);
  }
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
  return { success: true, entriesUpdated: originalEntries.length, backupPath: path.basename(backupPath) };
}

// POST - Import rewritten text back into JSON file(s)
export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fileName, rewrittenText, mode } = body;

    if (!rewrittenText) {
      return NextResponse.json({ success: false, error: 'Missing rewrittenText' }, { status: 400 });
    }

    // Parse all [N] lines from the rewritten text
    const lines = (rewrittenText as string).split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    const rewrittenMap = new Map<number, string>();
    for (const line of lines) {
      const match = line.match(/^\[(\d+)\]\s*(.+)$/);
      if (match) rewrittenMap.set(parseInt(match[1], 10), match[2].trim());
    }

    if (rewrittenMap.size === 0) {
      return NextResponse.json({ success: false, error: 'No [N] entries found in the pasted text.' }, { status: 400 });
    }

    // MODE: ALL FILES
    if (mode === 'all') {
      const results: Array<{ file: string; success: boolean; entries?: number; error?: string; details?: string[] }> = [];
      let offset = 0;

      for (const f of ALLOWED_FILES) {
        const filePath = path.join(DATA_DIR, f);
        if (!fs.existsSync(filePath)) continue;
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        const entries = extractTexts(data);
        if (entries.length === 0) continue;

        const result = importSingleFile(f, rewrittenMap, offset);
        results.push({ file: f, success: result.success, entries: result.entriesUpdated, error: result.error, details: result.details });

        if (!result.success) {
          return NextResponse.json({
            success: false,
            error: `Import failed at file "${f}": ${result.error}`,
            details: result.details,
            completedFiles: results.filter(r => r.success).map(r => r.file),
          }, { status: 400 });
        }
        offset += entries.length;
      }

      const totalUpdated = results.reduce((sum, r) => sum + (r.entries || 0), 0);
      return NextResponse.json({
        success: true,
        mode: 'all',
        message: `Successfully imported ${totalUpdated} entries across ${results.length} files.`,
        totalEntries: totalUpdated,
        fileResults: results,
      });
    }

    // MODE: SINGLE FILE
    if (!fileName) {
      return NextResponse.json({ success: false, error: 'Missing fileName (or set mode=all)' }, { status: 400 });
    }
    if (!ALLOWED_FILES.includes(fileName)) {
      return NextResponse.json({ success: false, error: `File "${fileName}" is not supported` }, { status: 403 });
    }

    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: `File "${fileName}" not found` }, { status: 404 });
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const originalEntries = extractTexts(data);

    // Validate counts
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
        error: `Missing entries: [${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '...' : ''}]. Expected ${originalEntries.length} entries.`,
        expected: originalEntries.length,
        received: rewrittenMap.size,
      }, { status: 400 });
    }

    // Validate placeholders
    const placeholderRegex = /\{[A-Z_]+\}|{{[A-Z_]+}}/g;
    const placeholderErrors: string[] = [];
    for (let i = 0; i < originalEntries.length; i++) {
      const origPlaceholders = (originalEntries[i].value.match(placeholderRegex) || []).sort();
      const newText = rewrittenMap.get(i + 1)!;
      const newPlaceholders = (newText.match(placeholderRegex) || []).sort();
      if (JSON.stringify(origPlaceholders) !== JSON.stringify(newPlaceholders)) {
        placeholderErrors.push(`[${i + 1}] Expected: ${origPlaceholders.join(', ') || 'none'} | Got: ${newPlaceholders.join(', ') || 'none'}`);
      }
    }
    if (placeholderErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Placeholder mismatch. Placeholders like {CITY}, {STATE}, {PHONE}, {COMPANY} must be preserved exactly.',
        details: placeholderErrors,
      }, { status: 400 });
    }

    // Backup + write
    const backupDir = path.join(DATA_DIR, '.backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
    fs.copyFileSync(filePath, backupPath);

    const updatedData = JSON.parse(raw);
    for (let i = 0; i < originalEntries.length; i++) {
      setByPath(updatedData, originalEntries[i].path, rewrittenMap.get(i + 1)!);
    }
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${rewrittenMap.size} rewritten entries into "${fileName}".`,
      fileName,
      entriesUpdated: rewrittenMap.size,
      backupPath: path.basename(backupPath),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Import error:', msg, error);

    if (msg.includes('EROFS') || msg.includes('read-only file system')) {
      return NextResponse.json(
        { success: false, error: 'Cannot save on Vercel (read-only filesystem). Edit locally, commit, and push to redeploy.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: false, error: `Failed to import: ${msg}` }, { status: 500 });
  }
}
