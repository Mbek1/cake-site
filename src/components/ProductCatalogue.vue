<template>
  <section id="catalogue" class="catalogue">
    <div class="container">
      <h2>🎂 Custom Cake Builder</h2>
      <p class="subtitle">Select your cake type and customize it exactly how you want</p>
      
      <div class="cake-builder">
        <!-- Cake Selection -->
        <div class="cake-selection">
          <h3>Step 1: Choose Your Cake Type</h3>
          <div class="cake-grid">
            <div 
              v-for="cake in cakes" 
              :key="cake.id" 
              :class="['cake-card', { selected: selectedCake?.id === cake.id }]"
              @click="selectCake(cake)"
            >
              <div class="cake-image">
                <img :src="cake.image" :alt="cake.name" class="cake-img">
              </div>
              <h4>{{ cake.name }}</h4>
              <p class="cake-desc">{{ cake.description }}</p>
              <p class="base-price">${{ cake.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Customization Section -->
        <div v-if="selectedCake" class="customization-section">
          <!-- Size Selection -->
          <div class="customization-group">
            <h3>Step 2: Select Size</h3>
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
            <h3>Step 3: Choose Flavor</h3>
            <select v-model="customization.flavor" class="form-select">
              <option value="">Select a flavor...</option>
              <option v-for="flavor in flavors" :key="flavor" :value="flavor">
                {{ flavor }}
              </option>
            </select>
          </div>

          <!-- Color Selection -->
          <div class="customization-group">
            <h3>Step 4: Frosting Color</h3>
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
            <h3>Step 5: Special Details & Design</h3>
            <textarea 
              v-model="customization.specialDetails"
              placeholder="Describe exactly what you want on your cake: inscriptions, decorations, toppings, theme, special requests, etc."
              class="details-textarea"
              rows="4"
            ></textarea>
          </div>

          <!-- Total Price Display -->
          <div class="price-summary">
            <div class="price-line">
              <span>Base Cake Price:</span>
              <span>${{ selectedCake.price.toFixed(2) }}</span>
            </div>
            <div class="price-line">
              <span>Size Upgrade:</span>
              <span>+${{ getSelectedSizePrice().toFixed(2) }}</span>
            </div>
            <div class="price-line total">
              <span>Total:</span>
              <span>${{ getTotalPrice().toFixed(2) }}</span>
            </div>
          </div>

          <!-- Quantity Selection -->
          <div class="customization-group">
            <label for="quantity">Quantity:</label>
            <div class="quantity-input-group">
              <button @click="customization.quantity = Math.max(1, customization.quantity - 1)" class="qty-btn">-</button>
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

        <!-- No cake selected message -->
        <div v-if="!selectedCake" class="empty-state">
          <p>👆 Select a cake type to start customizing!</p>
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
  padding: 3rem 1rem;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.cake-builder {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

/* Cake Selection */
.cake-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.cake-card {
  background: #f8f9fa;
  border: 3px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cake-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.2);
}

.cake-card.selected {
  border-color: #f5576c;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.3);
}

.cake-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f0f0f0;
}

.cake-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cake-card h4 {
  color: #333;
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.cake-desc {
  color: #666;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  min-height: 2.5rem;
}

.base-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f5576c;
  margin: 1rem 0 0 0;
}

/* Customization Section */
.customization-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.customization-group {
  margin-bottom: 2rem;
}

.customization-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

/* Size Options */
.size-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.size-option {
  padding: 1rem;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.size-option:hover {
  border-color: #f093fb;
  background: #fff;
}

.size-option.selected {
  border-color: #f5576c;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
}

.size-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.size-servings {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.size-price {
  font-weight: bold;
  color: #f5576c;
  font-size: 0.95rem;
}

/* Color Grid */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 1rem;
}

.color-swatch {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.color-swatch.selected {
  border-color: #333;
  box-shadow: 0 0 0 3px #f5576c;
}

.checkmark {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

/* Form Select */
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #f093fb;
}

/* Details Textarea */
.details-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  resize: vertical;
}

.details-textarea:focus {
  outline: none;
  border-color: #f093fb;
}

/* Price Summary */
.price-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.price-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #333;
}

.price-line.total {
  border-top: 2px solid #ddd;
  padding-top: 0.75rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: #f5576c;
}

/* Quantity Input */
.quantity-input-group {
  display: flex;
  gap: 0.5rem;
  max-width: 150px;
}

.qty-btn {
  flex: 0 0 40px;
  padding: 0.5rem;
  background: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.qty-btn:hover {
  background: #f093fb;
  color: white;
  border-color: #f093fb;
}

.quantity-input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  text-align: center;
}

.quantity-input:focus {
  outline: none;
  border-color: #f093fb;
}

/* Add to Cart Button */
.add-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .cake-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  .color-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
