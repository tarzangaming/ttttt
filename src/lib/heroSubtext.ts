import heroContent from '@/data/hero-content.json';
import siteConfig from '@/data/site.config.json';

export type HeroSubtextInput = {
    serviceKey: string;
    serviceLabel?: string;
    city: string;
    state: string;
    phone: string;
};

type ServiceCopy = {
    keyword: string;
    action: string;
    altOpeners: string[];
};

const SERVICE_MAP: Record<string, ServiceCopy> = heroContent.serviceTemplates as any;
const HERO_MODIFIERS = heroContent.heroModifiers;
const CLIMATE_LINES: Record<string, string> = heroContent.climateLines;

function getClimateLine(state: string, city: string) {
    const st = state.trim().toUpperCase();
    const template = CLIMATE_LINES[st] || CLIMATE_LINES['default'];
    return template.replace(/{CITY}/g, city);
}

function pickVariant<T>(arr: T[], seedStr: string): T {
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
    return arr[h % arr.length];
}

function titleCaseService(serviceKey: string) {
    return serviceKey
        .replace(/-/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
}

export type DynamicHeroInput = HeroSubtextInput & {
    zipCodes?: string[];
};

export type LocationPageType = 'about' | 'contact' | 'services' | 'location';

export function buildLocationPageHeroSubtext(input: {
    city: string;
    state: string;
    pageType: LocationPageType;
    zipCodes?: string[];
}): { line1: string; line2: string; line3: string } {
    const { city, state, pageType } = input;
    const templates = heroContent.locationPageHeroTemplates as Record<LocationPageType, { line1: string; line2: string; line3: string }>;
    const template = templates[pageType];

    const replace = (s: string) => s.replace(/{CITY}/g, city).replace(/{STATE}/g, state);

    return {
        line1: replace(template.line1),
        line2: replace(template.line2),
        line3: replace(template.line3),
    };
}

export function buildDynamicHeroHeader(input: {
    serviceLabel: string;
    city: string;
    state: string;
    zipCodes?: string[];
    seed?: string;
}): string {
    const { serviceLabel, city, state, zipCodes = [], seed = '' } = input;
    const modifier = pickVariant([...HERO_MODIFIERS], `header|${serviceLabel}|${city}|${state}|${seed}`);
    const zipPart = zipCodes.length > 0 ? ` ${zipCodes[0]}` : '';
    return `${modifier} ${serviceLabel} in ${city}, ${state}${zipPart}`;
}

export function buildDynamicHeroSubtextLines(input: DynamicHeroInput): { line1: string; line2: string; line3: string } {
    const { serviceKey, serviceLabel, city, state } = input;
    const serviceName = serviceLabel || titleCaseService(serviceKey);
    const svc = SERVICE_MAP[serviceKey];

    const keyword = svc?.keyword || serviceName.toLowerCase();
    const action = svc?.action || 'delivering high-quality workmanship with durable materials and long-term protection';

    const audience = serviceKey === 'commercial-roofing'
        ? heroContent.commercialAudience
        : heroContent.defaultAudience;
    const line1 = `Reliable ${keyword} solutions for ${city}'s ${audience}.`;
    const line2 = `We specialize in ${action}, built for long-term performance in ${city}, ${state}.`;
    const line3 = `${getClimateLine(state, city)} Licensed, insured, and trusted for 25+ years—call for a free estimate.`;

    return { line1, line2, line3 };
}

export function buildHeroSubtext(input: HeroSubtextInput) {
    const { serviceKey, serviceLabel, city, state, phone } = input;

    const svc =
        SERVICE_MAP[serviceKey] ||
        ({
            keyword: (serviceLabel || titleCaseService(serviceKey)).toLowerCase(),
            action:
                "delivering high-quality workmanship with durable materials and a focus on long-term protection",
            altOpeners: [
                "Need {SERVICE} in {CITY}, {STATE}?",
                "Looking for {SERVICE} in {CITY}, {STATE}?",
                "Get expert {SERVICE} in {CITY}, {STATE}.",
            ],
        } as ServiceCopy);

    const serviceName = serviceLabel || titleCaseService(serviceKey);
    const opener = pickVariant(svc.altOpeners, `${serviceKey}|${city}|${state}`)
        .replace(/{SERVICE}/g, serviceName.toLowerCase())
        .replace(/{CITY}/g, city)
        .replace(/{STATE}/g, state);

    const line1 = opener;
    const line2 = `We specialize in ${svc.action}, built for long-term performance in ${city}.`;
    const line3 = getClimateLine(state, city);
    const microCta = `Contact ${phone} for a free ${svc.keyword} estimate in ${city}, ${state}.`;

    return { line1, line2, line3, microCta };
}

export function buildIntroContent(input: HeroSubtextInput) {
    const { serviceKey, serviceLabel, city, state } = input;
    const serviceName = serviceLabel || titleCaseService(serviceKey);
    const svc = SERVICE_MAP[serviceKey];
    const companyName = siteConfig.companyName;

    const template = heroContent.introTemplate;
    const headline = template.headlineTemplate
        .replace(/{SERVICE}/g, serviceName)
        .replace(/{CITY}/g, city)
        .replace(/{STATE}/g, state);

    const actionSentence = svc
        ? svc.action.charAt(0).toUpperCase() + svc.action.slice(1)
        : 'We deliver top-tier results';

    const introParagraphs = template.paragraphs.map(p =>
        p.replace(/{SERVICE}/g, serviceName)
         .replace(/{SERVICE_LOWER}/g, serviceName.toLowerCase())
         .replace(/{CITY}/g, city)
         .replace(/{STATE}/g, state)
         .replace(/{COMPANY}/g, companyName)
         .replace(/{ACTION_SENTENCE}/g, actionSentence)
    );

    return {
        headline,
        paragraphs: introParagraphs
    };
}
