import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';
import { ADMIN_AUTH_DISABLED } from '@/lib/admin-auth';

export const maxDuration = 60;

async function requireAuth() {
  if (ADMIN_AUTH_DISABLED) return true;
  const session = await auth();
  if (!session?.user) {
    return false;
  }
  return true;
}

// List of allowed JSON files that can be managed
const ALLOWED_FILES = [
    'images.json',
    'services.json',
    'service-content.json',
    'seo.json',
    'site.config.json',
    'schema.json',
    'locations.json',
    'content.json',
    'footer.json',
    'hero-content.json',
    'location-extras.json',
    'location-services.json'
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

// GET - List all JSON files or get a specific file
export async function GET(request: NextRequest) {
    if (!(await requireAuth())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    try {
        // If no file specified, return list of all files
        if (!fileName) {
            const files = ALLOWED_FILES.map(file => {
                const filePath = path.join(DATA_DIR, file);
                const exists = fs.existsSync(filePath);
                let size = 0;
                let modified = null;

                if (exists) {
                    const stats = fs.statSync(filePath);
                    size = stats.size;
                    modified = stats.mtime.toISOString();
                }

                return {
                    name: file,
                    exists,
                    size,
                    modified,
                    category: getCategoryFromFileName(file)
                };
            });

            return NextResponse.json({
                success: true,
                files,
                dataDir: DATA_DIR
            });
        }

        // Validate file name
        if (!ALLOWED_FILES.includes(fileName)) {
            return NextResponse.json(
                { success: false, error: `File "${fileName}" is not allowed` },
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

        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        return NextResponse.json({
            success: true,
            fileName,
            data,
            modified: fs.statSync(filePath).mtime.toISOString()
        });

    } catch (error) {
        console.error('Admin API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to read file' },
            { status: 500 }
        );
    }
}

// POST - Update a JSON file
export async function POST(request: NextRequest) {
    if (!(await requireAuth())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        let body: { fileName?: string; data?: unknown };
        try {
            const rawText = await request.text();
            body = JSON.parse(rawText);
        } catch (parseErr) {
            const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
            return NextResponse.json(
                { success: false, error: `Invalid JSON in request body: ${msg}` },
                { status: 400 }
            );
        }

        const { fileName, data } = body;

        if (!fileName || !data) {
            return NextResponse.json(
                { success: false, error: 'Missing fileName or data' },
                { status: 400 }
            );
        }

        // Validate file name
        if (!ALLOWED_FILES.includes(fileName)) {
            return NextResponse.json(
                { success: false, error: `File "${fileName}" is not allowed` },
                { status: 403 }
            );
        }

        const filePath = path.join(DATA_DIR, fileName);

        // Create backup before writing
        if (fs.existsSync(filePath)) {
            const backupDir = path.join(DATA_DIR, '.backups');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
            fs.copyFileSync(filePath, backupPath);
        }

        // Write the new data
        const jsonContent = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonContent, 'utf-8');

        return NextResponse.json({
            success: true,
            message: `File "${fileName}" updated successfully`,
            modified: new Date().toISOString()
        });

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('Admin API Error:', msg, error);

        if (msg.includes('EROFS') || msg.includes('read-only file system')) {
            return NextResponse.json(
                { success: false, error: 'Cannot save on Vercel (read-only filesystem). The admin editor can only save files when running locally (npm run dev). To update content in production, edit locally, commit, and push to redeploy.' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { success: false, error: `Failed to update file: ${msg}` },
            { status: 500 }
        );
    }
}

function getCategoryFromFileName(fileName: string): string {
    const categories: { [key: string]: string } = {
        'images.json': 'Media',
        'services.json': 'Content',
        'service-content.json': 'Content',
        'seo.json': 'SEO',
        'site.config.json': 'Configuration',
        'schema.json': 'SEO',
        'locations.json': 'Content',
        'content.json': 'Content',
        'footer.json': 'Content',
        'hero-content.json': 'Content',
        'location-extras.json': 'Content',
        'location-services.json': 'Content'
    };
    return categories[fileName] || 'Other';
}
