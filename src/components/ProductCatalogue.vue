<template>
  <section id="catalogue" class="catalogue">
    <div class="container">
      <div class="catalogue-header">
        <h2 class="section-title">🎂 Custom Cake Builder</h2>
        <p class="subtitle">Handcraft your perfect cake with our easy 5-step builder</p>
      </div>
      
      <div class="cake-builder">
        <!-- Cake Selection -->
        <div class="cake-selection">
          <h3 class="step-title">
            <span class="step-number">1</span>
            Choose Your Cake Type
          </h3>
          <div class="cake-grid">
            <div 
              v-for="cake in cakes" 
              :key="cake.id" 
              :class="['cake-card', { selected: selectedCake?.id === cake.id }]"
              @click="selectCake(cake)"
            >
              <div class="cake-card-inner">
                <div class="cake-image">
                  <img :src="cake.image" :alt="cake.name" class="cake-img">
                  <div class="cake-overlay">Click to select</div>
                </div>
                <div class="cake-info">
                  <h4>{{ cake.name }}</h4>
                  <p class="cake-desc">{{ cake.description }}</p>
                  <p class="base-price">${{ cake.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customization Section -->
        <div v-if="selectedCake" class="customization-section">
          <transition name="slideIn">
            <div key="customization">
              <!-- Size Selection -->
              <div class="customization-group">
                <h3 class="step-title">
                  <span class="step-number">2</span>
                  Select Size
                </h3>
                <div class="size-options">
                  <div 
                    v-for="size in sizes" 
                    :key="size.id"
                    :class="['size-option', { selected: customization.sizeId === size.id }]"
                    @click="customization.sizeId = size.id"
                  >
                    <div class="size-name">{{ size.size }}</div>
                    <div class="size-servings">{{ size.servings }} servings</div>
                    <div v-if="size.basePrice > 0" class="size-price">+${{ size.basePrice }}</div>
                  </div>
                </div>
              </div>

              <!-- Flavor Selection -->
              <div class="customization-group">
                <h3 class="step-title">
                  <span class="step-number">3</span>
                  Choose Flavor
                </h3>
                <select v-model="customization.flavor" class="form-select">
                  <option value="">Select a flavor...</option>
                  <option v-for="flavor in flavors" :key="flavor" :value="flavor">
                    {{ flavor }}
                  </option>
                </select>
              </div>

              <!-- Color Selection -->
              <div class="customization-group">
                <h3 class="step-title">
                  <span class="step-number">4</span>
                  Frosting Color
                </h3>
                <div class="color-grid">
                  <div 
                    v-for="color in colors" 
                    :key="color.name"
                    :class="['color-swatch', { selected: customization.color === color.name }]"
                    :style="{ backgroundColor: color.hex }"
                    @click="customization.color = color.name"
                    :title="color.name"
                  >
                    <span v-if="customization.color === color.name" class="checkmark">✓</span>
                  </div>
                </div>
              </div>

              <!-- Special Details -->
              <div class="customization-group">
                <h3 class="step-title">
                  <span class="step-number">5</span>
                  Special Details & Design
                </h3>
                <textarea 
                  v-model="customization.specialDetails"
                  placeholder="Describe exactly what you want on your cake: inscriptions, decorations, toppings, theme, special requests, etc."
                  class="details-textarea"
                  rows="4"
                ></textarea>
              </div>

              <!-- Total Price Display -->
              <div class="price-summary">
                <div class="price-item">
                  <span class="price-label">Base Cake Price</span>
                  <span class="price-value">${{ selectedCake.price.toFixed(2) }}</span>
                </div>
                <div class="price-item">
                  <span class="price-label">Size Upgrade</span>
                  <span class="price-value">+${{ getSelectedSizePrice().toFixed(2) }}</span>
                </div>
                <div class="price-divider"></div>
                <div class="price-item total">
                  <span class="price-label">Total per cake</span>
                  <span class="price-value">${{ getTotalPrice().toFixed(2) }}</span>
                </div>
              </div>

              <!-- Quantity Selection -->
              <div class="customization-group">
                <label for="quantity" class="quantity-label">Quantity:</label>
                <div class="quantity-input-group">
                  <button @click="customization.quantity = Math.max(1, customization.quantity - 1)" class="qty-btn">−</button>
                  <input 
                    id="quantity"
                    v-model.number="customization.quantity" 
                    type="number" 
                    min="1"
                    class="quantity-input"
                  >
                  <button @click="customization.quantity += 1" class="qty-btn">+</button>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <button 
                @click="addToCart" 
                class="add-btn"
                :disabled="!isCustomizationComplete()"
              >
                🛒 Add to Cart - ${{ (getTotalPrice() * customization.quantity).toFixed(2) }}
              </button>
            </div>
          </transition>
        </div>

        <!-- No cake selected message -->
        <div v-if="!selectedCake" class="empty-state">
          <div class="empty-icon">👆</div>
          <p>Select a cake type to start building your masterpiece!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getMockProducts, getCakeSizes, getCakeFlavors, getCakeColors, getProducts } from '../services/orderService';

export default {
  name: 'ProductCatalogue',
  data() {
    return {
      cakes: [],
      sizes: [],
      flavors: [],
      colors: [],
      selectedCake: null,
      customization: {
        sizeId: 1,
        flavor: '',
        color: 'White',
        specialDetails: '',
        quantity: 1
      }
    }
  },
  mounted() {
    this.loadProducts();
    this.sizes = getCakeSizes();
    this.flavors = getCakeFlavors();
    this.colors = getCakeColors();
    
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', this.onStorageChange);
    // Listen for custom products updated event from admin
    window.addEventListener('productsUpdated', this.loadProducts);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.onStorageChange);
    window.removeEventListener('productsUpdated', this.loadProducts);
  },
  methods: {
    loadProducts() {
      // Try to get products from localStorage first
      const storedProducts = localStorage.getItem('bakery-products');
      if (storedProducts) {
        this.cakes = JSON.parse(storedProducts);
      } else {
        this.cakes = getMockProducts();
      }
    },
    onStorageChange(e) {
      // If bakery-products changed in localStorage, reload
      if (e.key === 'bakery-products') {
        this.loadProducts();
      }
    },
    selectCake(cake) {
      this.selectedCake = cake;
      // Reset customization when selecting new cake
      this.customization = {
        sizeId: 1,
        flavor: '',
        color: 'White',
        specialDetails: '',
        quantity: 1
      };
    },
    getSelectedSizePrice() {
      const size = this.sizes.find(s => s.id === this.customization.sizeId);
      return size ? size.basePrice : 0;
    },
    getTotalPrice() {
      if (!this.selectedCake) return 0;
      return this.selectedCake.price + this.getSelectedSizePrice();
    },
    isCustomizationComplete() {
      return this.customization.flavor && this.customization.color;
    },
    addToCart() {
      if (!this.isCustomizationComplete()) {
        alert('Please select flavor and color');
        return;
      }

      const selectedSize = this.sizes.find(s => s.id === this.customization.sizeId);
      const cartItem = {
        id: this.selectedCake.id,
        name: this.selectedCake.name,
        basePrice: this.selectedCake.price,
        price: this.getTotalPrice(),
        image: this.selectedCake.image,
        quantity: this.customization.quantity,
        customization: {
          size: selectedSize.size,
          flavor: this.customization.flavor,
          color: this.customization.color,
          specialDetails: this.customization.specialDetails
        }
      };

      this.$emit('add-to-cart', cartItem);
      
      // Reset
      this.selectedCake = null;
      this.customization = {
        sizeId: 1,
        flavor: '',
        color: 'White',
        specialDetails: '',
        quantity: 1
      };
    }
  }
}
</script>

