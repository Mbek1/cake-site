<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Shopping Cart</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>
      
      <div class="modal-body">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
        </div>
        <div v-else>
          <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p v-if="item.customization" class="customization-details">
                {{ item.customization.size }} • {{ item.customization.flavor }} • {{ item.customization.color }}
              </p>
              <p class="qty-price">Qty: {{ item.quantity }} × ${{ item.price.toFixed(2) }}</p>
            </div>
            <span class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</span>
            <button @click="removeItem(index)" class="remove-btn">Remove</button>
          </div>
          <div class="cart-summary">
            <p><strong>Subtotal:</strong> ${{ cartTotal.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="closeModal" class="btn-secondary">Continue Shopping</button>
        <button 
          v-if="cartItems.length > 0"
          @click="proceedToOrder" 
          class="btn-primary"
        >
          Proceed to Order
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartModal',
  props: {
    isOpen: Boolean,
    cartItems: Array
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    removeItem(index) {
      this.$emit('remove-from-cart', index);
    },
    proceedToOrder() {
      this.closeModal();
      this.$emit('proceed-to-order');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f8f9fa;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: #f8f9fa;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.empty-cart {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
  background: #f0f0f0;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0;
  color: #333;
}

.customization-details {
  margin: 0.3rem 0 0 0;
  color: #666;
  font-size: 0.8rem;
}

.qty-price {
  margin: 0.3rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.item-total {
  font-weight: bold;
  color: #f5576c;
  min-width: 60px;
  text-align: right;
}

.remove-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: #ff5252;
}

.cart-summary {
  padding-top: 1rem;
  border-top: 2px solid #e9ecef;
  text-align: right;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 2px solid #f8f9fa;
}

.btn-secondary, .btn-primary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #e9ecef;
  color: #333;
}

.btn-secondary:hover {
  background: #dee2e6;
}

.btn-primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
}
</style>
