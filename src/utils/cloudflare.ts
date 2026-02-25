import { NextRequest } from 'next/server';

/**
 * Get the real visitor IP address when behind Cloudflare proxy
 * Cloudflare provides the real IP in the 'cf-connecting-ip' header
 */
export function getRealIP(request: NextRequest): string {
  // Cloudflare provides real IP in cf-connecting-ip header
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  // Fallback to other headers if Cloudflare header not present
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  
  // Return Cloudflare IP first, then fallback to others
  return cfConnectingIP || xForwardedFor?.split(',')[0].trim() || xRealIP || request.ip || 'unknown';
}

/**
 * Check if request is coming through Cloudflare proxy
 */
export function isCloudflareProxy(request: NextRequest): boolean {
  return !!request.headers.get('cf-ray') || !!request.headers.get('cf-connecting-ip');
}

/**
 * Get Cloudflare country code (if available)
 */
export function getCloudflareCountry(request: NextRequest): string | null {
  return request.headers.get('cf-ipcountry') || null;
}

/**
 * Get Cloudflare cache status
 */
export function getCloudflareCacheStatus(request: NextRequest): string | null {
  return request.headers.get('cf-cache-status') || null;
}

/**
 * Get Cloudflare Ray ID (for debugging)
 */
export function getCloudflareRayID(request: NextRequest): string | null {
  return request.headers.get('cf-ray') || null;
}