<style scoped>
.catalogue {
  padding: 4rem 2rem;
  background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.catalogue-header {
  animation: slideInUp 0.8s ease-out;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

.cake-builder {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: scaleIn 0.6s ease-out;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

.step-title:first-of-type {
  margin-top: 0;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.1rem;
}

/* Cake Selection */
.cake-selection {
  animation: fadeIn 0.8s ease-out;
}

.cake-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.cake-card {
  background: #f8f9fa;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: slideInUp 0.6s ease-out;
}

.cake-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(245, 87, 108, 0.15);
  border-color: #f093fb;
}

.cake-card.selected {
  border-color: #f5576c;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%);
  box-shadow: 0 15px 35px rgba(245, 87, 108, 0.2);
  transform: scale(1.02);
}

.cake-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cake-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  position: relative;
}

.cake-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.cake-card:hover .cake-img {
  transform: scale(1.1);
}

.cake-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245, 87, 108, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cake-card:hover .cake-overlay {
  opacity: 1;
}

.cake-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cake-info h4 {
  color: #333;
  margin: 0.5rem 0;
  font-size: 1.15rem;
}

.cake-desc {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  flex-grow: 1;
  line-height: 1.4;
}

.base-price {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 1rem 0 0 0;
}

/* Customization Section */
.customization-section {
  animation: slideIn 0.6s ease-out;
  border-top: 2px solid #f0f0f0;
  padding-top: 2rem;
}

.customization-group {
  margin-bottom: 2.5rem;
  animation: fadeIn 0.6s ease-out;
}

.customization-group label,
.quantity-label {
  display: block;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

/* Size Options */
.size-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 1.5rem;
}

.size-option {
  padding: 1.5rem;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.size-option:hover {
  border-color: #f093fb;
  background: white;
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(240, 147, 251, 0.15);
}

.size-option.selected {
  border-color: #f5576c;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.08) 0%, rgba(245, 87, 108, 0.08) 100%);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.15);
}

.size-name {
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
}

.size-servings {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.75rem;
}

.size-price {
  font-weight: 600;
  color: #f5576c;
  font-size: 1rem;
}

/* Form Select */
.form-select {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
}

.form-select:hover {
  border-color: #f093fb;
}

.form-select:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}

/* Color Grid */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 1.5rem;
  margin: 1rem 0;
}

