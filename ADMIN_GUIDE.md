code  we've# Admin Dashboard Guide

## Overview
The Baker Admin Dashboard provides a complete order management system for bakery staff to track, manage, and fulfill customer orders.

## Access Admin Panel
1. Click the **👨‍💼 Admin** button in the header
2. Go to `/admin/login`

## Demo Credentials
- **Username:** `baker`
- **Password:** `password123`

## Dashboard Features

### 📊 Dashboard Tab
Displays key business metrics at a glance:
- **Total Orders:** Number of all orders placed
- **Total Revenue:** Sum of all order totals
- **Pending Orders:** Count of orders awaiting action
- **Completed Orders:** Count of finished orders

### 📋 All Orders Tab
Complete order management system with the following features:

#### Search & Filter
- **Search Bar:** Find orders by customer name or order ID
- **Status Filter:** Filter orders by:
  - Pending (⏳)
  - In Progress (👨‍🍳)
  - Ready for Pickup (✅)
  - Completed (🎉)
  - Cancelled (❌)

#### Order Cards
Each order card displays:
- Order ID and status badge
- Customer name and contact details (phone & email)
- Quick preview of cake items with sizes
- Order date and total amount

#### Detailed Order View
Click any order card to open a modal with complete details:

**Customer Information**
- Full name, email, phone number

**Order Details**
- Order ID
- Order date & time
- Delivery date

**Cakes Section**
- Cake names and quantities
- Customization details:
  - Size (6", 8", 10", 12")
  - Flavor selection
  - Color choice
  - Special details/instructions
- Individual cake prices and total

**Status Management**
- Update order status with buttons:
  - ⏳ Pending → 👨‍🍳 In Progress
  - 👨‍🍳 In Progress → ✅ Ready for Pickup
  - ✅ Ready for Pickup → 🎉 Completed
  - Any status → ❌ Cancelled

**Action Buttons**
- **📞 Contact Customer:** Initiates a phone call (tel: link)
- **🖨️ Print Order:** Prints order details for physical records
- **Close:** Returns to order list

### 📅 Delivery Schedule Tab
Interactive calendar view of upcoming deliveries:
- Navigate between months with arrow buttons
- Days with orders show order count
- Color-coded highlights for days with orders
- Quick visual planning of workload

### ⚙️ Baker Settings Tab
Store and manage baker information:

**Editable Fields:**
- Baker Name
- Business Email
- Phone Number
- Business Address (multi-line)
- Default Delivery Time

**Save Settings Button**
All settings are saved to localStorage and persist across sessions.

## Order Status Workflow

```
Pending ──→ In Progress ──→ Ready for Pickup ──→ Completed
    ↓
  Cancelled (can cancel from any state)
```

**Recommended Workflow:**
1. **Pending:** New order received - review cake specifications
2. **In Progress:** Start baking - update when work begins
3. **Ready for Pickup:** Cake is complete and ready - notify customer
4. **Completed:** Customer picked up their cake

## Key Features

### Real-time Updates
- Orders load from localStorage
- Changes save automatically
- Status updates reflect immediately

### Customer Contact
- Email addresses available in order details
- Phone button initiates direct calls
- One-click customer communication

### Print Functionality
- Order details formatted for printing
- Professional layout with all cake specifications
- Shows customer delivery address and special requests

### Data Persistence
- All orders stored in browser's localStorage
- Settings saved separately
- No server required for demo/local testing

## Sample Orders
The system comes with 2 sample orders to demonstrate functionality:
1. Sarah Johnson - Birthday cake (Pending)
2. Mike Turner - Wedding cakes (In Progress)

You can add more by processing actual customer orders.

## Best Practices

### Daily Workflow
1. Check **Dashboard** for pending orders count
2. Go to **All Orders** and filter by "Pending"
3. Start with oldest pending orders first
4. Update status as you progress through each cake
5. Update to "Ready for Pickup" when complete
6. Contact customer to arrange pickup

### Calendar Planning
- Use **Delivery Schedule** at start of week
- Plan daily workload based on order density
- Adjust staffing based on order volume

### Settings Management
- Keep baker contact info up to date
- Update delivery time as business hours change
- Share phone/email for customer follow-ups

## Logout
Click the **🚪 Logout** button in the sidebar to exit the admin panel. This clears the admin session.

---

**Note:** This is a demo system using browser localStorage. For production, connect to a backend database to persist orders across sessions and devices.
