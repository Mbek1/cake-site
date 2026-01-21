# Quick Start: Deploy to Vercel

Vercel is the **easiest and fastest way** to deploy your cake ordering system. It's free for most projects and takes just 5 minutes.

## Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "GitHub" or "Email" (recommend GitHub for auto-deployment)
4. Follow the verification steps

## Step 2: Prepare Your Project

1. If not already done, initialize git:
```powershell
cd "C:\Users\kaibetsu\Documents\projects\cake site"
git init
git add .
git commit -m "Initial commit: Cake ordering system"
```

2. Push to GitHub:
   - Create repo on https://github.com (name: `cake-site`)
   - Follow GitHub's instructions to push your code

## Step 3: Deploy with Vercel

### Option A: GitHub Integration (Recommended)
1. Log in to https://vercel.com
2. Click "Add New Project"
3. Click "Import Git Repository"
4. Select your GitHub repo
5. Click "Import"
6. Leave settings as default (Vercel auto-detects Vite)
7. Click "Deploy"
8. Wait 1-2 minutes ✅ Done!

### Option B: Vercel CLI
```powershell
npm install -g vercel
cd "C:\Users\kaibetsu\Documents\projects\cake site"
vercel
```
Follow prompts and you're deployed!

## Step 4: Add Custom Subdomain

1. In Vercel Dashboard, go to your project
2. Settings → Domains
3. Click "Add Domain"
4. Enter: `orders.yourcakeshop.com`
5. Choose "Vercel Nameservers" option (easier)
6. Update your domain registrar's nameservers to Vercel's
7. Wait 24-48 hours for DNS to propagate

**Alternative (CNAME):**
- If you want to keep existing nameservers
- Vercel will give you a CNAME record to add to your DNS provider

## Step 5: Configure Environment Variables

1. Project Settings → Environment Variables
2. Click "Add New"
3. Add these variables:
   - `VITE_API_URL` = `https://your-backend-api.com` (if you have a backend)
   - `VITE_WORDPRESS_URL` = `https://yourcakeshop.com`

## Step 6: Verify Deployment

1. Visit: `https://your-project.vercel.app`
2. Should see your cake ordering app
3. Try adding a product in admin
4. Verify it shows in store

## Step 7: Embed in WordPress

In WordPress page, add:
```html
<iframe 
  src="https://orders.yourcakeshop.com" 
  width="100%" 
  height="900" 
  style="border:none;"
>
</iframe>
```

Or use shortcode:
```
[cake_ordering height="900"]
```

---

## Auto-Deploy on Every Push

Once connected to GitHub, **every git push automatically deploys**:

```powershell
# Make changes locally
git add .
git commit -m "Add new cake flavor"
git push

# Vercel automatically deploys within 1-2 minutes!
```

## Verify Your App

```powershell
# After deployment, verify the app works:
# 1. Go to your Vercel domain or custom subdomain
# 2. Test admin login (baker / password123)
# 3. Add a new product
# 4. Refresh main page - should see new product
# 5. Place a test order
```

---

## Cost

- **Free tier**: Perfect for this project
  - 1 project included
  - Unlimited deployments
  - Custom domains (with DNS update)
  - Auto-scaling

- **Pro tier**: Only if you get heavy traffic (starts at $20/month)

---

## Troubleshooting

**Build failed?**
```
Check Vercel logs: Project → Deployments → Click failed deploy → Logs
Common issues:
- Missing environment variables
- Old npm version
- Port already in use
```

**Domain not working?**
```
- Wait 24-48 hours for DNS to propagate
- Check domain registrar DNS settings
- Use nslookup: nslookup orders.yourcakeshop.com
```

**App works on vercel.app but not custom domain?**
```
- Verify HTTPS certificate installed
- Check CORS settings if calling external APIs
- Clear browser cache and try incognito
```

---

## Next Steps

1. ✅ Deploy to Vercel (5 minutes)
2. ✅ Add custom domain (5 minutes)
3. ✅ Embed in WordPress (2 minutes)
4. 📧 Set up email notifications (optional)
5. 📊 Monitor analytics in Vercel dashboard

**Total time: ~30 minutes from start to live!**

---

## Going Live Checklist

- [ ] Deployed to Vercel
- [ ] Custom subdomain configured
- [ ] App loads over HTTPS
- [ ] Admin login works
- [ ] Products sync correctly
- [ ] Orders can be placed
- [ ] Embedded in WordPress
- [ ] Mobile tested
- [ ] Admin guided tours added
- [ ] Analytics enabled

---

## Support

- Vercel Docs: https://vercel.com/docs
- Vue Vite Deployment: https://vitejs.dev/guide/static-deploy.html
- Issues: Check Vercel Dashboard → Deployments for logs