.color-swatch {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid #ddd;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
}

.color-swatch:hover {
  transform: scale(1.15);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.color-swatch.selected {
  border-color: #f5576c;
  box-shadow: 0 0 0 4px rgba(245, 87, 108, 0.3), 0 0 15px rgba(245, 87, 108, 0.4);
  animation: pulse 1.5s ease-in-out;
}

.checkmark {
  font-size: 1.8rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

/* Details Textarea */
.details-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
}

.details-textarea:hover {
  border-color: #f093fb;
}

.details-textarea:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}

/* Price Summary */
.price-summary {
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border: 2px solid #f0f0f0;
  padding: 2rem;
  border-radius: 15px;
  margin: 2.5rem 0;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  animation: slideInLeft 0.5s ease-out;
}

.price-label {
  color: #666;
  font-weight: 500;
}

.price-value {
  color: #333;
  font-weight: 600;
}

.price-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 1rem 0;
}

.price-item.total {
  font-size: 1.4rem;
  margin-bottom: 0;
}

.price-item.total .price-label {
  color: #333;
  font-weight: 700;
}

.price-item.total .price-value {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
}

/* Quantity Input */
.quantity-input-group {
  display: flex;
  gap: 0.75rem;
  max-width: 160px;
}

.qty-btn {
  flex: 0 0 45px;
  padding: 0.6rem;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.qty-btn:hover {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: transparent;
  transform: scale(1.1);
}

.quantity-input {
  flex: 1;
  padding: 0.6rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.quantity-input:hover {
  border-color: #f093fb;
}

.quantity-input:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}

/* Add to Cart Button */
.add-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 1.5rem;
  box-shadow: 0 10px 25px rgba(245, 87, 108, 0.2);
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(245, 87, 108, 0.3);
}

.add-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  animation: bounce 2s ease-in-out infinite;
}

.empty-state p {
  font-size: 1.2rem;
  color: #666;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .catalogue {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .cake-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .size-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .color-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .add-btn {
    padding: 1rem;
    font-size: 1rem;
  }

  .step-title {
    font-size: 1.1rem;
  }

  .step-number {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
}
</style>
