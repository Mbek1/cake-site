# 🍰 Pastry Paradise - Complete Setup Guide

## Project Overview

This is a full-stack bakery ordering website built with Vue 3 and Vite. The frontend displays products, manages shopping carts, and collects orders. The backend processes orders and sends emails to the baker and customer confirmation emails.

## ✅ What's Included

### Frontend (Vue 3 + Vite)
- ✓ Beautiful product catalogue with emoji indicators
- ✓ Shopping cart with add/remove functionality
- ✓ Order form with customer details collection
- ✓ Cart modal for quick viewing
- ✓ Responsive mobile-friendly design
- ✓ Smooth animations and transitions
- ✓ Mock product data included

### Backend (Node.js + Express)
- Template provided: `backend-server-example.js`
- Email integration with Nodemailer
- CORS enabled for frontend communication
- Order validation
- Email templates for baker and customer

## 🚀 Getting Started

### Step 1: Start the Frontend

```bash
cd "C:\Users\kaibetsu\Documents\projects\cake site"
npm run dev
```

Visit: http://localhost:5173

### Step 2: Setup Backend (Optional but Recommended)

For email notifications to work, set up the backend:

```bash
# Create backend directory
mkdir C:\bakery-backend
cd C:\bakery-backend

# Initialize and install dependencies
npm init -y
npm install express cors nodemailer dotenv

# Copy example server
copy "[frontend-path]\backend-server-example.js" server.js
copy "[frontend-path]\.env.example" .env
```

### Step 3: Configure Environment

Edit `.env` in your backend folder:

```env
# Gmail Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Baker Info
BAKER_EMAIL=baker@example.com
BAKER_PHONE=+1-234-567-8900

# Server
PORT=3000
NODE_ENV=development
```

**To get Gmail App Password:**
1. Go to https://myaccount.google.com
2. Enable 2-Step Verification if not enabled
3. Go to "App passwords"
4. Select Mail and Windows Computer
5. Copy the 16-character password

### Step 4: Run Backend

```bash
cd C:\bakery-backend
node server.js
```

You should see:
```
🍰 Pastry Paradise Backend Server running on http://localhost:3000
```

### Step 5: Enable Backend in Frontend

Edit `src/services/orderService.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // Change from comment
```

## 📦 Project Contents

```
cake site/
├── src/
│   ├── components/
│   │   ├── Header.vue              - Top navigation
│   │   ├── ProductCatalogue.vue    - Product grid
│   │   ├── OrderForm.vue           - Order form
│   │   └── CartModal.vue           - Shopping cart
│   ├── services/
│   │   └── orderService.js         - API calls
│   ├── App.vue                     - Main app
│   ├── main.js                     - Entry point
│   └── style.css                   - Global styles
├── index.html
├── package.json
├── vite.config.js
├── README.md                       - Project overview
├── SETUP_GUIDE.md                  - This file
├── backend-server-example.js       - Backend template
└── .env.example                    - Environment template
```

## 🎨 Customization Guide

### Add Your Own Products

Edit `src/services/orderService.js`:

```javascript
export const getMockProducts = () => {
  return [
    {
      id: 1,
      name: 'Your Pastry Name',
      price: 5.99,
      image: '🥐', // Use any emoji
      description: 'Detailed description'
    },
    // Add more products...
  ];
};
```

### Change Colors

The theme uses pink/red gradient. To change:

1. **Header** - `Header.vue` line 40:
   ```css
   background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
   ```

2. **Buttons** - Search for `#f093fb` and `#f5576c` throughout component files

3. **Accents** - Change `#f5576c` (red) for secondary elements

### Update Baker Information

Create `src/components/Footer.vue`:

```vue
<template>
  <footer class="footer">
    <div class="container">
      <h3>Pastry Paradise Bakery</h3>
      <p>📞 Call: (555) 123-4567</p>
      <p>📍 123 Baker Street, Your City</p>
      <p>⏰ Open: 6am - 9pm Daily</p>
    </div>
  </footer>
</template>
```

