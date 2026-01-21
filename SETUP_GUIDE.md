# Pastry Paradise - Bakery Ordering Website

A beautiful Vue 3 + Vite website for a bakery to showcase their products and accept orders online.

## Features

✨ **Product Catalogue** - Browse a variety of baked goods with descriptions and prices
🛒 **Shopping Cart** - Add items to cart with quantities
📝 **Order Form** - Collect customer information (name, email, phone, delivery date)
📧 **Email Integration** - Orders are sent to the baker's email with customer contact details
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
🎨 **Beautiful UI** - Modern gradient design with smooth animations

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start a development server at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.vue           # Navigation header with cart button
│   ├── ProductCatalogue.vue # Product grid with add to cart
│   ├── OrderForm.vue        # Order form with customer details
│   └── CartModal.vue        # Shopping cart modal
├── services/
│   └── orderService.js      # API calls and mock data
├── App.vue                  # Main app component
├── main.js                  # Entry point
└── style.css                # Global styles
```

## Backend Integration

To enable order submission to email, you need to set up a backend server. Here's an example using Node.js + Express:

### Example Backend Setup

1. Create a new Node.js project for the backend:
```bash
mkdir pastry-backend
cd pastry-backend
npm init -y
npm install express cors nodemailer dotenv axios
```

2. Create a `.env` file with your email credentials:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BAKER_EMAIL=baker@example.com
BAKER_PHONE=+1234567890
```

3. Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total, deliveryDate, notes } = req.body;

    // Email to baker
    const bakerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.BAKER_EMAIL,
      subject: `New Order from ${customer.name}`,
      html: `
        <h2>New Order Received</h2>
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
        
        <h3>Order Items</h3>
        <ul>
          ${items.map(item => `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
        </ul>
        
        <h3>Total: $${total.toFixed(2)}</h3>
        
        ${notes ? `<h3>Special Requests</h3><p>${notes}</p>` : ''}
      `
    };

    // Email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: 'Order Confirmation - Pastry Paradise',
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order, ${customer.name}!</p>
        <p>The baker will contact you at ${customer.phone} to confirm your order.</p>
        <h3>Order Details</h3>
        <ul>
          ${items.map(item => `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
        </ul>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p><strong>Requested Delivery Date:</strong> ${deliveryDate}</p>
      `
    };

    // Send emails
    await transporter.sendMail(bakerMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.json({ success: true, message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

4. Run the backend:
```bash
node server.js
```

### Connect Frontend to Backend

Update `src/services/orderService.js` to use your backend URL:

```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // or your production URL
```

## Customization

### Adding Products
Edit the `getMockProducts()` function in `src/services/orderService.js` to add your products.

### Changing Colors
The site uses a pink gradient theme. Modify the color values in component files:
- Primary gradient: `#f093fb` to `#f5576c`
- You can customize these colors in the `<style>` sections of components

### Adding Baker Contact Info
Create a footer component with baker's contact information and add it to `App.vue`.

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with gradients and animations

## Deployment

### Vercel
```bash
npm run build
```
Deploy the `dist` folder to Vercel.

### Netlify
Connect your GitHub repository to Netlify for automatic deployments.

## License

MIT

## Support

For questions or issues, please create an issue in the repository.
