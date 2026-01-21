# Complete Deployment Checklist

Use this to track your full stack deployment from local to production.

---

## Phase 1: Local Testing (Optional but Recommended)

- [ ] Backend starts without errors: `cd backend && node index.js`
- [ ] Frontend starts without errors: `npm run dev`
- [ ] Place test order on `http://localhost:5173`
- [ ] Check order appears in admin dashboard
- [ ] Verify backend responds to API calls

---

## Phase 2: Deploy Backend

- [ ] Read `BACKEND_DEPLOYMENT.md`
- [ ] Push backend code to GitHub (or ready for Vercel CLI)
- [ ] Create Vercel account if needed
- [ ] Deploy backend:
  ```powershell
  cd backend
  vercel --prod
  ```
- [ ] Get backend URL (e.g., `https://cake-backend.vercel.app`)
- [ ] Add environment variables in Vercel:
  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_USER`
  - [ ] `SMTP_PASS` (Gmail app password)
  - [ ] `BAKER_EMAIL`
  - [ ] `BAKER_PHONE`
  - [ ] `BAKER_NAME`
  - [ ] `FRONTEND_URL`
  - [ ] `WORDPRESS_URL`
  - [ ] `NODE_ENV=production`

- [ ] Test backend health check:
  ```
  Visit: https://your-backend-url.vercel.app/
  Should see: {"message":"Cake Ordering API is running"}
  ```

---

## Phase 3: Deploy Frontend with Backend URL

- [ ] Read `VERCEL_QUICK_START.md`
- [ ] Update frontend `.env` or set in Vercel:
  - [ ] `VITE_API_URL=https://your-backend-url.vercel.app`
- [ ] Deploy frontend:
  ```powershell
  vercel --prod
  ```
- [ ] Get frontend URL (e.g., `https://cake-store.vercel.app`)

---

## Phase 4: Connect Backend to Frontend

- [ ] Update `src/services/orderService.js` to use backend endpoints
- [ ] Test order submission:
  - [ ] Place test order
  - [ ] Check browser console - no CORS errors
  - [ ] Check if order appears in admin dashboard
  - [ ] Check if email received (if configured)

---

## Phase 5: Configure Custom Domains

### Frontend Domain
- [ ] In Vercel Dashboard → Frontend Project → Settings → Domains
- [ ] Add custom domain: `orders.yourcakeshop.com`
- [ ] Update DNS records (follow Vercel instructions)
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Verify works: https://orders.yourcakeshop.com

### Backend Domain (Optional)
- [ ] In Vercel Dashboard → Backend Project → Settings → Domains
- [ ] Add custom domain: `api.yourcakeshop.com`
- [ ] Update `VITE_API_URL` if using custom domain
- [ ] Redeploy frontend with new backend URL

---

## Phase 6: WordPress Integration

- [ ] Read `WORDPRESS_INTEGRATION.md`
- [ ] Choose embedding method (iframe or shortcode)
- [ ] Add shortcode to WordPress:
  ```php
  // In theme's functions.php
  function embed_cake_ordering() {
      return '<iframe src="https://orders.yourcakeshop.com" width="100%" height="900" style="border:none;"></iframe>';
  }
  add_shortcode('cake_ordering', 'embed_cake_ordering');
  ```
- [ ] Create WordPress page/post
- [ ] Add shortcode: `[cake_ordering]`
- [ ] Test embedding works
- [ ] Verify responsive on mobile

---

## Phase 7: Testing & Verification

- [ ] Visit WordPress site
- [ ] Click on cake ordering section
- [ ] Verify iframe loads (no blank space or errors)
- [ ] Browse cakes (should sync with admin)
- [ ] Add cake to cart
- [ ] Customize cake (size, flavor, color, details)
- [ ] Proceed to order form
- [ ] Enter test customer info
- [ ] Submit order
- [ ] Check email received (baker + customer)
- [ ] Go to admin: https://orders.yourcakeshop.com/admin/login
  - [ ] Username: `baker`
  - [ ] Password: `password123`
- [ ] Verify new order appears in dashboard
- [ ] Test product management:
  - [ ] Add new cake product
  - [ ] Go back to store - should appear
  - [ ] Edit product details
  - [ ] Upload image
  - [ ] Delete product (with confirmation)
- [ ] Test order status updates
- [ ] Test search/filter orders

---

## Phase 8: Security & Configuration

- [ ] Change admin password from default
- [ ] Verify HTTPS on all domains
- [ ] Check CORS is properly configured
- [ ] Ensure email credentials not in code (use env vars)
- [ ] Set up error logging (optional)
- [ ] Configure analytics (optional)

---

## Phase 9: Performance Check

- [ ] Test frontend load time: Should be under 3 seconds
- [ ] Test on 3G mobile network (DevTools)
- [ ] Check Lighthouse score (target: >85)
- [ ] Verify images optimize and lazy-load
- [ ] Test admin dashboard doesn't slow down

---

## Phase 10: Go Live

- [ ] All security checks passed
- [ ] All tests passing
- [ ] Team trained on admin dashboard
- [ ] Backup procedures in place
- [ ] Support contacts established
- [ ] Update WordPress site with ordering info
- [ ] Launch!

---

## Post-Launch Monitoring

- [ ] Monitor email delivery (Gmail settings)
- [ ] Check Vercel analytics/logs weekly
- [ ] Gather customer feedback
- [ ] Track order volume
- [ ] Plan for database if orders grow large
- [ ] Add payment processing (future feature)

---

## Rollback Plan

If issues occur:
1. **Frontend issue?** Rollback to previous deployment in Vercel
2. **Backend issue?** Revert environment variables or redeploy
3. **Email issue?** Check SMTP credentials, fallback to manual follow-up
4. **Embedded issue?** Test app directly at app URL before blaming iframe

---

## Documentation

Save these files in your project:
- `VERCEL_QUICK_START.md` - How to deploy frontend
- `BACKEND_DEPLOYMENT.md` - How to deploy backend
- `WORDPRESS_INTEGRATION.md` - How to embed in WordPress
- `ADMIN_GUIDE.md` - Admin features guide
- `.env.example` - Environment template

---

## Success Criteria

✅ **Deployment is successful when:**
1. Frontend loads over HTTPS
2. Backend API responds to requests
3. Customers can place orders
4. Baker receives email notifications
5. Admin dashboard displays all orders
6. Products sync between frontend and admin
7. Embedded in WordPress seamlessly
8. Mobile responsive
9. No console errors

---

## Timeline Estimate

- Setup & Config: 30 minutes
- Backend Deploy: 10 minutes
- Frontend Deploy: 10 minutes
- Testing: 30 minutes
- WordPress Integration: 15 minutes
- Security Check: 15 minutes

**Total: ~2 hours** for complete deployment

---

## Questions/Issues?

Check these resources:
1. `BACKEND_DEPLOYMENT.md` - Backend issues
2. `VERCEL_QUICK_START.md` - Frontend issues
3. `WORDPRESS_INTEGRATION.md` - WordPress issues
4. Vercel Logs - Deployment errors
5. Browser Console - Frontend errors
6. Backend logs - API errors

---

**You're ready to go live! Good luck! 🚀**