Then add to `App.vue`:
```vue
import Footer from './components/Footer.vue'
// In components: { Footer }
// In template: <Footer />
```

## 🔄 How Orders Work

### Customer Journey

1. Customer browses products in catalogue
2. Selects quantity and adds to cart
3. Views cart with total
4. Fills in order form:
   - Name, Email, Phone
   - Delivery date
   - Special requests
5. Clicks "Place Order"

### Order Processing

1. Frontend validates form
2. Order data sent to backend
3. Backend sends email to baker with:
   - Order ID
   - Customer contact info
   - Items and total
   - Requested delivery date
4. Backend sends confirmation to customer
5. Frontend shows success message
6. Cart is cleared

## 📧 Email Templates

### Baker Receives

```
📦 New Order Received

Customer: John Doe
Email: john@example.com
Phone: (555) 123-4567

Items:
- Chocolate Croissant × 2 = $11.98
- Strawberry Tart × 1 = $7.99

Total: $19.97
Requested Date: Dec 15, 2025

Special Requests: No nuts, please!
```

### Customer Receives

```
🎉 Order Confirmation

Thank you for your order!
Order ID: ORD-1733537400000

Items:
- Chocolate Croissant × 2 = $11.98
- Strawberry Tart × 1 = $7.99

Total: $19.97

The baker will contact you at (555) 123-4567
to confirm delivery details.
```

## 🚢 Deployment

### Frontend to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repo
4. Click Deploy
5. Add environment variable:
   - `VITE_API_URL=https://your-backend.herokuapp.com/api`

### Backend to Heroku

1. Create Heroku account
2. Install Heroku CLI
3. In backend folder:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set EMAIL_USER=your@email.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set BAKER_EMAIL=baker@example.com
   git push heroku main
   ```

4. Get your URL and update frontend .env

## 🧪 Testing

### Test Frontend
1. Add items to cart
2. Fill order form
3. Submit - check browser console
4. Verify form resets

### Test Backend
```bash
# Check server is running
curl http://localhost:3000/api/health

# Test order submission
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d @test-order.json
```

Create `test-order.json`:
```json
{
  "customer": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-1234"
  },
  "items": [
    {
      "id": 1,
      "name": "Croissant",
      "price": 5.99,
      "quantity": 2
    }
  ],
  "total": 11.98,
  "deliveryDate": "2025-12-20",
  "notes": "Fresh please!"
}
```

## 🐛 Troubleshooting

### Frontend won't load

```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Errors in console

Press `F12` in browser and check:
- Network tab for API failures
- Console tab for JavaScript errors
- Application tab for cache issues

### Backend not receiving orders

1. Check backend is running: `http://localhost:3000/api/health`
2. Verify CORS is enabled (should show in backend output)
3. Check `.env` file has correct values
4. Look at backend terminal for error messages

### Emails not sending

1. Verify `EMAIL_USER` and `EMAIL_PASS` are correct
2. Check Gmail 2FA is enabled
3. Verify app password is 16 characters
4. Check `BAKER_EMAIL` is valid
5. Look at backend console for error details

### Cart not persisting

- Add `localStorage` to `App.vue` data()
- Save cartItems on every change
- Load on mount

### Form validation failing

- Check all required fields marked with *
- Verify date is future (after tomorrow)
- Check email format

## 📞 Support Resources

- **Vite Docs**: https://vitejs.dev
- **Vue 3 Docs**: https://v3.vuejs.org
- **Express Docs**: https://expressjs.com
- **Nodemailer Docs**: https://nodemailer.com
- **Heroku Deploy**: https://devcenter.heroku.com

## 🎯 Next Steps

1. ✓ Frontend working locally
2. ✓ Backend template ready
3. → Set up backend with email
4. → Deploy to production
5. → Add customer reviews
6. → Add admin dashboard
7. → Integrate payment system

## 📝 Notes

- Mock products display by default
- Orders log to console if no backend
- All styling is responsive
- No database required initially
- Can add database later for history

## 🎉 You're Ready!

Your bakery ordering site is now set up. Start with the frontend, then add backend for emails.

**Good luck with your bakery business!** 🍰
