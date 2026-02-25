# Cloudflare Setup Guide for Bennett Construction & Roofing

## Overview
This guide will help you integrate Cloudflare CDN/Proxy with your Next.js app deployed on Vercel.

## Benefits of Cloudflare
- ✅ **CDN**: Faster page loads worldwide
- ✅ **DDoS Protection**: Automatic protection
- ✅ **SSL/TLS**: Free SSL certificates
- ✅ **Caching**: Reduce Vercel bandwidth costs
- ✅ **Analytics**: Better traffic insights
- ✅ **Rate Limiting**: Prevent abuse

---

## Step 1: Add Domain to Cloudflare

1. **Sign up/Login**: Go to https://dash.cloudflare.com
2. **Add Site**: Click "Add a Site" → Enter `bennettconstructionandroofing.com`
3. **Select Plan**: Choose **Free** plan (sufficient for most needs)
4. **Scan DNS**: Cloudflare will automatically scan your existing DNS records

---

## Step 2: Update Nameservers

1. **Copy Cloudflare Nameservers** (shown in dashboard, e.g.):
   - `alice.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`

2. **Go to Your Domain Registrar** (where you bought the domain)
   - Examples: GoDaddy, Namecheap, Google Domains, etc.

3. **Find Nameserver Settings**:
   - Look for "DNS Settings" or "Nameservers"
   - Replace current nameservers with Cloudflare nameservers

4. **Wait**: DNS propagation takes 24-48 hours (usually faster)

---

## Step 3: Configure DNS Records in Cloudflare

After nameservers are updated, go to **Cloudflare Dashboard → DNS → Records**

### Required DNS Records:

#### For Main Domain:
```
Type: A
Name: @ (or bennettconstructionandroofing.com)
Content: 76.76.21.21 (Vercel IP - check your Vercel dashboard for actual IP)
Proxy: ON (orange cloud) ✅
TTL: Auto
```

#### For WWW Subdomain:
```
Type: CNAME
Name: www
Content: cname.vercel-dns.com (or your Vercel CNAME)
Proxy: ON (orange cloud) ✅
TTL: Auto
```

#### For Wildcard Subdomains (for city/state subdomains):
```
Type: CNAME
Name: *
Content: cname.vercel-dns.com (or your Vercel CNAME)
Proxy: ON (orange cloud) ✅
TTL: Auto
```

**Important**: 
- Get actual Vercel IP/CNAME from your Vercel project settings → Domains
- Keep **Proxy ON** (orange cloud) for CDN benefits

---

## Step 4: Configure Cloudflare Settings

### SSL/TLS Settings:
1. Go to **SSL/TLS** → **Overview**
2. Set to **Full** or **Full (strict)** mode
3. This ensures encrypted connection between Cloudflare and Vercel

### Speed Settings:
1. Go to **Speed** → **Optimization**
2. Enable:
   - ✅ **Auto Minify**: HTML, CSS, JavaScript
   - ✅ **Brotli**: Compression
   - ✅ **HTTP/2**: Enabled by default
   - ✅ **HTTP/3 (QUIC)**: Enable if available

### Caching Settings:
1. Go to **Caching** → **Configuration**
2. Set **Caching Level**: Standard
3. Set **Browser Cache TTL**: Respect Existing Headers
4. **Purge Cache**: Use when you deploy updates

### Page Rules (Optional but Recommended):
Create rules in **Rules** → **Page Rules**:

**Rule 1: Cache Static Assets**
```
URL Pattern: *bennettconstructionandroofing.com/_next/static/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

**Rule 2: Cache Images**
```
URL Pattern: *bennettconstructionandroofing.com/images/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

**Rule 3: Don't Cache Admin**
```
URL Pattern: *bennettconstructionandroofing.com/admin/*
Settings:
- Cache Level: Bypass
```

---

## Step 5: Update Next.js Code (Optional but Recommended)

### Get Real IP Address (for logging/analytics):

Update `middleware.ts` to get real visitor IP:

