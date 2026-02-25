# Cloudflare Quick Start Checklist ✅

## Immediate Steps (Do These First)

### 1. Add Domain to Cloudflare
- [ ] Go to https://dash.cloudflare.com
- [ ] Click "Add a Site"
- [ ] Enter: `bennettconstructionandroofing.com`
- [ ] Select **Free** plan

### 2. Update Nameservers
- [ ] Copy Cloudflare nameservers (shown in dashboard)
- [ ] Go to your domain registrar (GoDaddy/Namecheap/etc.)
- [ ] Replace nameservers with Cloudflare ones
- [ ] Wait 24-48 hours for DNS propagation

### 3. Configure DNS Records
After nameservers update, in Cloudflare Dashboard → DNS:

- [ ] **A Record**:
  ```
  Type: A
  Name: @
  Content: [Vercel IP - get from Vercel dashboard]
  Proxy: ON (orange cloud) ✅
  ```

- [ ] **CNAME Record**:
  ```
  Type: CNAME
  Name: www
  Content: cname.vercel-dns.com
  Proxy: ON (orange cloud) ✅
  ```

- [ ] **Wildcard CNAME** (for subdomains):
  ```
  Type: CNAME
  Name: *
  Content: cname.vercel-dns.com
  Proxy: ON (orange cloud) ✅
  ```

### 4. SSL/TLS Settings
- [ ] Go to **SSL/TLS** → **Overview**
- [ ] Set to **Full** (not Flexible)
- [ ] This ensures encrypted connection to Vercel

### 5. Enable Speed Optimizations
- [ ] Go to **Speed** → **Optimization**
- [ ] Enable: Auto Minify (HTML, CSS, JS)
- [ ] Enable: Brotli compression
- [ ] Enable: HTTP/3 (QUIC) if available

### 6. Set Up Page Rules (Optional but Recommended)
Go to **Rules** → **Page Rules**:

**Rule 1: Cache Static Assets**
```
URL: *bennettconstructionandroofing.com/_next/static/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
```

**Rule 2: Cache Images**
```
URL: *bennettconstructionandroofing.com/images/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
```

**Rule 3: Bypass Admin**
```
URL: *bennettconstructionandroofing.com/admin/*
Cache Level: Bypass
```

---

## Verify It's Working

### Check Cloudflare is Active:
1. Visit your site
2. Open Browser DevTools → Network tab
3. Look for headers:
   - `cf-ray`: Cloudflare request ID ✅
   - `cf-cache-status`: Cache status ✅
   - `server`: Should show `cloudflare` ✅

### Test DNS:
```bash
nslookup bennettconstructionandroofing.com
# Should show Cloudflare nameservers
```

---

## Important Notes

⚠️ **DNS Propagation**: Takes 24-48 hours. Be patient!

⚠️ **SSL Mode**: Must be **Full** (not Flexible) to work with Vercel

⚠️ **Vercel IP**: Get actual IP from Vercel Dashboard → Project → Settings → Domains

⚠️ **Cache Purge**: When you deploy, purge Cloudflare cache:
   - Dashboard → Caching → Purge Cache → Purge Everything

---

## Expected Results

✅ **Faster Loading**: Pages load faster worldwide  
✅ **Less Vercel Bandwidth**: Cloudflare caches static files  
✅ **Free SSL**: Automatic HTTPS  
✅ **DDoS Protection**: Automatic protection enabled  
✅ **Reduced Logs**: Fewer requests hit Vercel directly  

---

## Need Help?

- Full Guide: See `CLOUDFLARE_SETUP.md`
- Cloudflare Docs: https://developers.cloudflare.com/
- Vercel + Cloudflare: https://vercel.com/docs/integrations/cloudflare

---

**Time Required**: ~30 minutes setup + 24-48h DNS wait
