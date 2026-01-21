<template>
  <section id="order" class="order-section">
    <div class="container">
      <h2>Your Order</h2>
      
      <div class="order-content">
        <div class="cart-items">
          <h3>Cart Items</h3>
          <div v-if="cartItems.length === 0" class="empty-cart">
            <p>Your cart is empty. Add items from the catalogue above!</p>
          </div>
          <div v-else class="items-list">
            <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
              <div class="item-main">
                <img :src="item.image" :alt="item.name" class="item-image">
                <div class="item-details">
                  <span class="item-name">{{ item.name }}</span>
                  <span v-if="item.customization" class="item-customization">
                    {{ item.customization.size }} • {{ item.customization.flavor }} • {{ item.customization.color }}
                    <span v-if="item.customization.specialDetails" class="special-indicator">✓ Special Details</span>
                  </span>
                </div>
              </div>
              <span class="item-qty">x{{ item.quantity }}</span>
              <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
              <button @click="removeItem(index)" class="remove-btn">✕</button>
            </div>
            <div class="cart-total">
              <strong>Total: ${{ cartTotal.toFixed(2) }}</strong>
            </div>
          </div>
        </div>

        <form v-if="cartItems.length > 0" @submit.prevent="submitOrder" class="order-form">
          <h3>Customer Information</h3>
          
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input 
              id="name"
              v-model="form.name" 
              type="text" 
              required
              placeholder="John Doe"
            >
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              id="email"
              v-model="form.email" 
              type="email" 
              required
              placeholder="john@example.com"
            >
          </div>

          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input 
              id="phone"
              v-model="form.phone" 
              type="tel" 
              required
              placeholder="(555) 123-4567"
            >
          </div>

          <div class="form-group">
            <label for="date">Delivery/Pickup Date *</label>
            <input 
              id="date"
              v-model="form.date" 
              type="date" 
              required
              :min="minDate"
            >
          </div>

          <div class="form-group">
            <label for="notes">Special Requests/Notes</label>
            <textarea 
              id="notes"
              v-model="form.notes" 
              placeholder="Any dietary restrictions or special requests..."
              rows="4"
            ></textarea>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="submitting"
          >
            {{ submitting ? 'Submitting...' : 'Place Order' }}
          </button>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'OrderForm',
  props: {
    cartItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        date: '',
        notes: ''
      },
      submitting: false,
      successMessage: '',
      errorMessage: '',
      minDate: this.getMinDate()
    }
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  methods: {
    getMinDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    },
    removeItem(index) {
      this.$emit('remove-from-cart', index);
    },
    async submitOrder() {
      if (!this.form.name || !this.form.email || !this.form.phone || !this.form.date) {
        this.errorMessage = 'Please fill in all required fields.';
        return;
      }

      this.submitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const orderData = {
          customer: {
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone
          },
          items: this.cartItems,
          total: this.cartTotal,
          deliveryDate: this.form.date,
          notes: this.form.notes,
          orderDate: new Date().toISOString()
        };

        // For demonstration, we'll log the order and show success
        console.log('Order submitted:', orderData);
        
        // In production, you would send this to your backend:
        // const response = await submitOrder(orderData);
        
        this.successMessage = '✓ Order submitted successfully! The baker will contact you soon.';
        this.$emit('order-submitted', orderData);
        
        // Reset form
        setTimeout(() => {
          this.form = {
            name: '',
            email: '',
            phone: '',
            date: '',
            notes: ''
          };
          this.successMessage = '';
        }, 3000);

      } catch (error) {
        this.errorMessage = 'Error submitting order. Please try again.';
        console.error('Error:', error);
      } finally {
        this.submitting = false;
      }
    }
  }
}
</script>

<style scoped>
.order-section {
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.order-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.cart-items, .order-form {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.empty-cart {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.95rem;
  gap: 1rem;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  object-fit: cover;
  background: #f0f0f0;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 600;
  color: #333;
}

.item-customization {
  font-size: 0.8rem;
  color: #666;
}

.special-indicator {
  display: inline-block;
  margin-left: 0.5rem;
  background: #f5576c;
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
}

.item-qty {
  color: #666;
  margin: 0 1rem;
}

.item-price {
  color: #f5576c;
  font-weight: bold;
  min-width: 70px;
  text-align: right;
}

.remove-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 1rem;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: #ff5252;
}

.cart-total {
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 8px;
  text-align: right;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input, textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #f093fb;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  text-align: center;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 768px) {
  .order-content {
    grid-template-columns: 1fr;
  }
}
</style>
