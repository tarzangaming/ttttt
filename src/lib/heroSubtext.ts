// lib/heroSubtext.ts
// Dynamic Hero Sub-text generator (service + city + state + phone + climate)

export type HeroSubtextInput = {
    serviceKey: string;      // e.g. "roof-replacement"
    serviceLabel?: string;   // e.g. "Roof Replacement" (optional)
    city: string;            // e.g. "Gold Canyon"
    state: string;           // e.g. "AZ"
    phone: string;           // e.g. "(844) 551-3620"
};

type ServiceCopy = {
    keyword: string;  // phrase used in "Need ..."
    action: string;   // "We specialize in ..."
    altOpeners: string[]; // rotate
};

const SERVICE_MAP: Record<string, ServiceCopy> = {
    "curb-appeal-boost": {
        keyword: "curb appeal",
        action: "enhancing your home's exterior aesthetic with coordinated roofing, siding, and gutter upgrades",
        altOpeners: [
            "Want to boost curb appeal in {{CITY}}, {{STATE}}?",
            "Improving your home's look in {{CITY}}, {{STATE}}?",
            "Upgrade your exterior in {{CITY}}, {{STATE}}.",
        ],
    },
    // ... (any other legacy ones)

    // Complete Services List
    "roof-installation": {
        keyword: "roof installation",
        action: "installing high-quality roofing systems for new and existing homes using durable materials and proven installation practices",
        altOpeners: [
            "Looking for professional {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Planning a new {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Need a trusted team for {{SERVICE}} in {{CITY}}, {{STATE}}?",
        ],
    },
    "new-roof-installation": {
        keyword: "new roof construction",
        action: "coordinating with builders to install precise, code-compliant roofing systems for new construction projects",
        altOpeners: [
            "Building a new home in {{CITY}}, {{STATE}}?",
            "Need {{SERVICE}} for a project in {{CITY}}, {{STATE}}?",
            "Expert {{SERVICE}} in {{CITY}}, {{STATE}}.",
        ],
    },
    "roof-replacement": {
        keyword: "roof replacement",
        action: "replacing old or damaged roofs with long-lasting materials designed for performance, curb appeal, and peace of mind",
        altOpeners: [
            "Need a {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Is it time for a {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Looking for reliable {{SERVICE}} in {{CITY}}, {{STATE}}?",
        ],
    },
    "roof-repair": {
        keyword: "roof repair",
        action: "fixing leaks, storm damage, and worn roofing before problems spread—restoring protection fast and correctly",
        altOpeners: [
            "Need fast {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Dealing with leaks? Get {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Looking for dependable {{SERVICE}} in {{CITY}}, {{STATE}}?",
        ],
    },
    "roof-leak-repair": {
        keyword: "roof leak repair",
        action: "tracing and stopping stubborn leaks at their source to prevent water damage to your drywall and insulation",
        altOpeners: [
            "Spot a leak in {{CITY}}, {{STATE}}?",
            "Need untimate {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Stop water damage with {{SERVICE}} in {{CITY}}, {{STATE}}.",
        ]
    },
    "emergency-roof-repair": {
        keyword: "emergency roof repair",
        action: "providing rapid-response repairs for active leaks and storm damage to prevent further structural issues",
        altOpeners: [
            "Roof damage that can’t wait in {{CITY}}, {{STATE}}?",
            "Need urgent {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Leaking now? Get {{SERVICE}} in {{CITY}}, {{STATE}}.",
        ],
    },
    "storm-damage-roof-repair": {
        keyword: "storm damage repair",
        action: "assessing and repairing roofs impacted by wind, hail, or debris, and helping you document damage for insurance",
        altOpeners: [
            "Hit by a storm in {{CITY}}, {{STATE}}?",
            "Need {{SERVICE}} after recent weather in {{CITY}}, {{STATE}}?",
            "Restore your home with {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "metal-roofing": {
        keyword: "metal roofing",
        action: "installing energy-efficient, durable metal roofing built for long lifespan, strong protection, and modern curb appeal",
        altOpeners: [
            "Considering {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Ready to upgrade to {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Looking for {{SERVICE}} experts in {{CITY}}, {{STATE}}?",
        ],
    },
    "tile-roofing": {
        keyword: "tile roofing",
        action: "installing and repairing concrete and clay tile roofs that offer superior durability and classic Southwest style",
        altOpeners: [
            "Interested in {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Need expert {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Protect your home with {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "shingle-roofing": {
        keyword: "shingle roofing",
        action: "installing high-performance asphalt shingles that combine affordability with excellent weather resistance",
        altOpeners: [
            "Need quality {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Looking for affordable {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Get a free quote for {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "foam-roofing": {
        keyword: "foam roofing",
        action: "applying seamless spray polyurethane foam (SPF) for unmatched insulation and leak protection on flat roofs",
        altOpeners: [
            "Need energy-efficient {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Looking for {{SERVICE}} experts in {{CITY}}, {{STATE}}?",
            "Seal your roof with {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "commercial-roofing": {
        keyword: "commercial roofing",
        action: "delivering code-compliant commercial roofing solutions—installation, repairs, and maintenance with minimal disruption",
        altOpeners: [
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Searching for a {{SERVICE}} contractor in {{CITY}}, {{STATE}}?",
            "Looking for dependable {{SERVICE}} in {{CITY}}, {{STATE}}?",
        ],
    },
    "flat-roofing": {
        keyword: "flat roof services",
        action: "installing and repairing flat roofing systems engineered for drainage, durability, and long-term performance",
        altOpeners: [
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Looking for {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Get expert {{SERVICE}} in {{CITY}}, {{STATE}}.",
        ],
    },
    "flat-roofing-systems": {
        keyword: "flat roofing system",
        action: "implementing complete flat roof solutions including TPO, EPDM, and modified bitumen for commercial assets",
        altOpeners: [
            "Upgrading your {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Need a new {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Expert {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "flat-roof-repair": {
        keyword: "flat roof repair",
        action: "diagnosing and fixing ponding water, blistering, and leaks on low-slope roofs to extend their service life",
        altOpeners: [
            "Need {{SERVICE}} for your building in {{CITY}}, {{STATE}}?",
            "Having issues? Get {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Fast {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "roof-coatings": {
        keyword: "roof coating",
        action: "applying restorative silicone or acrylic coatings to extend your roof's life and improve energy efficiency",
        altOpeners: [
            "Consider {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Extend roof life with {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Save energy with {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "roof-inspection-maintenance": {
        keyword: "roof inspection",
        action: "inspecting your roof thoroughly and preventing costly damage with maintenance plans that keep your system performing year-round",
        altOpeners: [
            "Want a professional {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Get peace of mind with {{SERVICE}} in {{CITY}}, {{STATE}}.",
        ],
    },
    "roof-inspection": {
        keyword: "roof inspection",
        action: "providing detailed roof assessments and photo reports for real estate transactions or insurance purposes",
        altOpeners: [
            "Need a {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Buying a home? Get a {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Schedule your {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "roof-maintenance-plans": {
        keyword: "roof maintenance",
        action: "performing regular cleaning, sealing, and inspections to catch small issues before they become expensive repairs",
        altOpeners: [
            "Protect your investment with {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Sign up for {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?"
        ]
    },
    "gutter-installation": {
        keyword: "gutter installation",
        action: "installing and optimizing seamless gutter systems to protect your roof, siding, and foundation from water damage",
        altOpeners: [
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Looking for {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Upgrade your home with {{SERVICE}} in {{CITY}}, {{STATE}}.",
        ],
    },
    "gutter-repair": {
        keyword: "gutter repair",
        action: "realigning, sealing, and fixing damaged gutters to ensure proper water diversion away from your home",
        altOpeners: [
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Gutters leaking? Get {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Fix your drainage with {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "gutter-cleaning": {
        keyword: "gutter cleaning",
        action: "removing debris and ensuring downspouts are clear to prevent overflows and water damage during storms",
        altOpeners: [
            "Time for {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Need professional {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Get {{SERVICE}} done right in {{CITY}}, {{STATE}}."
        ]
    },
    "gutter-guards": {
        keyword: "gutter guard installation",
        action: "installing protective guards to keep leaves out and reduce the need for frequent gutter cleaning",
        altOpeners: [
            "Tired of cleaning? Get {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Install {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Protect your gutters with {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    },
    "siding-installation": {
        keyword: "siding installation",
        action: "installing premium vinyl or fiber cement siding to beautify your home and improve its thermal efficiency",
        altOpeners: [
            "Ready for {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Upgrade your exterior with {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?"
        ]
    },
    "general-construction": {
        keyword: "general construction",
        action: "managing residential and commercial construction projects from additions to remodels with licensed expertise",
        altOpeners: [
            "Planning a project? Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Looking for {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Start your {{SERVICE}} project in {{CITY}}, {{STATE}}."
        ]
    },
    "skylight-services": {
        keyword: "skylight services",
        action: "installing and repairing skylights to bring natural light into your home without compromising your roof's seal",
        altOpeners: [
            "Brighten your home with {{SERVICE}} in {{CITY}}, {{STATE}}.",
            "Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
            "Expert {{SERVICE}} in {{CITY}}, {{STATE}}."
        ]
    }
};

// State-based climate lines (extend as needed)
function getClimateLine(state: string, city: string) {
    const st = state.trim().toUpperCase();
    if (st === "AZ") return `Built to handle ${city}’s heat, sun exposure, and monsoon seasons.`;
    if (st === "TX") return `Designed for Texas heat, storms, and seasonal weather changes.`;
    if (st === "FL") return `Engineered for humidity, heavy rain, and hurricane conditions.`;
    if (st === "CA") return `Built for sun exposure, temperature swings, and seasonal storms.`;
    return `Built for local weather conditions and long-term durability.`;
}

// Simple deterministic picker (stable per city+service)
function pickVariant<T>(arr: T[], seedStr: string): T {
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
    return arr[h % arr.length];
}

// Hero header modifiers for SEO variety
const HERO_MODIFIERS = ['Best', 'Professional', 'Expert', 'Top-Rated'] as const;

export type DynamicHeroInput = HeroSubtextInput & {
    zipCodes?: string[];
};

export type LocationPageType = 'about' | 'contact' | 'services' | 'location';

/**
 * Build 3-line SEO subtext for location pages (about, contact, services, location)
 */
export function buildLocationPageHeroSubtext(input: {
    city: string;
    state: string;
    pageType: LocationPageType;
    zipCodes?: string[];
}): { line1: string; line2: string; line3: string } {
    const { city, state, pageType } = input;

    const templates: Record<LocationPageType, { line1: string; line2: string; line3: string }> = {
        location: {
            line1: `Trusted local experts for roof repair, replacement, and storm damage restoration in ${city}, ${state}.`,
            line2: `From residential to commercial—we deliver quality craftsmanship built for ${city}'s climate and conditions.`,
            line3: `Licensed, insured, and trusted for 25+ years. Free estimates. Call for same-day service.`,
        },
        about: {
            line1: `Trusted roofing and construction experts serving ${city} and surrounding areas since 2000.`,
            line2: `Our licensed team brings 25+ years of experience to every project—residential, commercial, and industrial.`,
            line3: `Quality craftsmanship, transparent pricing, and satisfaction guaranteed. Call for a free estimate today.`,
        },
        contact: {
            line1: `Get fast, reliable roofing and construction services in ${city}, ${state}. Free estimates available.`,
            line2: `Speak with our expert team for emergency repairs, new installations, and ongoing maintenance.`,
            line3: `24/7 emergency service. Licensed, insured, and committed to your satisfaction. Call now.`,
        },
        services: {
            line1: `Comprehensive roofing and construction solutions tailored for ${city} homes and businesses.`,
            line2: `From roof repair and replacement to gutters, siding, and general construction—we do it all.`,
            line3: `Licensed, insured, and trusted for 25+ years. Get your free estimate from local experts today.`,
        },
    };
    return templates[pageType];
}

/**
 * Build dynamic H1 header: [Best|Professional|Expert|Top-Rated] [Service] in [City], [State] [Zipcode]
 */
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

/**
 * Build 3-line SEO-optimized subtext for hero section
 */
export function buildDynamicHeroSubtextLines(input: DynamicHeroInput): { line1: string; line2: string; line3: string } {
    const { serviceKey, serviceLabel, city, state } = input;
    const serviceName = serviceLabel || titleCaseService(serviceKey);
    const svc = SERVICE_MAP[serviceKey];

    const keyword = svc?.keyword || serviceName.toLowerCase();
    const action = svc?.action || 'delivering high-quality workmanship with durable materials and long-term protection';

    const audience = serviceKey === 'commercial-roofing' ? "businesses, warehouses, and HOAs" : "businesses, warehouses, and homeowners";
    const line1 = `Reliable ${keyword} solutions for ${city}'s ${audience}.`;
    const line2 = `We specialize in ${action}, built for long-term performance in ${city}, ${state}.`;
    const line3 = `${getClimateLine(state, city)} Licensed, insured, and trusted for 25+ years—call for a free estimate.`;

    return { line1, line2, line3 };
}

function titleCaseService(serviceKey: string) {
    return serviceKey
        .replace(/-/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
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
                "Need {{SERVICE}} in {{CITY}}, {{STATE}}?",
                "Looking for {{SERVICE}} in {{CITY}}, {{STATE}}?",
                "Get expert {{SERVICE}} in {{CITY}}, {{STATE}}.",
            ],
        } as ServiceCopy);

    const serviceName = serviceLabel || titleCaseService(serviceKey);
    const opener = pickVariant(svc.altOpeners, `${serviceKey}|${city}|${state}`)
        .replaceAll("{{SERVICE}}", serviceName.toLowerCase())
        .replaceAll("{{CITY}}", city)
        .replaceAll("{{STATE}}", state);

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

    const headline = `Best ${serviceName} in ${city}, ${state}`;

    // Generate rich, detailed paragraphs
    const introParagraphs = [
        `When you need reliable ${serviceName.toLowerCase()} in ${city}, trust the experts at Dolomiti Steel Roofing. We bring over 25 years of experience to every project, ensuring quality workmanship and superior customer service.`,

        `Our team understands the specific challenges posed by ${city}'s climate, from intense sun exposure to seasonal storms. We use only premium materials and proven installation techniques to ensure your ${serviceName.toLowerCase()} stands the test of time.`,

        `Whether you're upgrading your home or addressing urgent repairs, we act as your local partners in maintaining property value and safety. ${svc ? svc.action.charAt(0).toUpperCase() + svc.action.slice(1) : 'We deliver top-tier results'} with a focus on durability and aesthetic appeal.`
    ];

    return {
        headline,
        paragraphs: introParagraphs
    };
}