```typescript
// In middleware.ts, add at the top:
export function getRealIP(request: NextRequest): string {
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  
  // Cloudflare provides real IP in cf-connecting-ip header
  return cfConnectingIP || xForwardedFor?.split(',')[0] || xRealIP || request.ip || 'unknown';
}
```

### Add Cloudflare Headers (for security):

Create `next.config.js` or update existing:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## Step 6: Configure Vercel for Cloudflare

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Verify Domain**: Make sure domain is verified
3. **No Changes Needed**: Vercel works automatically with Cloudflare

**Important**: Don't add Cloudflare IPs to Vercel. Cloudflare proxies traffic to Vercel automatically.

---

## Step 7: Test Cloudflare Integration

### Check if Cloudflare is Active:
1. Visit your site: https://bennettconstructionandroofing.com
2. Check response headers (use browser DevTools → Network tab)
3. Look for headers like:
   - `cf-ray`: Cloudflare request ID
   - `cf-cache-status`: Cache status
   - `server`: Should show `cloudflare`

### Test DNS:
```bash
# Check nameservers
nslookup -type=NS bennettconstructionandroofing.com

# Should show Cloudflare nameservers
```

### Test SSL:
- Visit: https://www.ssllabs.com/ssltest/
- Enter your domain
- Should show Cloudflare SSL certificate

---

## Step 8: Monitor & Optimize

### Cloudflare Analytics:
- **Dashboard**: View traffic, threats blocked, bandwidth saved
- **Analytics** → **Web Analytics**: Detailed visitor stats

### Cache Purge:
When you deploy updates:
1. Go to **Caching** → **Purge Cache**
2. Click **Purge Everything** (or specific URLs)
3. Or use API: `POST https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache`

### Rate Limiting (Free Plan):
- **Security** → **WAF** → **Rate Limiting Rules**
- Set rules to prevent abuse (e.g., max 100 requests/minute per IP)

---

## Troubleshooting

### Issue: Site shows "502 Bad Gateway"
**Solution**: 
- Check SSL/TLS mode is set to **Full** (not Flexible)
- Verify Vercel domain is correctly configured

### Issue: Subdomains not working
**Solution**:
- Add wildcard CNAME record: `*` → `cname.vercel-dns.com`
- Ensure Proxy is ON (orange cloud)

### Issue: Cache not clearing
**Solution**:
- Purge cache in Cloudflare dashboard
- Or add `Cache-Control: no-cache` headers in Next.js

### Issue: Too many requests still hitting Vercel
**Solution**:
- Increase cache TTL in Page Rules
- Enable more aggressive caching for static assets
- Check Cloudflare Analytics to see cache hit rate

---

## Cloudflare API (Optional - for Automation)

If you want to automate cache purges on deploy:

1. **Get API Token**: Cloudflare Dashboard → My Profile → API Tokens
2. **Create Token** with `Zone.Cache Purge` permission
3. **Add to Vercel Environment Variables**:
   - `CLOUDFLARE_API_TOKEN`: Your token
   - `CLOUDFLARE_ZONE_ID`: Your zone ID (found in domain overview)

Then add to `vercel.json` or create a deploy hook.

---

## Cost Savings

With Cloudflare:
- ✅ **Reduced Vercel Bandwidth**: Cloudflare caches static assets
- ✅ **Free SSL**: No need for paid SSL certificates
- ✅ **DDoS Protection**: Free protection included
- ✅ **Global CDN**: Faster for international visitors

---

## Next Steps

1. ✅ Complete DNS nameserver change
2. ✅ Configure DNS records in Cloudflare
3. ✅ Enable SSL/TLS Full mode
4. ✅ Set up Page Rules for caching
5. ✅ Monitor analytics for 1 week
6. ✅ Optimize cache settings based on traffic patterns

---

## Support Resources

- Cloudflare Docs: https://developers.cloudflare.com/
- Cloudflare Community: https://community.cloudflare.com/
- Vercel + Cloudflare: https://vercel.com/docs/integrations/cloudflare

---

**Note**: DNS propagation can take 24-48 hours. Be patient and monitor the Cloudflare dashboard for status updates.
