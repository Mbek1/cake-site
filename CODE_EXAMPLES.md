# 🍰 Code Examples & Customization

## Example 1: Adding Your Products

**File:** `src/services/orderService.js`

Replace the `getMockProducts()` function:

```javascript
export const getMockProducts = () => {
  return [
    {
      id: 1,
      name: 'Chocolate Eclair',
      price: 6.99,
      image: '🍫',
      description: 'Classic French eclair with rich chocolate filling'
    },
    {
      id: 2,
      name: 'Lemon Pound Cake',
      price: 5.99,
      image: '🍋',
      description: 'Zesty lemon cake perfect for any occasion'
    },
    {
      id: 3,
      name: 'Berry Parfait',
      price: 7.99,
      image: '🍓',
      description: 'Layers of cream and fresh berries'
    },
    {
      id: 4,
      name: 'Pecan Pie',
      price: 8.99,
      image: '🥧',
      description: 'Traditional pecan pie with homemade crust'
    }
  ];
};
```

## Example 2: Changing Theme Colors

**File:** `src/components/Header.vue` (and other components)

Find this line:
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

Change to your colors:
```css
/* Blue theme */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Green theme */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Orange theme */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

## Example 3: Add a Footer Component

**File:** `src/components/Footer.vue` (create new file)

```vue
<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Handcrafted pastries made fresh daily with love</p>
        </div>
        
        <div class="footer-section">
          <h3>Contact</h3>
          <p>📞 (555) 123-4567</p>
          <p>📧 hello@pastryparadise.com</p>
          <p>📍 123 Baker Street</p>
        </div>
        
        <div class="footer-section">
          <h3>Hours</h3>
          <p>Monday - Friday: 6am - 9pm</p>
          <p>Saturday - Sunday: 8am - 10pm</p>
          <p>Closed on Holidays</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 Pastry Paradise. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: #333;
  color: white;
  padding: 3rem 1rem;
  margin-top: 3rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #f093fb;
  margin-bottom: 1rem;
}

.footer-section p {
  margin: 0.5rem 0;
  opacity: 0.9;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #555;
  opacity: 0.8;
}
</style>
```

Then add to `App.vue`:
```javascript
import Footer from './components/Footer.vue'

// In components: {
//   Footer,
//   ...
// }

// In template (at the end):
// <Footer />
```

## Example 4: Add a Reviews Component

**File:** `src/components/Reviews.vue` (create new file)

```vue
<template>
  <section class="reviews">
    <div class="container">
      <h2>Customer Reviews</h2>
      <div class="reviews-grid">
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="stars">
            <span v-for="n in review.rating" :key="n">⭐</span>
          </div>
          <p class="review-text">"{{ review.text }}"</p>
          <p class="review-author">- {{ review.author }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Reviews',
  data() {
    return {
      reviews: [
        {
          id: 1,
          rating: 5,
          text: 'Best pastries in town! Fresh and delicious every time.',
          author: 'Sarah M.'
        },
        {
          id: 2,
          rating: 5,
          text: 'The croissants are absolutely perfect. Crispy outside, buttery inside!',
          author: 'Mike K.'
        },
        {
          id: 3,
          rating: 5,
          text: 'Fast delivery and amazing packaging. Highly recommend!',
          author: 'Emma L.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.reviews {
  padding: 3rem 1rem;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.review-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stars {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.review-text {
  font-size: 1rem;
  color: #666;
  font-style: italic;
  margin: 1rem 0;
}

.review-author {
  color: #f5576c;
  font-weight: bold;
  margin: 0;
}
</style>
```

## Example 5: LocalStorage for Cart Persistence

**File:** `src/App.vue` - modify the data and methods

```javascript
data() {
  return {
    cartItems: this.loadCart(),
    showCartModal: false
  }
},

methods: {
  loadCart() {
    const saved = localStorage.getItem('pastry-cart');
    return saved ? JSON.parse(saved) : [];
  },
  
  saveCart() {
    localStorage.setItem('pastry-cart', JSON.stringify(this.cartItems));
  },
  
  addToCart(product) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      this.cartItems.push(product);
    }
    this.saveCart(); // Save after adding
  },
  
  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCart(); // Save after removing
  }
}
```

## Example 6: Backend Email Configuration

**File:** `backend-server-example.js` - if using Sendgrid instead of Gmail

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

## Example 7: Add Loading State

**File:** `src/components/OrderForm.vue` - in the submit button

```vue
<button 
  type="submit" 
  class="submit-btn"
  :disabled="submitting"
>
  {{ submitting ? '⏳ Submitting...' : '✅ Place Order' }}
</button>
```

## Example 8: Add Order Confirmation Page

**File:** `src/pages/OrderConfirmation.vue` (create new)

```vue
<template>
  <div class="confirmation">
    <div class="container">
      <div class="confirmation-card">
        <h1>✅ Order Confirmed!</h1>
        <p>Thank you for your order. Order ID: <strong>{{ orderId }}</strong></p>
        <p>Check your email for details.</p>
        <p>The baker will contact you shortly.</p>
        <button @click="$router.push('/')">Continue Shopping</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderConfirmation',
  props: {
    orderId: String
  }
}
</script>

<style scoped>
.confirmation {
  padding: 4rem 1rem;
  text-align: center;
}

.confirmation-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #f5576c;
  font-size: 2.5rem;
}

button {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}
</style>
```

## Example 9: Add Search Functionality

**File:** `src/components/ProductCatalogue.vue` - add to template

```vue
<div class="search-bar">
  <input 
    v-model="searchQuery"
    type="text"
    placeholder="Search pastries..."
    class="search-input"
  >
</div>

<div class="products-grid">
  <div v-for="product in filteredProducts" :key="product.id" class="product-card">
    <!-- existing card code -->
  </div>
</div>

// In script:
data() {
  return {
    products: [],
    quantities: {},
    searchQuery: ''
  }
},

computed: {
  filteredProducts() {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
```

## Example 10: Dark Mode Toggle

**File:** `src/App.vue`

```vue
<button @click="toggleDarkMode" class="dark-mode-btn">
  {{ darkMode ? '☀️ Light' : '🌙 Dark' }}
</button>

// In script:
data() {
  return {
    darkMode: false
  }
},

methods: {
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode');
  }
}

// In style:
body.dark-mode {
  background: #1a1a1a;
  color: #fff;
}

body.dark-mode button {
  background: #333;
  color: #fff;
}
```

---

These are just starting points. Mix and match them to create the perfect bakery website for your needs!
