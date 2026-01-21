<script>
import Header from './components/Header.vue'
import LandingPage from './components/LandingPage.vue'
import ProductCatalogue from './components/ProductCatalogue.vue'
import OrderForm from './components/OrderForm.vue'
import CartModal from './components/CartModal.vue'

export default {
  name: 'Home',
  components: {
    Header,
    LandingPage,
    ProductCatalogue,
    OrderForm,
    CartModal
  },
  data() {
    return {
      cartItems: [],
      showCartModal: false
    }
  },
  computed: {
    cartCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }
  },
  methods: {
    addToCart(product) {
      this.cartItems.push(product);
    },
    removeFromCart(index) {
      this.cartItems.splice(index, 1);
    },
    showCart() {
      this.showCartModal = true;
    },
    closeCart() {
      this.showCartModal = false;
    },
    proceedToOrder() {
      this.showCartModal = false;
      const orderSection = document.getElementById('order');
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleOrderSubmitted(orderData) {
      console.log('Order received:', orderData);
      this.cartItems = [];
      this.showCartModal = false;
    },
    scrollToCatalogue() {
      const catalogueSection = document.getElementById('catalogue');
      if (catalogueSection) {
        catalogueSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>

<template>
  <div id="app">
    <Header 
      :cartCount="cartCount"
      @show-cart="showCart"
    />
    
    <LandingPage 
      @scroll-to-catalogue="scrollToCatalogue"
    />
    
    <ProductCatalogue 
      @add-to-cart="addToCart"
    />
    
    <OrderForm 
      :cartItems="cartItems"
      @remove-from-cart="removeFromCart"
      @order-submitted="handleOrderSubmitted"
    />
    
    <CartModal 
      :isOpen="showCartModal"
      :cartItems="cartItems"
      @close="closeCart"
      @remove-from-cart="removeFromCart"
      @proceed-to-order="proceedToOrder"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  color: #333;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
