import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

/**
 * Reads a JSON file from src/data/ at runtime (not cached by bundler).
 * Use this instead of static imports when you need to pick up
 * changes made by the admin panel without restarting the dev server.
 */
export function readDataFile<T = any>(fileName: string): T {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function getServicesData() {
  return readDataFile<{
    serviceCategories: Record<string, { id: string; name: string; description: string }>;
    servicesByCategory: Record<string, any[]>;
  }>('services.json');
}

export function getServiceContentData() {
  return readDataFile<{ templates: Record<string, any> }>('service-content.json');
}

export function getExtendedServiceContentDynamic(slug: string) {
  const data = getServiceContentData();
  const slugAliases: Record<string, string> = {
    'roof-installation': 'new-roof-installation',
  };
  const normalizedSlug = slugAliases[slug] || slug;
  return data.templates[normalizedSlug] || data.templates[slug] || null;
}
