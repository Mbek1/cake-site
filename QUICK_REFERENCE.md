# 🍰 Quick Reference - Pastry Paradise

## Quick Commands

```bash
# Start frontend development
npm run dev

# Build for production
npm run build

# Install new package
npm install package-name
```

## File Locations

| What | Where |
|------|-------|
| Main app | `src/App.vue` |
| Products | `src/services/orderService.js` |
| Header | `src/components/Header.vue` |
| Products grid | `src/components/ProductCatalogue.vue` |
| Order form | `src/components/OrderForm.vue` |
| Cart modal | `src/components/CartModal.vue` |
| Styling | `src/style.css` + component styles |
| Backend template | `backend-server-example.js` |
| Config example | `.env.example` |

## Key Colors

- **Pink**: `#f093fb`
- **Red**: `#f5576c`
- **Light gray**: `#f8f9fa`
- **Dark gray**: `#333`

## Edit Products

In `src/services/orderService.js`, modify `getMockProducts()`:

```javascript
{
  id: 1,
  name: 'Product Name',
  price: 9.99,
  image: '🥐',
  description: 'Description here'
}
```

## Add Backend Email

1. Create backend folder
2. Run: `npm init -y && npm install express cors nodemailer dotenv`
3. Copy `backend-server-example.js` → `server.js`
4. Copy `.env.example` → `.env`
5. Fill in `.env` with email credentials
6. Run: `node server.js`
7. Uncomment API call in `orderService.js`

## Component Structure

```
App.vue (main)
├── Header (navigation)
├── ProductCatalogue (products grid)
├── OrderForm (checkout)
└── CartModal (shopping cart)
```

## Data Flow

```
ProductCatalogue
    ↓ (add-to-cart)
App.vue (cartItems state)
    ↓
OrderForm (displays cart)
    ↓ (submit order)
Backend API (if connected)
    ↓
Email sent (baker + customer)
```

## Testing Cart

1. Scroll to "Our Delicious Selection"
2. Set quantity for any product
3. Click "Add to Cart"
4. Click cart button in header
5. View items in modal

## Testing Order

1. Add items to cart
2. Scroll to "Your Order"
3. Fill in all fields
4. Click "Place Order"
5. See success message

## Common Changes

### Change primary color from pink to blue
Find: `#f093fb` and replace with `#4051ff`
Find: `#f5576c` and replace with `#0028cc`

### Hide the cart modal header
Edit: `CartModal.vue` → remove `<div class="modal-header">`

### Change product quantity step
Edit: `ProductCatalogue.vue` → change `<input type="number" step="0.5">`

### Add new page
1. Create `src/pages/YourPage.vue`
2. Import in `App.vue`
3. Add to template

## Debugging

| Issue | Solution |
|-------|----------|
| Blank page | Check browser console (F12), look for errors |
| Buttons not working | Check console for JavaScript errors |
| Styles broken | Clear cache (Ctrl+Shift+Delete) and refresh |
| API 404 error | Verify backend is running on port 3000 |
| Emails not sending | Check `.env` file has correct Gmail credentials |

## Browser Support

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- IE 11: ✗ Not supported (use Vite with IE plugin if needed)

## Performance Tips

1. Use `npm run build` before deployment
2. Images should be optimized (products use emoji)
3. Keep components small and focused
4. Use v-if for conditional rendering
5. Lazy load heavy features

## Security Notes

- Never commit `.env` with real credentials
- Add `.env` to `.gitignore`
- Validate all form inputs on backend
- Use HTTPS in production
- Sanitize email inputs

## Mobile Friendly

The site is responsive with:
- Mobile-first CSS
- Touch-friendly buttons
- Grid auto-adjusts on smaller screens
- Modal works on mobile

## Keyboard Shortcuts

- `npm run dev` → start dev server
- `F12` → open developer tools
- `Ctrl+Shift+Delete` → clear cache
- `Ctrl+K` → VS Code command palette

---

**Need help?** Check `COMPLETE_SETUP_GUIDE.md` for detailed instructions.
