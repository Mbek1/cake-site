<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <h1>🍰 Pastry Paradise</h1>
        <p>Freshly Baked Delights</p>
      </div>
      <nav class="nav">
        <button @click="scrollToSection('catalogue')" class="nav-btn">Catalogue</button>
        <button @click="scrollToSection('order')" class="nav-btn">Order</button>
        <button @click="showCart" class="cart-btn">
          🛒 Cart <span class="cart-count">{{ cartCount }}</span>
        </button>
        <router-link to="/admin/login" class="admin-btn">👨‍💼 Admin</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    cartCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    showCart() {
      this.$emit('show-cart');
    }
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.logo p {
  margin: 0.2rem 0 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-btn, .cart-btn, .admin-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.nav-btn:hover, .admin-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.cart-btn {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

.cart-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.cart-count {
  background: #f5576c;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
  margin-left: 0.5rem;
}
</style>
