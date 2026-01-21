<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="container">
      <div class="logo" @click="$emit('scroll-to-home')">
        <div class="logo-icon">🍰</div>
        <div class="logo-text">
          <h1>Mum's Cakes</h1>
        </div>
      </div>
      <nav class="nav">
        <button @click="scrollToSection('catalogue')" class="nav-btn">Build Cake</button>
        <button @click="scrollToSection('order')" class="nav-btn">Order</button>
        <button @click="showCart" class="cart-btn">
          <span class="cart-icon">🛒</span>
          <span class="cart-count" :class="{ show: cartCount > 0 }">{{ cartCount }}</span>
        </button>
        <router-link to="/admin/login" class="admin-btn">Admin</router-link>
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
  data() {
    return {
      isScrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.4s ease;
}

.header.scrolled {
  padding: 0.5rem 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  backdrop-filter: blur(10px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 2.5rem;
  display: inline-block;
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.logo-text h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.nav {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.nav-btn, .cart-btn, .admin-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.nav-btn:hover, .admin-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.cart-btn {
  background: rgba(255, 255, 255, 0.3);
  position: relative;
}

.cart-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.cart-btn:hover .cart-icon {
  transform: scale(1.2) rotate(-10deg);
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.cart-count.show {
  opacity: 1;
  transform: scale(1);
  animation: popIn 0.4s ease-out;
}

@keyframes popIn {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.cart-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .logo-text h1 {
    font-size: 1.2rem;
  }

  .logo-icon {
    font-size: 2rem;
  }

  .nav-btn, .cart-btn, .admin-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>
