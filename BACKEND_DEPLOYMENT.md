# Backend Deployment to Vercel Guide

## Overview

Deploy your Node.js Express backend to Vercel so your frontend can communicate with it for orders and emails.

---

## Step 1: Prepare Backend Files

Your backend already has:
- ✅ `backend/package.json` - Dependencies configured
- ✅ `backend/index.js` - Express server ready
- ✅ `backend/vercel.json` - Vercel config

---

## Step 2: Deploy Backend to Vercel

### Option A: Using Vercel CLI (Easiest)

```powershell
# Go to backend folder
cd backend

# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy
vercel --prod
```

Follow the prompts:
- Project name: `cake-ordering-backend` (or your choice)
- Framework: Node.js
- Root directory: ./

**Result:** Your backend gets a URL like `https://cake-ordering-backend.vercel.app`

### Option B: Deploy via GitHub (Recommended)

1. **Create separate GitHub repo for backend:**
   ```powershell
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

2. **Create repo on GitHub** named `cake-ordering-backend`

3. **Push to GitHub:**
   ```powershell
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cake-ordering-backend.git
   git push -u origin main
   ```

4. **In Vercel Dashboard:**
   - Click "Add New Project"
   - Select your `cake-ordering-backend` GitHub repo
   - Click "Import"
   - Leave settings default
   - Click "Deploy"

---

## Step 3: Configure Environment Variables

After deployment:

1. **Go to Vercel Dashboard**
2. **Select your backend project**
3. **Go to Settings → Environment Variables**
4. **Add these variables:**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
BAKER_EMAIL=baker@yourcakeshop.com
BAKER_PHONE=(555) 123-4567
BAKER_NAME=Baker at Pastry Paradise
FRONTEND_URL=https://orders.yourcakeshop.com
WORDPRESS_URL=https://yourcakeshop.com
NODE_ENV=production
```

### Email Setup (Gmail Example)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
   - Use this as `SMTP_PASS`

---

## Step 4: Connect Frontend to Backend

### Update your Vue app environment variables

1. **Update `.env.example`:**
```
VITE_API_URL=https://cake-ordering-backend.vercel.app
VITE_FRONTEND_URL=https://orders.yourcakeshop.com
VITE_WORDPRESS_URL=https://yourcakeshop.com
```

2. **In Vercel (Frontend) → Settings → Environment Variables:**
```
VITE_API_URL=https://cake-ordering-backend.vercel.app
```

### Update Vue app to use backend

**In `src/services/orderService.js`:**

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const submitOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};
```

---

## Step 5: Update Admin Dashboard

Update the AdminDashboard to fetch orders from backend instead of localStorage:

**In `src/pages/AdminDashboard.vue`, update the `loadOrders()` method:**

```javascript
async loadOrders() {
  try {
    // First try to load from backend
    const backendOrders = await this.getOrdersFromBackend();
    if (backendOrders.length > 0) {
      this.orders = backendOrders;
      return;
    }
  } catch (error) {
    console.log('Backend not available, using localStorage');
  }

  // Fallback to localStorage
  const stored = localStorage.getItem('bakery-orders');
  this.orders = stored ? JSON.parse(stored) : this.getSampleOrders();
},

async getOrdersFromBackend() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  try {
    const response = await fetch(`${apiUrl}/orders`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
```

---

## Step 6: Test the Integration

### Local Testing

```powershell
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev
```

Test in browser:
1. Go to `http://localhost:5173`
2. Place a test order
3. Check if email is received
4. Go to admin dashboard - order should appear

### Production Testing

1. Visit `https://orders.yourcakeshop.com`
2. Place test order
3. Check email
4. Check admin dashboard

---

## Backend API Endpoints

### GET `/` 
Health check - returns API status

### POST `/api/orders`
Submit a new order

**Request body:**
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567"
  },
  "items": [
    {
      "id": 1,
      "name": "Chocolate Cake",
      "price": 40,
      "quantity": 1,
      "customization": {
        "size": "10 inch",
        "flavor": "Chocolate",
        "color": "Red",
        "specialDetails": "Happy Birthday!"
      }
    }
  ],
  "total": 60,
  "deliveryDate": "2024-12-25",
  "notes": "Please deliver by 5pm"
}
```

**Response:**
```json
{
  "message": "Order submitted successfully",
  "orderId": "ORD-1234567890"
}
```

### GET `/api/orders`
Get all orders

### GET `/api/orders/:id`
Get specific order

### PATCH `/api/orders/:id`
Update order status

**Request body:**
```json
{
  "status": "in-progress"
}
```

---

## Troubleshooting

**Backend not responding?**
- Check Vercel Dashboard → Logs
- Verify environment variables set
- Check CORS origin is correct

**Email not sending?**
- Verify SMTP credentials correct
- Check Gmail app password (not regular password)
- Check email address format in `.env`

**Frontend can't reach backend?**
- Verify `VITE_API_URL` environment variable
- Check CORS origins in backend (line 8-13 in index.js)
- Test `https://your-backend-url.vercel.app` in browser

**Build failed?**
- Check backend/package.json has all dependencies
- Verify backend/index.js has no syntax errors
- Check Vercel logs for specific error

---

## Deployment Checklist

- [ ] Backend code pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Environment variables configured in Vercel
- [ ] Email credentials set up (Gmail app password)
- [ ] Frontend environment variable set (`VITE_API_URL`)
- [ ] Frontend redeployed with new env var
- [ ] Test order placed and email received
- [ ] Admin dashboard loads orders from backend
- [ ] CORS working (no errors in browser console)
- [ ] Both frontend and backend using HTTPS

---

## Next: WordPress Integration

Once backend is deployed and working:
1. Embed frontend iframe in WordPress
2. Backend handles all order processing
3. Admin dashboard accessible via `/admin/login`
4. Emails automatically sent to baker

---

## Production Best Practices

1. **Database**: Currently uses in-memory storage. For production, add MongoDB or PostgreSQL
2. **Authentication**: Add JWT tokens for admin API routes
3. **Rate Limiting**: Protect against spam orders
4. **Logging**: Use service like Sentry for error tracking
5. **Backups**: Set up order database backups

---

## Support

- Vercel Docs: https://vercel.com/docs
- Express Docs: https://expressjs.com
- Nodemailer: https://nodemailer.com
