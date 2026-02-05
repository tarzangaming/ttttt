import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  return key ? new OpenAI({ apiKey: key }) : null;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

const REBRAND_FILES = [
  'site.config.json',
  'content.json',
  'seo.json',
  'services.json',
] as const;

export type RebrandInput = {
  brandName?: string;
  companyName?: string;
  shortName?: string;
  domain?: string;
  phone?: string;
  phoneClean?: string;
  email?: string;
  tagline?: string;
  industry?: string;
  tone?: 'professional' | 'bold' | 'friendly';
  country?: string;
  yearsInBusiness?: string;
  scope?: 'full' | 'homepage';
  apply?: boolean;
};

function buildRebrandPrompt(
  fileName: string,
  currentJson: object,
  input: RebrandInput
): string {
  const companyName = input.companyName || input.brandName || 'New Company';
  const shortName = input.shortName || companyName.split(/\s+/)[0] || 'Company';
  const industry = input.industry || 'roofing';
  const tone = input.tone || 'professional';
  const country = input.country || 'USA';

  return `You are a professional brand copywriter rebranding a ${industry} company website.

TASK: Rewrite ALL text content for the new brand. Update every section: hero, features, whyChooseUs, coverage, CTAs, descriptions, titles, subtitles, meta, etc.
Preserve the EXACT JSON structure, keys, nesting, and icons (emoji). Only change text/string values.
Do NOT change: slugs, ids, icon emojis, URLs structure, field names, array lengths.
Do NOT add or remove any keys.

NEW BRAND:
- Company Name: ${companyName}
- Short Name: ${shortName}
- Industry: ${industry}
- Tone: ${tone}
- Target Country: ${country}
${input.domain ? `- Domain: ${input.domain}` : ''}
${input.phone ? `- Phone: ${input.phone}` : ''}
${input.email ? `- Email: ${input.email}` : ''}
${input.tagline ? `- Tagline: ${input.tagline}` : ''}
${input.yearsInBusiness ? `- Years in Business: ${input.yearsInBusiness}` : ''}

Return ONLY valid JSON. No markdown, no code blocks, no explanation.`;
}

async function rebrandWithAI(
  openai: OpenAI,
  fileName: string,
  currentJson: object,
  input: RebrandInput
): Promise<object> {
  const prompt = buildRebrandPrompt(fileName, currentJson, input);
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a JSON rebranding assistant. You return only valid JSON. Never wrap in markdown code blocks.',
      },
      {
        role: 'user',
        content: `${prompt}\n\nCurrent JSON:\n${JSON.stringify(currentJson, null, 2)}`,
      },
    ],
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '{}';
  // Remove markdown code blocks if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(cleaned) as object;
}

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RebrandInput;
    const brandName = body.brandName || body.companyName;
    if (!brandName || typeof brandName !== 'string' || !brandName.trim()) {
      return NextResponse.json(
        { error: 'Missing required field: brandName or companyName' },
        { status: 400 }
      );
    }

    const input: RebrandInput = {
      ...body,
      brandName: brandName.trim(),
      companyName: body.companyName || brandName.trim(),
      shortName: body.shortName || brandName.trim().split(/\s+/)[0],
      scope: body.scope || 'full',
      apply: !!body.apply,
    };
    if (body.phone) {
      input.phoneClean = body.phoneClean || body.phone.replace(/\D/g, '');
    }

    const results: Record<string, object> = {};
    const errors: string[] = [];
    const scope = input.scope || 'full';
    const apply = input.apply;

    // Determine which files/sections to process
    const filesToProcess =
      scope === 'homepage'
        ? (['site.config.json', 'content.json'] as const)
        : REBRAND_FILES;

    for (const fileName of filesToProcess) {
      const filePath = path.join(DATA_DIR, fileName);
      if (!fs.existsSync(filePath)) {
        results[fileName] = { _skipped: true, reason: 'File not found' };
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const currentJson = JSON.parse(content) as object;

        let payload: object;
        let rebranded: object;

        if (scope === 'homepage' && fileName === 'content.json') {
          const contentData = currentJson as { mainWebsite?: { homepage?: object }; locationPages?: object };
          const homepage = contentData.mainWebsite?.homepage ?? {};
          rebranded = await rebrandWithAI(openai, 'content.json (homepage)', homepage, input);
          payload = {
            ...contentData,
            mainWebsite: {
              ...contentData.mainWebsite,
              homepage: rebranded,
            },
          };
        } else if (scope === 'homepage' && fileName === 'site.config.json') {
          rebranded = await rebrandWithAI(openai, fileName, currentJson, input);
          payload = rebranded;
        } else {
          rebranded = await rebrandWithAI(openai, fileName, currentJson, input);
          payload = rebranded;
        }

        results[fileName] = payload;

        if (apply) {
          const backupDir = path.join(DATA_DIR, '.backups');
          if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
          }
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
          fs.copyFileSync(filePath, backupPath);
          fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${fileName}: ${msg}`);
        results[fileName] = { _error: msg };
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      apply,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message: apply
        ? 'Rebrand applied. Backups saved in src/data/.backups'
        : 'Preview only. Set apply: true to write files.',
    });
  } catch (error) {
    console.error('Rebrand API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Rebrand failed' },
      { status: 500 }
    );
  }
}
