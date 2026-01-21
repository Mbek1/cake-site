/**
 * Pastry Paradise Backend Server
 * 
 * This is an example backend server using Node.js + Express
 * It handles order submissions and sends emails to the baker
 * 
 * Setup Instructions:
 * 1. Create a new folder for backend: mkdir pastry-backend && cd pastry-backend
 * 2. Initialize: npm init -y
 * 3. Install dependencies: npm install express cors nodemailer dotenv
 * 4. Create a .env file with email credentials (see .env.example)
 * 5. Run: node server.js
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URL
  credentials: true
}));
app.use(express.json());

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes

/**
 * POST /api/orders
 * Submit a new order
 */
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total, deliveryDate, notes, orderDate } = req.body;

    // Validate required fields
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing customer information' 
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order must contain items' 
      });
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}`;

    // Email template for baker
    const bakerEmailHtml = generateBakerEmail(orderId, customer, items, total, deliveryDate, notes);

    // Email template for customer
    const customerEmailHtml = generateCustomerEmail(orderId, customer, items, total, deliveryDate);

    // Send email to baker
    const bakerMailOptions = {
      from: `"Pastry Paradise" <${process.env.EMAIL_USER}>`,
      to: process.env.BAKER_EMAIL,
      subject: `📦 New Order #${orderId} - ${customer.name}`,
      html: bakerEmailHtml
    };

    // Send email to customer
    const customerMailOptions = {
      from: `"Pastry Paradise" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Order Confirmation #${orderId}`,
      html: customerEmailHtml
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(bakerMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    // Return success response
    res.json({ 
      success: true, 
      message: 'Order submitted successfully',
      orderId: orderId,
      orderData: {
        customer,
        items,
        total,
        deliveryDate,
        orderDate
      }
    });

  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process order' 
    });
  }
});

/**
 * GET /api/orders/:orderId
 * Get order status (optional feature)
 */
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    // In a real app, you would query a database
    res.json({ 
      success: true, 
      orderId: orderId,
      status: 'pending',
      message: 'The baker will contact you soon to confirm.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Helper function to generate baker email
function generateBakerEmail(orderId, customer, items, total, deliveryDate, notes) {
  const itemsList = items
    .map(item => `<li><strong>${item.name}</strong> × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`)
    .join('');

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 5px; }
          .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
          .items-list { list-style: none; padding: 0; }
          .items-list li { padding: 8px 0; border-bottom: 1px solid #ddd; }
          .total { font-size: 1.3em; font-weight: bold; color: #f5576c; margin-top: 15px; }
          .contact { background: #fff; padding: 15px; border-left: 4px solid #f093fb; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🍰 New Order Received</h1>
            <p style="margin: 5px 0 0 0;">Order ID: ${orderId}</p>
          </div>

          <div class="section">
            <h2 style="margin-top: 0;">Customer Information</h2>
            <div class="contact">
              <p><strong>Name:</strong> ${customer.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${customer.phone}">${customer.phone}</a></p>
            </div>
          </div>

          <div class="section">
            <h2 style="margin-top: 0;">Order Details</h2>
            <ul class="items-list">
              ${itemsList}
            </ul>
            <div class="total">
              Total: $${total.toFixed(2)}
            </div>
          </div>

          <div class="section">
            <h2 style="margin-top: 0;">Delivery Information</h2>
            <p><strong>Requested Date:</strong> ${deliveryDate}</p>
            ${notes ? `<p><strong>Special Requests:</strong> ${notes}</p>` : '<p>No special requests</p>'}
          </div>

          <div class="footer">
            <p>Please contact the customer to confirm the order.</p>
            <p>Order submitted at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Helper function to generate customer email
function generateCustomerEmail(orderId, customer, items, total, deliveryDate) {
  const itemsList = items
    .map(item => `<li>${item.name} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`)
    .join('');

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 5px; }
          .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
          .items-list { list-style: none; padding: 0; }
          .items-list li { padding: 8px 0; border-bottom: 1px solid #ddd; }
          .total { font-size: 1.3em; font-weight: bold; color: #f5576c; margin-top: 15px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Order Confirmation</h1>
            <p style="margin: 5px 0 0 0;">Order ID: ${orderId}</p>
          </div>

          <div class="section">
            <p>Thank you for your order, <strong>${customer.name}</strong>!</p>
            <p>We've received your order and the baker will contact you shortly at <strong>${customer.phone}</strong> to confirm the details and finalize the delivery date.</p>
          </div>

          <div class="section">
            <h2 style="margin-top: 0;">Order Summary</h2>
            <ul class="items-list">
              ${itemsList}
            </ul>
            <div class="total">
              Total: $${total.toFixed(2)}
            </div>
          </div>

          <div class="section">
            <h2 style="margin-top: 0;">Delivery Details</h2>
            <p><strong>Requested Date:</strong> ${deliveryDate}</p>
            <p>The baker will contact you to confirm the final delivery date and time.</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing Pastry Paradise!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🍰 Pastry Paradise Backend Server running on http://localhost:${PORT}`);
  console.log(`📧 Configured to send emails from: ${process.env.EMAIL_USER}`);
  console.log(`📮 Orders will be sent to: ${process.env.BAKER_EMAIL}`);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
