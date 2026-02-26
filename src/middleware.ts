import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { isValidStateCode } from './utils/state-codes';
import { isValidSubdomain } from './utils/subdomain';
import { ADMIN_AUTH_DISABLED } from '@/lib/admin-auth';

export default auth((req) => {
  const request = req as NextRequest & { auth?: { user?: unknown } };
  // Protect admin: redirect to login if not authenticated (skip when ADMIN_AUTH_DISABLED)
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  if (!ADMIN_AUTH_DISABLED && isAdminPage && !isLoginPage && !request.auth?.user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  function nextWithPath() {
    requestHeaders.set('x-pathname', url.pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  function rewriteWithPath() {
    requestHeaders.set('x-pathname', url.pathname);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // Redirect www to non-www (canonical = https://dolimitisteelroofing.com)
  if (hostname === 'www.dolimitisteelroofing.com') {
    url.hostname = 'dolimitisteelroofing.com';
    return NextResponse.redirect(url, 301); // Permanent redirect
  }

  // Redirect /locations/[id] and /locations/[id]/* to location subdomain
  if (hostname === 'dolimitisteelroofing.com') {
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'locations' && pathParts[1]) {
      const locationId = pathParts[1];
      if (isValidSubdomain(locationId)) {
        const subPath = pathParts.slice(2).join('/');
        url.hostname = `${locationId}.dolimitisteelroofing.com`;
        url.pathname = subPath ? `/${subPath}` : '/';
        return NextResponse.redirect(url, 301);
      }
    }
    // Redirect /states/[state] and /states/[state]/* to state subdomain
    if (pathParts[0] === 'states' && pathParts[1]) {
      const stateCode = pathParts[1];
      if (isValidStateCode(stateCode)) {
        const subPath = pathParts.slice(2).join('/');
        url.hostname = `${stateCode.toLowerCase()}.dolimitisteelroofing.com`;
        url.pathname = subPath ? `/${subPath}` : '/';
        return NextResponse.redirect(url, 301);
      }
    }
  }

  // Handle different domain patterns
  let subdomain = '';

  // Handle dolimitisteelroofing.com domain
  if (hostname.includes('.dolimitisteelroofing.com')) {
    subdomain = hostname.replace('.dolimitisteelroofing.com', '');
  } else if (hostname.includes('localhost')) {
    // For local development, extract subdomain from localhost
    const parts = hostname.split('.');
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  }

  // Check if this is a state subdomain (2-letter codes OR full state slugs)
  const stateCodes = ['ca', 'ny', 'tx', 'fl', 'il', 'pa', 'oh', 'ga', 'nc', 'mi', 'nj', 'va', 'wa', 'az', 'ma', 'tn', 'in', 'mo', 'md', 'co', 'mn', 'wi', 'sc', 'al', 'la', 'ky', 'or', 'ok', 'ct', 'ut', 'ia', 'nv', 'ar', 'ms', 'ks', 'ne', 'id', 'nh', 'me', 'nm', 'ri', 'hi', 'mt', 'de', 'sd', 'nd', 'ak', 'vt', 'wy', 'wv'];
  const stateSlugToCode: Record<string, string> = {
    'alabama': 'al', 'alaska': 'ak', 'arizona': 'az', 'arkansas': 'ar', 'california': 'ca',
    'colorado': 'co', 'connecticut': 'ct', 'delaware': 'de', 'florida': 'fl', 'georgia': 'ga',
    'hawaii': 'hi', 'idaho': 'id', 'illinois': 'il', 'indiana': 'in', 'iowa': 'ia',
    'kansas': 'ks', 'kentucky': 'ky', 'louisiana': 'la', 'maine': 'me', 'maryland': 'md',
    'massachusetts': 'ma', 'michigan': 'mi', 'minnesota': 'mn', 'mississippi': 'ms', 'missouri': 'mo',
    'montana': 'mt', 'nebraska': 'ne', 'nevada': 'nv', 'new-hampshire': 'nh', 'new-jersey': 'nj',
    'new-mexico': 'nm', 'new-york': 'ny', 'north-carolina': 'nc', 'north-dakota': 'nd', 'ohio': 'oh',
    'oklahoma': 'ok', 'oregon': 'or', 'pennsylvania': 'pa', 'rhode-island': 'ri', 'south-carolina': 'sc',
    'south-dakota': 'sd', 'tennessee': 'tn', 'texas': 'tx', 'utah': 'ut', 'vermont': 'vt',
    'virginia': 'va', 'washington': 'wa', 'west-virginia': 'wv', 'wisconsin': 'wi', 'wyoming': 'wy'
  };
  const subLower = subdomain.toLowerCase();
  const isStateCode = stateCodes.includes(subLower);
  const isStateSlug = subLower in stateSlugToCode;
  const isStateSubdomain = isStateCode || isStateSlug;
  const resolvedStateSlug = isStateCode ? subLower : (stateSlugToCode[subLower] || subLower);

  // If it's www or the root domain, let it go normally
  if (subdomain === 'www' || subdomain === 'dolimitisteelroofing' || subdomain === 'localhost') {
    return nextWithPath();
  }

  // If no subdomain found, continue normally
  if (!subdomain) {
    return nextWithPath();
  }

  // Handle homepage (/) - rewrite to appropriate page
  if (url.pathname === '/') {
    if (isStateSubdomain) {
      url.pathname = `/states/${resolvedStateSlug}`;
    } else {
      url.pathname = `/locations/${subdomain}`;
    }
    return rewriteWithPath();
  }

  // Handle services page (/services) - rewrite to appropriate services page
  if (url.pathname === '/services') {
    if (isStateSubdomain) {
      url.pathname = `/states/${resolvedStateSlug}/services`;
    } else {
      url.pathname = `/locations/${subdomain}/services`;
    }
    return rewriteWithPath();
  }

  // Handle about page (/about) - rewrite to appropriate about page
  if (url.pathname === '/about') {
    if (isStateSubdomain) {
      url.pathname = `/states/${resolvedStateSlug}/about`;
    } else {
      url.pathname = `/locations/${subdomain}/about`;
    }
    return rewriteWithPath();
  }

  // Handle contact page (/contact) - rewrite to appropriate contact page
  if (url.pathname === '/contact') {
    if (isStateSubdomain) {
      url.pathname = `/states/${resolvedStateSlug}/contact`;
    } else {
      url.pathname = `/locations/${subdomain}/contact`;
    }
    return rewriteWithPath();
  }

  // Block access to main domain service pages on sub-domains to prevent duplicate content
  const pathSegments = url.pathname.split('/').filter(Boolean);

  // If trying to access /services/* on sub-domain, redirect to appropriate services page
  if (pathSegments[0] === 'services' && pathSegments.length === 1) {
    if (isStateSubdomain) {
      url.pathname = `/states/${resolvedStateSlug}/services`;
    } else {
      url.pathname = `/locations/${subdomain}/services`;
    }
    return rewriteWithPath();
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

  // City subdomain only: redirect long cost-calculator URL to short
  if (!isStateSubdomain && subdomain && pathSegments.length === 3 && pathSegments[0].toLowerCase() === subdomain.toLowerCase() && serviceSlugs.includes(pathSegments[1]) && pathSegments[2] === 'cost-calculator') {
    const shortPath = `/${pathSegments[1]}/cost-calculator`;
    return NextResponse.redirect(new URL(shortPath, request.url), 301);
  }

  // City subdomain only: rewrite short cost-calculator URL to internal long path
  if (!isStateSubdomain && subdomain && pathSegments.length === 2 && serviceSlugs.includes(pathSegments[0]) && pathSegments[1] === 'cost-calculator') {
    url.pathname = `/${subdomain}/${pathSegments[0]}/cost-calculator`;
    return rewriteWithPath();
  }

  // If trying to access main domain service page directly on sub-domain, redirect to appropriate version
  if (pathSegments.length === 1 && serviceSlugs.includes(pathSegments[0])) {
    if (isStateSubdomain) {
      url.pathname = `/states/${resolvedStateSlug}/${pathSegments[0]}`;
    } else {
      url.pathname = `/locations/${subdomain}/${pathSegments[0]}`;
    }
    return rewriteWithPath();
  }

  // Block access to other main domain pages on sub-domains to prevent duplicate content
  const blockedPaths = [
    'states',
    'api',
    'robots.txt'
  ];

  if (pathSegments.length > 0 && blockedPaths.includes(pathSegments[0])) {
    // Redirect to main domain (non-www) for blocked paths on sub-domains
    url.hostname = 'dolimitisteelroofing.com';
    return NextResponse.redirect(url, 301);
  }

  // Handle invalid subdomains - redirect to main domain (non-www)
  if (subdomain && !isStateSubdomain) {
    if (!isValidSubdomain(subdomain)) {
      url.hostname = 'dolimitisteelroofing.com';
      return NextResponse.redirect(url, 301);
    }
  }

  // For all other routes, let them go through normally
  return nextWithPath();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
