# Subdomain Deployment Guide

## Overview
This guide covers deploying your Vue 3 Cake Ordering System on a separate subdomain (e.g., `orders.yourcakeshop.com`) that can be embedded in your WordPress site via iframe.

## Prerequisites
- A web hosting account that supports Node.js or static file hosting
- Domain with subdomain capability
- SSH/terminal access to your server

## Option A: Static Hosting (Vercel, Netlify, GitHub Pages) - EASIEST

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy your project:**
```bash
cd "C:\Users\kaibetsu\Documents\projects\cake site"
vercel --prod
```

4. **Configure Custom Domain:**
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Domains
   - Add your subdomain (e.g., `orders.yourcakeshop.com`)
   - Update DNS records as instructed

5. **Environment Variables:**
   - Settings → Environment Variables
   - Add `VITE_API_URL=https://your-backend-url.com`

### Deploy to Netlify

1. **Build your app:**
```bash
npm run build
```

2. **Connect to Netlify:**
   - Go to netlify.com
   - Create account and connect GitHub (or drag-and-drop dist folder)
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Add custom domain:**
   - Domain settings → Custom domain
   - Point your subdomain via DNS

---

## Option B: Traditional VPS/Shared Hosting

### Using Node.js + PM2

1. **SSH into your server:**
```bash
ssh user@your-server.com
```

2. **Clone your repository:**
```bash
cd /var/www
git clone your-repo-url cake-ordering
cd cake-ordering
npm install
npm run build
```

3. **Install PM2:**
```bash
npm install -g pm2
```

4. **Create ecosystem file (`ecosystem.config.js`):**
```javascript
module.exports = {
  apps: [{
    name: 'cake-ordering',
    script: './node_modules/vite/bin/vite.js',
    args: 'preview --host 0.0.0.0 --port 5173',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

5. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

6. **Configure Nginx reverse proxy:**
```nginx
server {
    server_name orders.yourcakeshop.com;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

7. **Enable HTTPS with Let's Encrypt:**
```bash
certbot certonly --nginx -d orders.yourcakeshop.com
```

---

## Option C: Static Files Only (HTML/JS/CSS)

If you only need static hosting (no backend):

1. **Build the app:**
```bash
npm run build
```

2. **Upload `dist/` folder to your web server:**
   - Via FTP/SFTP to `/public_html/orders/`
   - Or use hosting provider's dashboard

3. **Configure `.htaccess` for Vue Router (Apache):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

4. **Or configure for Nginx:**
```nginx
try_files $uri $uri/ /index.html;
```

---

## Embedding in WordPress

### Add to WordPress page/post:

```html
<iframe 
  src="https://orders.yourcakeshop.com" 
  width="100%" 
  height="900" 
  style="border:none; margin: 20px 0;">
</iframe>
```

### Or create a WordPress shortcode:

Add to theme's `functions.php`:
```php
function embed_cake_ordering() {
    return '<iframe src="https://orders.yourcakeshop.com" width="100%" height="900" style="border:none;"></iframe>';
}
add_shortcode('cake_store', 'embed_cake_ordering');
```

Then use in WordPress: `[cake_store]`

---

## CORS Configuration

If your Vue app needs to call WordPress API or backend:

1. **Install CORS package:**
```bash
npm install cors
```

2. **Update backend if using Node.js:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://yourcakeshop.com', 'https://orders.yourcakeshop.com'],
  credentials: true
}));
```

3. **For WordPress REST API**, add to `wp-config.php`:
```php
define('REST_API_ENABLED', true);
```

---

## Environment Variables

Create `.env` file in project root:
```
VITE_API_URL=https://your-backend-api.com
VITE_WORDPRESS_URL=https://yourcakeshop.com
VITE_APP_DOMAIN=orders.yourcakeshop.com
```

Usage in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## SSL Certificate

**Critical**: Always use HTTPS for your subdomain:

- **Let's Encrypt** (free): certbot
- **Cloudflare** (free): Use Cloudflare DNS
- **Paid**: SSL.com, DigiCert, etc.

---

## Deployment Checklist

- [ ] Built app with `npm run build`
- [ ] Environment variables configured
- [ ] Custom subdomain pointing to hosting
- [ ] HTTPS/SSL certificate installed
- [ ] CORS configured if needed
- [ ] Admin routes protected
- [ ] localStorage working correctly
- [ ] Images loading properly
- [ ] Email service configured (if needed)
- [ ] Tested iframe embedding in WordPress

---

## Recommended Setup for You

**Simplest Option:** **Vercel** (Free tier available)
- No server management
- Automatic deployments
- Built-in SSL
- Easy custom domain

**Next Best:** **Netlify** (Free tier available)
- Similar benefits to Vercel
- Great free tier

**Production:** **VPS + PM2 + Nginx**
- Full control
- Scalable
- Better for heavy traffic

---

## Troubleshooting

**Iframe not loading?**
- Check HTTPS certificate
- Verify subdomain DNS resolution
- Check CORS headers

**Storage not persisting?**
- localStorage works in iframes by default
- If issues, use sessionStorage or backend database

**Admin panel not accessible?**
- Verify login route works
- Check authentication localStorage
- Clear browser cache

**Images not loading?**
- Verify image URLs are absolute (full domain)
- Check CORS for image hosting
- Test with Unsplash URLs first

---

## Next Steps

1. Choose deployment platform (Vercel recommended for ease)
2. Follow the appropriate guide above
3. Test iframe embedding in WordPress
4. Configure email notifications (optional backend)
5. Monitor performance and logs
