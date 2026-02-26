import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';
import { ADMIN_AUTH_DISABLED } from '@/lib/admin-auth';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const IMAGES_FILE = path.join(DATA_DIR, 'images.json');

interface ImageItem {
  key?: string;
  alt?: string;
  url: string;
  placeholder?: string;
}

function collectUsedUrls(images: Record<string, unknown>): Set<string> {
  const used = new Set<string>();
  // Hero section
  const hero = images.hero as Record<string, ImageItem> | undefined;
  if (hero) {
    Object.values(hero).forEach((v) => {
      if (v?.url) used.add(v.url);
      if (v?.placeholder) used.add(v.placeholder);
    });
  }
  // Services
  const services = images.services as Record<string, ImageItem> | undefined;
  if (services) {
    Object.values(services).forEach((v) => {
      if (v?.url) used.add(v.url);
      if (v?.placeholder) used.add(v.placeholder);
    });
  }
  // Defaults
  const defaults = images.defaults as { placeholder?: { url?: string } } | undefined;
  if (defaults?.placeholder?.url) used.add(defaults.placeholder.url);
  return used;
}

/** Find duplicate URLs in heroGallery and gallery; "unused" = subsequent occurrences */
function findUnusedEntries(images: Record<string, unknown>): { section: string; index: number; url: string }[] {
  const entries: { section: string; index: number; url: string }[] = [];
  const seenUrls = new Set<string>();

  // heroGallery
  const heroGallery = images.heroGallery as ImageItem[] | undefined;
  if (Array.isArray(heroGallery)) {
    heroGallery.forEach((img, idx) => {
      const url = img?.url?.trim();
      if (!url) return;
      if (seenUrls.has(url)) {
        entries.push({ section: 'heroGallery', index: idx, url });
      } else {
        seenUrls.add(url);
      }
    });
  }

  // gallery categories
  const gallery = images.gallery as Record<string, ImageItem[]> | undefined;
  if (gallery && typeof gallery === 'object') {
    Object.entries(gallery).forEach(([cat, list]) => {
      if (!Array.isArray(list)) return;
      list.forEach((img, idx) => {
        const url = img?.url?.trim();
        if (!url) return;
        const sectionKey = `gallery.${cat}`;
        if (seenUrls.has(url)) {
          entries.push({ section: sectionKey, index: idx, url });
        } else {
          seenUrls.add(url);
        }
      });
    });
  }

  return entries;
}

/** Remove entries by section and index (in reverse order so indices stay valid) */
function removeUnusedFromData(
  data: { images: Record<string, unknown> },
  toRemove: { section: string; index: number }[]
): void {
  const bySection = new Map<string, number[]>();
  toRemove.forEach(({ section, index }) => {
    if (!bySection.has(section)) bySection.set(section, []);
    bySection.get(section)!.push(index);
  });
  bySection.forEach((indices, section) => {
    indices.sort((a, b) => b - a); // descending so splice doesn't shift
  });

  const images = data.images;

  bySection.forEach((indices, section) => {
    if (section === 'heroGallery') {
      const arr = images.heroGallery as ImageItem[];
      if (Array.isArray(arr)) indices.forEach((i) => arr.splice(i, 1));
      return;
    }
    if (section.startsWith('gallery.')) {
      const cat = section.replace('gallery.', '');
      const arr = (images.gallery as Record<string, ImageItem[]>)?.[cat];
      if (Array.isArray(arr)) indices.forEach((i) => arr.splice(i, 1));
    }
  });
}

async function requireAuth() {
  if (ADMIN_AUTH_DISABLED) return true;
  const session = await auth();
  return !!session?.user;
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    if (!fs.existsSync(IMAGES_FILE)) {
      return NextResponse.json({ success: true, count: 0, items: [] });
    }
    const raw = fs.readFileSync(IMAGES_FILE, 'utf-8');
    const json = JSON.parse(raw) as { images?: Record<string, unknown> };
    const images = json.images || {};
    const items = findUnusedEntries(images);
    return NextResponse.json({ success: true, count: items.length, items });
  } catch (e) {
    console.error('Admin images/unused GET:', e);
    return NextResponse.json({ success: false, error: 'Failed to read images' }, { status: 500 });
  }
}

export async function POST() {
  if (!(await requireAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    if (!fs.existsSync(IMAGES_FILE)) {
      return NextResponse.json({ success: true, removed: 0, message: 'No images file' });
    }
    const raw = fs.readFileSync(IMAGES_FILE, 'utf-8');
    const data = JSON.parse(raw) as { images: Record<string, unknown> };
    const items = findUnusedEntries(data.images);
    if (items.length === 0) {
      return NextResponse.json({ success: true, removed: 0, message: 'No unused (duplicate) images to remove' });
    }
    removeUnusedFromData(data, items);
    // Backup
    const backupDir = path.join(DATA_DIR, '.backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(IMAGES_FILE, path.join(backupDir, `images.json.${timestamp}.bak`));
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({
      success: true,
      removed: items.length,
      message: `Removed ${items.length} duplicate image(s).`,
    });
  } catch (e) {
    console.error('Admin images/unused POST:', e);
    return NextResponse.json({ success: false, error: 'Failed to remove unused images' }, { status: 500 });
  }
}
