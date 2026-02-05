import { NextResponse, NextRequest } from 'next/server';
import { isValidStateCode } from './utils/state-codes';
import { isValidSubdomain } from './utils/subdomain';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Redirect www to non-www (canonical = https://bennettconstructionandroofing.com)
  if (hostname === 'www.bennettconstructionandroofing.com') {
    url.hostname = 'bennettconstructionandroofing.com';
    return NextResponse.redirect(url, 301); // Permanent redirect
  }

  // Redirect /locations/[id] and /locations/[id]/* to location subdomain
  if (hostname === 'bennettconstructionandroofing.com') {
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'locations' && pathParts[1]) {
      const locationId = pathParts[1];
      if (isValidSubdomain(locationId)) {
        const subPath = pathParts.slice(2).join('/');
        url.hostname = `${locationId}.bennettconstructionandroofing.com`;
        url.pathname = subPath ? `/${subPath}` : '/';
        return NextResponse.redirect(url, 301);
      }
    }
    // Redirect /states/[state] and /states/[state]/* to state subdomain
    if (pathParts[0] === 'states' && pathParts[1]) {
      const stateCode = pathParts[1];
      if (isValidStateCode(stateCode)) {
        const subPath = pathParts.slice(2).join('/');
        url.hostname = `${stateCode.toLowerCase()}.bennettconstructionandroofing.com`;
        url.pathname = subPath ? `/${subPath}` : '/';
        return NextResponse.redirect(url, 301);
      }
    }
  }

  // Handle different domain patterns
  let subdomain = '';

  // Handle bennettconstructionandroofing.com domain
  if (hostname.includes('.bennettconstructionandroofing.com')) {
    subdomain = hostname.replace('.bennettconstructionandroofing.com', '');
  } else if (hostname.includes('localhost')) {
    // For local development, extract subdomain from localhost
    const parts = hostname.split('.');
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  }

  // Check if this is a state subdomain (2-letter state codes)
  const stateCodes = ['ca', 'ny', 'tx', 'fl', 'il', 'pa', 'oh', 'ga', 'nc', 'mi', 'nj', 'va', 'wa', 'az', 'ma', 'tn', 'in', 'mo', 'md', 'co', 'mn', 'wi', 'sc', 'al', 'la', 'ky', 'or', 'ok', 'ct', 'ut', 'ia', 'nv', 'ar', 'ms', 'ks', 'ne', 'id', 'nh', 'me', 'nm', 'ri', 'hi', 'mt', 'de', 'sd', 'nd', 'ak', 'vt', 'wy', 'wv'];
  const isStateSubdomain = stateCodes.includes(subdomain.toLowerCase());

  // If it's www or the root domain, let it go normally
  if (subdomain === 'www' || subdomain === 'bennettconstructionandroofing' || subdomain === 'localhost') {
    return NextResponse.next();
  }

  // If no subdomain found, continue normally
  if (!subdomain) {
    return NextResponse.next();
  }

  // Handle homepage (/) - rewrite to appropriate page
  if (url.pathname === '/') {
    if (isStateSubdomain) {
      url.pathname = `/states/${subdomain}`;
    } else {
      url.pathname = `/locations/${subdomain}`;
    }
    return NextResponse.rewrite(url);
  }

  // Handle services page (/services) - rewrite to appropriate services page
  if (url.pathname === '/services') {
    if (isStateSubdomain) {
      url.pathname = `/states/${subdomain}/services`;
    } else {
      url.pathname = `/locations/${subdomain}/services`;
    }
    return NextResponse.rewrite(url);
  }

  // Handle about page (/about) - rewrite to appropriate about page
  if (url.pathname === '/about') {
    if (isStateSubdomain) {
      url.pathname = `/states/${subdomain}/about`;
    } else {
      url.pathname = `/locations/${subdomain}/about`;
    }
    return NextResponse.rewrite(url);
  }

  // Handle contact page (/contact) - rewrite to appropriate contact page
  if (url.pathname === '/contact') {
    if (isStateSubdomain) {
      url.pathname = `/states/${subdomain}/contact`;
    } else {
      url.pathname = `/locations/${subdomain}/contact`;
    }
    return NextResponse.rewrite(url);
  }

  // Block access to main domain service pages on sub-domains to prevent duplicate content
  const pathSegments = url.pathname.split('/').filter(Boolean);

  // If trying to access /services/* on sub-domain, redirect to appropriate services page
  if (pathSegments[0] === 'services' && pathSegments.length === 1) {
    if (isStateSubdomain) {
      url.pathname = `/states/${subdomain}/services`;
    } else {
      url.pathname = `/locations/${subdomain}/services`;
    }
    return NextResponse.rewrite(url);
  }

  // Construction/Roofing service slugs (must match services.json for subdomain rewrites)
  const serviceSlugs = [
    'roof-installation',
    'roof-repair',
    'roof-leak-repair',
    'roof-replacement',
    'new-roof-installation',
    'foam-roofing',
    'tile-roofing',
    'metal-roofing',
    'shingle-roofing',
    'flat-roof-repair',
    'flat-roofing-systems',
    'roof-coatings',
    'commercial-roofing',
    'storm-damage-roof-repair',
    'emergency-roof-repair',
    'roof-maintenance-plans',
    'roof-inspection',
    'gutter-installation',
    'gutter-repair',
    'gutter-guards',
    'gutter-cleaning',
    'general-construction',
    'siding-installation',
    'skylight-services',
    'emergency-roof-tarping',
    'siding-repair',
    'home-remodeling',
    'exterior-remodeling'
  ];

  // If trying to access main domain service page directly on sub-domain, redirect to appropriate version
  if (pathSegments.length === 1 && serviceSlugs.includes(pathSegments[0])) {
    if (isStateSubdomain) {
      url.pathname = `/states/${subdomain}/${pathSegments[0]}`;
    } else {
      url.pathname = `/locations/${subdomain}/${pathSegments[0]}`;
    }
    return NextResponse.rewrite(url);
  }

  // Block access to other main domain pages on sub-domains to prevent duplicate content
  const blockedPaths = [
    'states',
    'api',
    'robots.txt'
  ];

  if (pathSegments.length > 0 && blockedPaths.includes(pathSegments[0])) {
    // Redirect to main domain (non-www) for blocked paths on sub-domains
    url.hostname = 'bennettconstructionandroofing.com';
    return NextResponse.redirect(url, 301);
  }

  // Handle invalid subdomains - redirect to main domain (non-www)
  if (subdomain && !isStateSubdomain) {
    if (!isValidSubdomain(subdomain)) {
      url.hostname = 'bennettconstructionandroofing.com';
      return NextResponse.redirect(url, 301);
    }
  }

  // For all other routes, let them go through normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
