# 🗄️ Database Setup Guide - MongoDB on Vercel

## Overview

Your backend was using **in-memory storage** which meant:
- ❌ All orders lost on server restart
- ❌ No persistent data
- ❌ Multiple servers can't share data

Now it's been **updated to use MongoDB** with fallback to in-memory if database is unavailable.

---

## Step 1: Create MongoDB Atlas Account (FREE)

### 1.1 Sign Up
- Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
- Click "Try Free"
- Sign up with email

### 1.2 Create a Project
- Name it: "Cake Site"
- Click "Create"

### 1.3 Create a Free Cluster
- Select **M0 Sandbox** (FREE tier)
- Choose region closest to you (e.g., US East)
- Click "Create Cluster"
- Wait 2-3 minutes for cluster creation

### 1.4 Database Access
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password:
   - Username: `cakeadmin`
   - Password: Generate a strong one (copy it!)
4. Click "Add User"

### 1.5 Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for testing
4. Click "Confirm"

### 1.6 Get Connection String
1. Go to "Clusters"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. It looks like:
   ```
   mongodb+srv://cakeadmin:PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2: Update Your .env File

In your `backend/.env`, add:

```env
MONGODB_URI=mongodb+srv://cakeadmin:YOUR_PASSWORD_HERE@cluster0.mongodb.net/cake-site?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD_HERE` with the password you created
- Keep the `?retryWrites=true&w=majority` at the end

---

## Step 3: Verify Backend Updated

I've updated `backend/index.js` to:
✅ Import mongoose  
✅ Create Order schema  
✅ Connect to MongoDB on startup  
✅ Save orders to database  
✅ Fallback to in-memory if DB unavailable  

The backend now uses:
- `getOrders()` - Fetch all orders from DB
- `saveOrder()` - Save new order to DB
- `updateOrderStatus()` - Update order status in DB
- `findOrder()` - Find single order in DB

---

## Step 4: Deploy to Vercel

### 4.1 Update Environment Variables on Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Go to your project settings
3. Click "Environment Variables"
4. Add new variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string from Step 1.6
   - Select "Production"
   - Click "Add"

### 4.2 Deploy

```bash
git add -A
git commit -m "feat: add MongoDB database support"
git push origin main
```

Vercel will automatically redeploy with MongoDB support!

---

## Step 5: Test Connection

After deployment, check Vercel logs:
1. Go to your Vercel project
2. Click "Deployments"
3. Click your latest deployment
4. Go to "Function Logs"
5. You should see: `Connected to MongoDB`

---

## Data That Gets Stored

### Orders Collection
Each order contains:
```javascript
{
  id: "ORD-1705839600000",
  customer: {
    name: "John Doe",
    email: "john@email.com",
    phone: "555-1234",
    address: "123 Main St"
  },
  items: [
    {
      name: "Chocolate Cake",
      quantity: 2,
      price: 45.00,
      customization: {
        size: "Large",
        flavor: "Chocolate",
        color: "Brown",
        specialDetails: "Extra frosting"
      }
    }
  ],
  total: 90.00,
  deliveryDate: "2026-01-28",
  notes: "Please deliver in the morning",
  status: "pending",
  createdAt: "2026-01-21T10:00:00Z",
  updatedAt: "2026-01-21T10:00:00Z"
}
```

### Persistence
- ✅ Orders saved across server restarts
- ✅ Admin can see all historical orders
- ✅ Multiple server instances share data
- ✅ Automatic backups with MongoDB

---

## Troubleshooting

### Connection String Issues
**Error:** `MongooseError: Cannot connect to MongoDB`

**Solution:** 
- Verify connection string has no typos
- Check IP whitelist includes 0.0.0.0/0
- Verify username/password are correct

### Database Not Found
**Error:** `Error: database not found`

**Solution:**
- MongoDB creates database automatically on first write
- Just submit an order and it will create it

### Can't Access Atlas
**Error:** `Login failed for user`

**Solution:**
- Verify database user exists (Database Access tab)
- Reset password if needed
- Ensure IP is whitelisted

### Local Testing Issues

To test locally with MongoDB:

```bash
# Set environment variable in terminal
export MONGODB_URI="your-connection-string"

# Or in .env:
MONGODB_URI=mongodb+srv://cakeadmin:password@cluster0.mongodb.net/cake-site?retryWrites=true&w=majority

# Then start backend
node backend/index.js
```

---

## MongoDB Atlas Limits (Free Tier)

| Feature | Limit |
|---------|-------|
| Storage | 512 MB |
| Connections | 100 |
| Data Transfer | 1 GB/month |
| Backups | Snapshots only |
| Availability | 99.5% SLA |

**Note:** Free tier is perfect for small bakery business. Upgrade to paid when you need more.

---

## Alternative Databases

If you want to use something else:

### PostgreSQL (via Vercel Postgres)
```bash
npm install @vercel/postgres
```
More SQL, better for complex queries

### Supabase (Free PostgreSQL)
- Go to supabase.com
- Create account
- Connect with connection string

### Firebase (Google)
- Real-time database
- Good for smaller apps
- More expensive at scale

**Recommendation:** MongoDB Atlas is easiest for this project ✅

---

## Verify It Works

### Test 1: Submit an Order
1. Go to your site
2. Fill out order form
3. Submit order
4. You should receive confirmation email

### Test 2: Check Admin Dashboard
1. Login to admin
2. Go to Orders tab
3. You should see the order you just submitted
4. Order data is now in MongoDB!

### Test 3: Check MongoDB Atlas
1. Go to MongoDB Atlas
2. Click "Collections"
3. Go to "cake-site" database
4. Click "orders" collection
5. You should see your orders in the database!

### Test 4: Restart Server
On Vercel (server restart):
1. Make a deployment
2. Orders from before restart still there ✅
(Would have been lost before!)

---

## Next Steps

1. ✅ Create MongoDB Atlas account
2. ✅ Get connection string
3. ✅ Update backend/.env
4. ✅ Push code to GitHub
5. ✅ Add MONGODB_URI to Vercel environment
6. ✅ Deploy
7. ✅ Test by submitting orders

---

## Support

**Questions?**
- MongoDB docs: docs.mongodb.com
- Vercel docs: vercel.com/docs
- Check browser console for errors
- Check Vercel function logs for server errors

**Still using in-memory?**
- Backend still works without MongoDB
- Just won't persist data across restarts
- Good for local testing without setup

---

**Status:** MongoDB integration complete! 🎉
Backend is now production-ready with persistent database.
