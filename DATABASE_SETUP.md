# Database Setup Guide for Mums Cakes

## Overview
Your backend now supports **MongoDB** for persistent data storage. Orders are automatically saved to the database instead of being lost when the server restarts.

## Quick Answer
**Yes, you need a database for production.**
- ✅ Orders are now saved to MongoDB
- ✅ Data persists across server restarts
- ✅ Free tier available
- ✅ Easy to scale later

---

## Setup Steps

### Step 1: Create MongoDB Account (Free)

1. Go to **https://cloud.mongodb.com**
2. Click **"Try Free"**
3. Create an account with your email
4. Choose your organization name
5. Select **FREE** plan

### Step 2: Create Your First Cluster

1. After signup, click **"Create Cluster"**
2. Select **M0 (Free)** tier
3. Choose your nearest region
4. Click **"Create Cluster"** (wait 2-3 minutes)

### Step 3: Get Your Connection String

1. Click **"Connect"** button
2. Choose **"Drivers"** connection method
3. Select **Node.js** driver
4. Copy the connection string that looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

### Step 4: Create Database User

1. Go to **"Database Access"** section
2. Click **"Add New Database User"**
3. Set username and password
4. Choose password authentication
5. Click **"Add User"**

### Step 5: Whitelist Your IP

1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Choose **"Allow access from anywhere"** (for development)
4. Click **"Confirm"**

### Step 6: Update Your .env File

1. Open or create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/cake-site

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

BAKER_NAME=Mums Cakes
BAKER_EMAIL=baker@mumscakes.com
BAKER_PHONE=(555) 123-4567
```

### Step 7: Test Connection

1. Start your backend:
```bash
cd backend
npm install
npm start
```

2. You should see:
```
✅ Connected to MongoDB
🍰 Cake Ordering Backend running on port 3000
```

---

## What Changed in Backend

### Before (In-Memory)
```javascript
let orders = [];  // Lost on server restart!
```

### After (MongoDB)
```javascript
const Order = mongoose.model('Order', orderSchema);
// Data persists in cloud database
```

### Automatic Features
- ✅ Orders automatically saved to MongoDB
- ✅ Fallback to in-memory if MongoDB unavailable
- ✅ All existing functionality works
- ✅ No changes needed in frontend

---

## Data Stored in MongoDB

```javascript
{
  id: "ORD-1234567890",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567"
  },
  items: [
    {
      name: "Chocolate Cake",
      size: "8 inch",
      flavor: "Chocolate",
      color: "Brown",
      quantity: 1,
      price: 35
    }
  ],
  total: 35,
  deliveryDate: "2026-01-25",
  notes: "Extra sprinkles please",
  status: "pending",
  createdAt: "2026-01-21T10:30:00Z",
  updatedAt: "2026-01-21T10:30:00Z"
}
```

---

## Database Access

### View Your Data in MongoDB

1. Go to **mongodb.com/cloud/atlas**
2. Login to your account
3. Click **"Browse Collections"**
4. Navigate to your database
5. View orders in real-time!

### MongoDB Compass (Optional)

1. Download **MongoDB Compass** (free GUI tool)
2. Connect using your connection string
3. Browse data visually

---

## API Endpoints (Now with Database)

All existing endpoints now use MongoDB:

### Get All Orders
```bash
GET /api/orders
```

### Get Single Order
```bash
GET /api/orders/ORD-1234567890
```

### Create Order
```bash
POST /api/orders
Content-Type: application/json

{
  "customer": {
    "name": "John",
    "email": "john@example.com",
    "phone": "(555) 123-4567"
  },
  "items": [...],
  "total": 35,
  "deliveryDate": "2026-01-25"
}
```

### Update Order Status
```bash
PATCH /api/orders/ORD-1234567890
Content-Type: application/json

{
  "status": "completed"
}
```

---

## Fallback Mode

If MongoDB is not available, the system falls back to in-memory storage:
- ✅ Development works without database
- ✅ Useful for testing
- ✅ Data lost on server restart
- ⚠️ Not suitable for production

---

## Deployment

### For Vercel Backend

1. Add environment variable to Vercel:
   - Go to your project settings
   - Add `MONGODB_URI` with your connection string

2. Make sure MongoDB allows Vercel IPs:
   - Go to "Network Access" in MongoDB Atlas
   - Add Vercel IP: `0.0.0.0/0` (allows anywhere)

### For Other Hosting

1. Set `MONGODB_URI` environment variable
2. Make sure your MongoDB allows that IP
3. Deploy as usual

---

## Troubleshooting

### Connection Error
```
❌ MongoDB connection error: Authentication failed
```
**Solution:** Check username/password in connection string

### Database Not Showing Orders
```
⚠️ Running in in-memory mode
```
**Solution:** Check MONGODB_URI in .env file

### IP Address Blocked
```
Error: MongoServerSelectionError
```
**Solution:** Add your IP in MongoDB Network Access

---

## Free MongoDB Limits

- **Storage:** 512 MB free tier
- **Connections:** Enough for small-medium projects
- **Backup:** Automatic backups
- **Scalability:** Easy upgrade when needed

For your Mums Cakes shop, free tier is plenty!

---

## What Gets Stored

✅ Customer orders
✅ Order items and customizations
✅ Customer information
✅ Order status history
✅ Delivery dates
✅ Special notes

---

## Next Steps

1. ✅ Install mongoose (already done)
2. ✅ Update backend (already done)
3. 📋 Create MongoDB account
4. 📋 Get connection string
5. 📋 Update .env file
6. 📋 Test the connection
7. 🚀 Deploy!

---

## Support

If you need help:
1. Check MongoDB documentation: https://docs.mongodb.com
2. Check Mongoose docs: https://mongoosejs.com
3. Verify your connection string format
4. Check backend console for errors

---

**Status:** Backend ready for MongoDB! 🎉
Now just set up your free MongoDB account and you're good to go!
