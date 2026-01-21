const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://your-app.vercel.app',
    process.env.WORDPRESS_URL || 'https://yourcakeshop.com'
  ],
  credentials: true
}));
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// In-memory storage for orders (use database in production)
let orders = [];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Cake Ordering API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Submit new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total, deliveryDate, notes } = req.body;

    // Validation
    if (!customer || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      customer,
      items,
      total,
      deliveryDate,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store order
    orders.push(order);

    // Send email to baker
    const bakerEmail = process.env.BAKER_EMAIL || 'baker@pastryparadise.com';
    const bakerName = process.env.BAKER_NAME || 'Baker';

    await sendOrderEmail(
      bakerEmail,
      `New Order: ${order.id}`,
      formatOrderForBaker(order),
      bakerName
    );

    // Send confirmation to customer
    await sendOrderEmail(
      customer.email,
      'Order Confirmation - Pastry Paradise',
      formatOrderForCustomer(order),
      'Pastry Paradise'
    );

    res.status(201).json({
      message: 'Order submitted successfully',
      orderId: order.id
    });

  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({
      error: 'Failed to submit order',
      message: error.message
    });
  }
});

// Update order status
app.patch('/api/orders/:id', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  res.json({
    message: 'Order updated successfully',
    order
  });
});

// Get products (returns from frontend storage for now)
app.get('/api/products', (req, res) => {
  res.json({
    message: 'Products are managed in frontend localStorage',
    note: 'Connect to database if needed'
  });
});

// Helper function to send emails
async function sendOrderEmail(to, subject, htmlContent, senderName) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email not configured. Skipping send.');
      return;
    }

    const mailOptions = {
      from: `"${senderName}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw - allow order to succeed even if email fails
  }
}

// Format order for baker email
function formatOrderForBaker(order) {
  return `
    <h2>New Order Received!</h2>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Customer:</strong> ${order.customer.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${order.customer.email}">${order.customer.email}</a></p>
    <p><strong>Phone:</strong> <a href="tel:${order.customer.phone}">${order.customer.phone}</a></p>
    <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>
    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    
    <h3>Order Items:</h3>
    <table border="1" cellpadding="10">
      <tr>
        <th>Cake</th>
        <th>Size</th>
        <th>Flavor</th>
        <th>Color</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
      ${order.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.customization?.size || 'N/A'}</td>
          <td>${item.customization?.flavor || 'N/A'}</td>
          <td>${item.customization?.color || 'N/A'}</td>
          <td>${item.quantity}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
    
    ${order.customization?.specialDetails ? `
      <h3>Special Details:</h3>
      <p>${order.customization.specialDetails}</p>
    ` : ''}
    
    ${order.notes ? `
      <h3>Customer Notes:</h3>
      <p>${order.notes}</p>
    ` : ''}
    
    <p>Log in to your admin dashboard to manage this order.</p>
  `;
}

// Format order for customer email
function formatOrderForCustomer(order) {
  return `
    <h2>Thank you for your order!</h2>
    <p>We've received your order and will prepare your delicious cakes.</p>
    
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>
    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    
    <h3>Your Order:</h3>
    <ul>
      ${order.items.map(item => `
        <li>
          <strong>${item.name}</strong> (${item.quantity}x)
          <br/>Size: ${item.customization?.size || 'N/A'} | 
          Flavor: ${item.customization?.flavor || 'N/A'} | 
          Color: ${item.customization?.color || 'N/A'}
        </li>
      `).join('')}
    </ul>
    
    <p>We will contact you shortly to confirm your order and discuss any custom details.</p>
    <p><strong>Contact us:</strong> ${process.env.BAKER_PHONE || '(555) 123-4567'}</p>
    
    <p>Thank you for choosing Pastry Paradise!</p>
  `;
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🍰 Cake Ordering Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
