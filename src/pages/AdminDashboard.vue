<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <div class="admin-header">
        <div class="logo-section">
          <div class="logo-icon">🍰</div>
          <div>
            <h1>Baker Admin</h1>
            <p class="baker-name">{{ bakerName }}</p>
          </div>
        </div>
      </div>
      <nav class="admin-nav">
        <button 
          v-for="item in navItems" 
          :key="item.id"
          :class="['nav-item', { active: activeTab === item.id }]"
          @click="activeTab = item.id"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>
      <button @click="logout" class="logout-btn">🚪 Logout</button>
    </div>

    <div class="admin-content">
      <!-- Dashboard Tab -->
      <transition name="fadeSlide">
        <section v-if="activeTab === 'dashboard'" class="tab-content" key="dashboard">
          <div class="section-header">
            <h2>📊 Dashboard Overview</h2>
            <p class="section-subtitle">Real-time bakery statistics</p>
          </div>
          <div class="dashboard-stats">
            <div class="stat-card" style="animation-delay: 0s">
              <div class="stat-icon">📦</div>
              <div class="stat-info">
                <div class="stat-number">{{ totalOrders }}</div>
                <div class="stat-label">Total Orders</div>
              </div>
            </div>
            <div class="stat-card" style="animation-delay: 0.1s">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <div class="stat-number">${{ totalRevenue.toFixed(2) }}</div>
                <div class="stat-label">Total Revenue</div>
              </div>
            </div>
            <div class="stat-card" style="animation-delay: 0.2s">
              <div class="stat-icon">⏳</div>
              <div class="stat-info">
                <div class="stat-number">{{ pendingOrders }}</div>
                <div class="stat-label">Pending Orders</div>
              </div>
            </div>
            <div class="stat-card" style="animation-delay: 0.3s">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <div class="stat-number">{{ completedOrders }}</div>
                <div class="stat-label">Completed Orders</div>
              </div>
            </div>
          </div>
        </section>
      </transition>

      <!-- Orders Tab -->
      <section v-if="activeTab === 'orders'" class="tab-content">
        <h2>📋 All Orders</h2>
        
        <div class="filter-bar">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by customer name or order ID..."
            class="search-input"
          >
          <select v-model="filterStatus" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="ready">Ready for Pickup</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div v-if="filteredOrders.length === 0" class="empty-state">
          <p>No orders found</p>
        </div>

        <div v-else class="orders-list">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            :class="['order-card', order.status]"
            @click="selectedOrder = order"
          >
            <div class="order-header">
              <div class="order-id">Order #{{ order.id }}</div>
              <div :class="['order-status', order.status]">{{ formatStatus(order.status) }}</div>
            </div>
            <div class="order-customer">
              <strong>{{ order.customer.name }}</strong>
              <span class="customer-contact">
                📞 {{ order.customer.phone }} | 📧 {{ order.customer.email }}
              </span>
            </div>
            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item-preview">
                {{ item.name }} ({{ item.customization.size }})
              </div>
            </div>
            <div class="order-footer">
              <span class="order-date">{{ formatDate(order.orderDate) }}</span>
              <span class="order-total">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Order Details Modal -->
      <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
        <div class="modal-content order-details-modal">
          <button class="close-btn" @click="selectedOrder = null">✕</button>
          
          <h2>Order Details - #{{ selectedOrder.id }}</h2>
          
          <div class="details-section">
            <h3>Customer Information</h3>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">{{ selectedOrder.customer.name }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">{{ selectedOrder.customer.email }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">{{ selectedOrder.customer.phone }}</span>
            </div>
          </div>

          <div class="details-section">
            <h3>Order Details</h3>
            <div class="detail-row">
              <span class="label">Order ID:</span>
              <span class="value">{{ selectedOrder.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Order Date:</span>
              <span class="value">{{ formatFullDate(selectedOrder.orderDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Delivery Date:</span>
              <span class="value">{{ formatDate(selectedOrder.deliveryDate) }}</span>
            </div>
          </div>

          <div class="details-section">
            <h3>Cakes</h3>
            <div v-for="(item, index) in selectedOrder.items" :key="index" class="cake-details">
              <div class="cake-header">
                <strong>{{ item.name }}</strong>
                <span class="qty">Qty: {{ item.quantity }}</span>
              </div>
              <div class="cake-custom">
                <p><strong>Size:</strong> {{ item.customization.size }}</p>
                <p><strong>Flavor:</strong> {{ item.customization.flavor }}</p>
                <p><strong>Color:</strong> {{ item.customization.color }}</p>
              </div>
              <div v-if="item.customization.specialDetails" class="cake-special">
                <strong>Special Details:</strong>
                <p>{{ item.customization.specialDetails }}</p>
              </div>
              <div class="cake-price">
                Price: ${{ item.price.toFixed(2) }} × {{ item.quantity }} = ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div v-if="selectedOrder.notes" class="details-section">
            <h3>Customer Notes</h3>
            <p>{{ selectedOrder.notes }}</p>
          </div>

          <div class="details-section">
            <h3>Order Total</h3>
            <div class="detail-row">
              <span class="label">Total Amount:</span>
              <span class="value total">${{ selectedOrder.total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="details-section">
            <h3>Status Management</h3>
            <div class="status-buttons">
              <button 
                v-for="status in statusOptions" 
                :key="status.value"
                :class="['status-btn', { active: selectedOrder.status === status.value }]"
                @click="updateOrderStatus(status.value)"
              >
                {{ status.label }}
              </button>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="contactCustomer" class="btn-primary">📞 Contact Customer</button>
            <button @click="printOrder" class="btn-secondary">🖨️ Print Order</button>
            <button @click="selectedOrder = null" class="btn-secondary">Close</button>
          </div>
        </div>
      </div>

      <!-- Calendar Tab -->
      <transition name="fadeSlide">
        <section v-if="activeTab === 'calendar'" class="tab-content" key="calendar">
          <div class="section-header">
            <h2>📅 Delivery Schedule</h2>
            <p class="section-subtitle">View scheduled deliveries and manage dates</p>
          </div>
          <div class="calendar-container">
            <div class="calendar-header">
              <button @click="previousMonth" class="nav-btn">←</button>
              <h3>{{ monthYear }}</h3>
              <button @click="nextMonth" class="nav-btn">→</button>
            </div>
            <div class="calendar-grid">
              <div class="day-header">Sun</div>
              <div class="day-header">Mon</div>
              <div class="day-header">Tue</div>
              <div class="day-header">Wed</div>
              <div class="day-header">Thu</div>
              <div class="day-header">Fri</div>
              <div class="day-header">Sat</div>
              
              <div 
                v-for="day in calendarDays" 
                :key="day"
                :class="['calendar-day', { 
                  'other-month': day.month !== currentMonth,
                  'has-orders': day.orders > 0
                }]"
              >
                <div class="day-number">{{ day.date }}</div>
                <div v-if="day.orders > 0" class="day-orders">{{ day.orders }} orders</div>
              </div>
            </div>
          </div>
        </section>
      </transition>

      <!-- Products Tab -->
      <transition name="fadeSlide">
        <section v-if="activeTab === 'products'" class="tab-content" key="products">
          <div class="section-header">
            <h2>🎂 Manage Products</h2>
            <p class="section-subtitle">Create and manage your cake offerings</p>
          </div>
          
          <button @click="startAddingProduct" class="btn-primary add-btn">➕ Add New Cake</button>

          <div v-if="products.length === 0" class="empty-state">
            <p>No products yet. Create your first cake!</p>
          </div>

          <div v-else class="products-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="description">{{ product.description }}</p>
                <div class="price">${{ product.price.toFixed(2) }}</div>
                <div class="actions">
                  <button @click.stop="editProduct(product)" class="btn-edit">✏️ Edit</button>
                  <button @click.stop="deleteProduct(product.id)" class="btn-delete">🗑️ Delete</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Edit/Add Modal -->
          <div v-if="isEditingProduct && selectedProduct" class="modal-overlay" @click.self="cancelEditProduct">
            <div class="modal-content product-edit-modal">
              <button class="close-btn" @click="cancelEditProduct">✕</button>
              
              <h2>{{ selectedProduct.id ? 'Edit Cake' : 'Add New Cake' }}</h2>
              
              <div class="product-form">
                <div class="form-group">
                  <label>Cake Name</label>
                  <input v-model="selectedProduct.name" type="text" class="form-input" placeholder="e.g., Chocolate Delight">
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <textarea v-model="selectedProduct.description" class="form-input" rows="3" placeholder="Describe your cake..."></textarea>
                </div>

                <div class="form-group">
                  <label>Base Price ($)</label>
                  <input v-model.number="selectedProduct.price" type="number" class="form-input" placeholder="35" step="0.01">
                </div>

                <div class="form-group">
                  <label>Product Image</label>
                  <div class="image-upload-section">
                    <div class="upload-options">
                      <div class="upload-tab">
                        <h4>Upload Image</h4>
                        <input @change="handleImageUpload" type="file" accept="image/*" class="file-input">
                        <small>Supported: JPG, PNG, GIF (Max 5MB)</small>
                      </div>
                      <div class="upload-tab">
                        <h4>Or Use URL</h4>
                        <input v-model="selectedProduct.image" type="text" class="form-input" placeholder="https://images.unsplash.com/...">
                      </div>
                    </div>
                  </div>
                  <div v-if="selectedProduct.image" class="image-preview">
                    <img :src="selectedProduct.image" :alt="selectedProduct.name">
                  </div>
                </div>

                <div class="modal-actions">
                  <button @click="saveProduct" class="btn-primary">💾 Save</button>
                  <button @click="cancelEditProduct" class="btn-secondary">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </transition>

      <!-- Settings Tab -->
      <transition name="fadeSlide">
        <section v-if="activeTab === 'settings'" class="tab-content" key="settings">
          <div class="section-header">
            <h2>⚙️ Baker Settings</h2>
            <p class="section-subtitle">Manage your business profile and preferences</p>
          </div>
          <div class="settings-form">
            <div class="form-group">
              <label>Baker Name</label>
              <input v-model="bakerName" type="text" class="form-input" placeholder="Your Bakery Name">
            </div>
            <div class="form-group">
              <label>Business Email</label>
              <input v-model="bakerEmail" type="email" class="form-input" placeholder="baker@yourbakery.com">
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="bakerPhone" type="tel" class="form-input" placeholder="(555) 123-4567">
            </div>
            <div class="form-group">
              <label>Business Address</label>
              <textarea v-model="bakerAddress" class="form-input" rows="3" placeholder="123 Main St, Your City, State 12345"></textarea>
            </div>
            <div class="form-group">
              <label>Default Delivery Time</label>
              <input v-model="defaultDeliveryTime" type="time" class="form-input">
            </div>
            <button @click="saveSettings" class="btn-primary">💾 Save Settings</button>
          </div>
        </section>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeTab: 'dashboard',
      bakerName: 'Baker Admin',
      bakerEmail: 'baker@pastryparadise.com',
      bakerPhone: '(555) 123-4567',
      bakerAddress: '123 Baker Street, Your City',
      defaultDeliveryTime: '14:00',
      orders: [],
      products: [],
      selectedOrder: null,
      selectedProduct: null,
      isEditingProduct: false,
      searchQuery: '',
      filterStatus: '',
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      navItems: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'orders', icon: '📋', label: 'All Orders' },
        { id: 'products', icon: '🎂', label: 'Products' },
        { id: 'calendar', icon: '📅', label: 'Schedule' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
      ],
      statusOptions: [
        { value: 'pending', label: '⏳ Pending' },
        { value: 'in-progress', label: '👨‍🍳 In Progress' },
        { value: 'ready', label: '✅ Ready for Pickup' },
        { value: 'completed', label: '🎉 Completed' },
        { value: 'cancelled', label: '❌ Cancelled' }
      ]
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchSearch = order.customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           order.id.includes(this.searchQuery);
        const matchStatus = !this.filterStatus || order.status === this.filterStatus;
        return matchSearch && matchStatus;
      });
    },
    totalOrders() {
      return this.orders.length;
    },
    totalRevenue() {
      return this.orders.reduce((sum, order) => sum + order.total, 0);
    },
    pendingOrders() {
      return this.orders.filter(order => order.status === 'pending').length;
    },
    completedOrders() {
      return this.orders.filter(order => order.status === 'completed').length;
    },
    monthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[this.currentMonth]} ${this.currentYear}`;
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      
      const days = [];
      
      // Previous month days
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: prevMonthLastDay - i,
          month: this.currentMonth - 1,
          orders: 0
        });
      }
      
      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        const orderCount = this.orders.filter(order => {
          const deliveryDate = new Date(order.deliveryDate);
          return deliveryDate.getDate() === i &&
                 deliveryDate.getMonth() === this.currentMonth &&
                 deliveryDate.getFullYear() === this.currentYear;
        }).length;
        
        days.push({
          date: i,
          month: this.currentMonth,
          orders: orderCount
        });
      }
      
      // Next month days
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          month: this.currentMonth + 1,
          orders: 0
        });
      }
      
      return days;
    }
  },
  mounted() {
    this.loadOrders();
    this.loadProducts();
    this.loadSettings();
  },
  methods: {
    loadOrders() {
      const stored = localStorage.getItem('bakery-orders');
      this.orders = stored ? JSON.parse(stored) : this.getSampleOrders();
    },
    saveOrders() {
      localStorage.setItem('bakery-orders', JSON.stringify(this.orders));
    },
    loadSettings() {
      const settings = localStorage.getItem('baker-settings');
      if (settings) {
        Object.assign(this, JSON.parse(settings));
      }
    },
    saveSettings() {
      const settings = {
        bakerName: this.bakerName,
        bakerEmail: this.bakerEmail,
        bakerPhone: this.bakerPhone,
        bakerAddress: this.bakerAddress,
        defaultDeliveryTime: this.defaultDeliveryTime
      };
      localStorage.setItem('baker-settings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    },
    getSampleOrders() {
      return [
        {
          id: '001',
          customer: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 123-4567' },
          items: [{
            id: 1,
            name: 'Rich Chocolate Cake',
            price: 40,
            quantity: 1,
            customization: {
              size: '10 inch',
              flavor: 'Chocolate',
              color: 'Red',
              specialDetails: 'Happy Birthday Sarah with gold lettering'
            }
          }],
          total: 60,
          orderDate: new Date().toISOString(),
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: 'Please deliver before 5pm',
          status: 'pending'
        },
        {
          id: '002',
          customer: { name: 'Mike Turner', email: 'mike@example.com', phone: '(555) 234-5678' },
          items: [{
            id: 2,
            name: 'Classic Vanilla Cake',
            price: 35,
            quantity: 2,
            customization: {
              size: '8 inch',
              flavor: 'Vanilla',
              color: 'White',
              specialDetails: 'Wedding cake, two separate cakes'
            }
          }],
          total: 90,
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: '',
          status: 'in-progress'
        }
      ];
    },
    updateOrderStatus(newStatus) {
      if (this.selectedOrder) {
        const orderIndex = this.orders.findIndex(o => o.id === this.selectedOrder.id);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = newStatus;
          this.selectedOrder.status = newStatus;
          this.saveOrders();
        }
      }
    },
    formatStatus(status) {
      const statusMap = {
        'pending': '⏳ Pending',
        'in-progress': '👨‍🍳 In Progress',
        'ready': '✅ Ready for Pickup',
        'completed': '🎉 Completed',
        'cancelled': '❌ Cancelled'
      };
      return statusMap[status] || status;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatFullDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    contactCustomer() {
      const phone = this.selectedOrder.customer.phone.replace(/[^\d]/g, '');
      window.location.href = `tel:${phone}`;
    },
    printOrder() {
      window.print();
    },
    // Product Management Methods
    loadProducts() {
      const stored = localStorage.getItem('bakery-products');
      if (stored) {
        this.products = JSON.parse(stored);
      } else {
        this.products = this.getDefaultProducts();
        this.saveProducts();
      }
    },
    saveProducts() {
      localStorage.setItem('bakery-products', JSON.stringify(this.products));
    },
    getDefaultProducts() {
      return [
        {
          id: 1,
          name: 'Rich Chocolate Cake',
          description: 'Decadent chocolate cake with smooth chocolate ganache',
          price: 40,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'
        },
        {
          id: 2,
          name: 'Classic Vanilla Cake',
          description: 'Traditional vanilla cake with vanilla buttercream frosting',
          price: 35,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
        },
        {
          id: 3,
          name: 'Strawberry Delight',
          description: 'Fresh strawberry cake with whipped cream',
          price: 38,
          image: 'https://images.unsplash.com/photo-1540521097652-67a4a0c83fd5?w=400&h=400&fit=crop'
        },
        {
          id: 4,
          name: 'Red Velvet Dream',
          description: 'Elegant red velvet cake with cream cheese frosting',
          price: 45,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'
        }
      ];
    },
    startAddingProduct() {
      const nextId = Math.max(0, ...this.products.map(p => p.id)) + 1;
      this.selectedProduct = {
        id: nextId,
        name: '',
        description: '',
        price: 35,
        image: ''
      };
      this.isEditingProduct = true;
    },
    editProduct(product) {
      this.selectedProduct = { ...product };
      this.isEditingProduct = true;
    },
    saveProduct() {
      if (!this.selectedProduct.name || !this.selectedProduct.price) {
        alert('Please fill in all required fields');
        return;
      }

      const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
      if (index >= 0) {
        this.products.splice(index, 1, this.selectedProduct);
      } else {
        this.products.push(this.selectedProduct);
      }
      
      this.saveProducts();
      // Trigger a storage event to notify other components
      window.dispatchEvent(new Event('productsUpdated'));
      this.cancelEditProduct();
    },
    deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this cake?')) {
        this.products = this.products.filter(p => p.id !== productId);
        this.saveProducts();
        // Trigger a storage event to notify other components
        window.dispatchEvent(new Event('productsUpdated'));
      }
    },
    cancelEditProduct() {
      this.selectedProduct = null;
      this.isEditingProduct = false;
    },
    handleImageUpload(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedProduct.image = e.target?.result;
      };
      reader.readAsDataURL(file);
    },
    logout() {
      if (confirm('Are you sure you want to logout?')) {
        this.$emit('logout');
      }
    }
  }
}
</script>

<style scoped>
/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlide {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeSlide-enter-active,
.fadeSlide-leave-active {
  transition: opacity 0.3s ease;
}

.fadeSlide-enter-from,
.fadeSlide-leave-to {
  opacity: 0;
}

.admin-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 100%);
}

.admin-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff6b9d 100%);
  color: white;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(245, 87, 108, 0.15);
  position: relative;
  overflow: hidden;
}

.admin-sidebar::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
}

.admin-header {
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 2.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.admin-header h1 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.baker-name {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  opacity: 0.95;
  font-weight: 500;
}

.admin-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.nav-item {
  background: none;
  border: none;
  color: white;
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-left: 4px solid transparent;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.nav-icon {
  font-size: 1.3rem;
}

.nav-label {
  flex: 1;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  border-left-color: white;
  box-shadow: inset -2px 0 8px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 2.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 100%);
}

.tab-content {
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.08);
  border: 1px solid rgba(240, 147, 251, 0.1);
  animation: slideInUp 0.6s ease-out;
}

.section-header {
  margin-bottom: 2.5rem;
}

.section-header h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.section-subtitle {
  margin: 0.5rem 0 0 0;
  color: #999;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Dashboard Stats */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  animation: slideInUp 0.6s ease-out;
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.15);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(245, 87, 108, 0.2);
}

.stat-icon {
  font-size: 2.5rem;
  min-width: 3rem;
  text-align: center;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.95;
  margin: 0.5rem 0 0 0;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Orders Controls */
.orders-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
}

/* Orders List */
.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out;
  position: relative;
  overflow: hidden;
}

.order-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  transition: width 0.3s ease;
}

.order-card:hover {
  border-color: #f093fb;
  box-shadow: 0 8px 24px rgba(240, 147, 251, 0.12);
  transform: translateY(-4px);
}

.order-card:hover::before {
  width: 100%;
  opacity: 0.05;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.order-number {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 1rem;
}

.order-status {
  font-size: 0.75rem;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.order-status.pending {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe0b2 100%);
  color: #e65100;
}

.order-status.completed {
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
  color: #2e7d32;
}

.order-status.cancelled {
  background: linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%);
  color: #c62828;
}

.order-customer {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.order-customer strong {
  display: block;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.customer-contact {
  font-size: 0.8rem;
  color: #777;
  display: block;
  line-height: 1.3;
}

.order-items {
  margin: 1rem 0;
  max-height: 120px;
  overflow-y: auto;
}

.order-item-preview {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 100%);
  padding: 0.5rem 0.75rem;
  border-left: 3px solid #f093fb;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
}

.order-date {
  color: #777;
  font-size: 0.85rem;
  font-weight: 500;
}

.order-total {
  font-weight: 700;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: slideInUp 0.4s ease-out;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 100%);
  border: 2px solid #e0e0e0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.close-btn:hover {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: transparent;
  transform: rotate(90deg);
}

.order-details-modal h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  font-weight: 700;
}

.details-section {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 100%);
  border-radius: 10px;
  border-left: 4px solid #f093fb;
}

.details-section h3 {
  margin: 0 0 1rem 0;
  color: #1a1a1a;
  font-weight: 600;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.value.total {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.3rem;
  font-weight: 700;
}

.cake-details {
  background: white;
  padding: 1.25rem;
  border-left: 4px solid #f093fb;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cake-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.cake-header strong {
  color: #1a1a1a;
  font-size: 1rem;
}

.qty {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
}

.cake-custom {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 0.75rem 0;
}

.cake-custom p {
  margin: 0;
  font-size: 0.85rem;
  color: #555;
}

.cake-custom strong {
  color: #1a1a1a;
}

.cake-special {
  background: linear-gradient(135deg, #fff9c4 0%, #fff8e1 100%);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid #fbc02d;
}

.cake-special strong {
  color: #e65100;
}

.cake-special p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #333;
}

.cake-price {
  text-align: right;
  font-weight: 700;
  color: #f5576c;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.status-btn {
  padding: 0.75rem 1.25rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #666;
}

.status-btn:hover {
  border-color: #f093fb;
  background: #faf5ff;
  color: #f5576c;
}

.status-btn.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  border-top: 2px solid #f0f0f0;
  padding-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.85rem;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border-color: #ddd;
}

.btn-secondary:hover {
  background: #e8e8e8;
  border-color: #999;
}

/* Calendar */
.calendar-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
}

.day-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  border-radius: 8px;
  font-size: 0.9rem;
}

.calendar-day {
  aspect-ratio: 1;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  font-size: 0.85rem;
}

.calendar-day:hover {
  border-color: #f093fb;
  background: #faf5ff;
  transform: translateY(-2px);
}

.calendar-day.other-month {
  opacity: 0.4;
}

.calendar-day.has-orders {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f4ff 100%);
  border-color: #2196f3;
}

.day-number {
  font-weight: 700;
  color: #333;
  font-size: 0.95rem;
}

.day-orders {
  font-size: 0.7rem;
  color: #2196f3;
  font-weight: bold;
}

/* Settings & Forms */
.settings-form {
  max-width: 600px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.65rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
}

/* Products Grid */
.add-btn {
  margin-bottom: 1.5rem;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.3);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  border-color: #f093fb;
  box-shadow: 0 12px 32px rgba(240, 147, 251, 0.15);
  transform: translateY(-6px);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 100%);
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 700;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin: 0.75rem 0;
  line-height: 1.5;
}

.price {
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0.75rem 0;
}

.product-info .actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.65rem;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

/* Product Edit Modal */
.product-edit-modal {
  max-width: 650px;
}

.product-form {
  margin: 1.5rem 0;
}

.product-form .form-group {
  margin-bottom: 1.25rem;
}

.image-preview {
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  max-width: 100%;
}

.image-preview img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
}

.image-upload-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f5 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 2px dashed #f093fb;
}

.upload-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.upload-tab {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.upload-tab h4 {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
  font-weight: 700;
}

.file-input {
  padding: 0.85rem;
  border: 2px dashed #f093fb;
  border-radius: 8px;
  cursor: pointer;
  background: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.file-input:hover {
  border-color: #f5576c;
  background: #faf5ff;
}

.upload-tab small {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 220px;
  }

  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    padding: 1rem 0;
    flex-direction: row;
    align-items: center;
  }

  .admin-header {
    flex: 1;
    padding: 1rem;
    margin-bottom: 0;
    border-bottom: none;
    border-right: 2px solid rgba(255, 255, 255, 0.2);
  }

  .admin-nav {
    flex-direction: row;
    flex: 1;
    padding: 0 1rem;
    gap: 0;
  }

  .nav-item {
    border-left: none;
    border-bottom: 4px solid transparent;
    border-radius: 0;
    padding: 1rem;
    white-space: nowrap;
    overflow-x: auto;
  }

  .nav-item.active {
    border-left: none;
    border-bottom-color: white;
  }

  .logout-btn {
    margin: 0 1rem;
  }

  .admin-content {
    padding: 1.5rem;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .dashboard-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .orders-list {
    grid-template-columns: 1fr;
  }

  .calendar-grid {
    gap: 0.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .upload-options {
    grid-template-columns: 1fr;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .admin-sidebar {
    flex-direction: column;
    padding: 1rem 0;
  }

  .admin-header {
    border-right: none;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    width: 100%;
    padding: 1rem;
    margin-bottom: 0.5rem;
  }

  .logo-section {
    width: 100%;
  }

  .admin-nav {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    padding: 0;
  }

  .nav-item {
    padding: 0.75rem;
    font-size: 0.8rem;
    gap: 0.3rem;
  }

  .nav-label {
    display: none;
  }

  .nav-icon {
    font-size: 1rem;
  }

  .logout-btn {
    margin: 0.5rem;
  }

  .admin-content {
    padding: 1rem;
  }

  .tab-content {
    padding: 1rem;
    border-radius: 12px;
  }

  .dashboard-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .stat-icon {
    min-width: 2.5rem;
    font-size: 2rem;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .modal-content {
    max-width: 90vw;
    max-height: 95vh;
    padding: 1.5rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 150px;
  }

  .calendar-day {
    padding: 0.4rem;
    font-size: 0.7rem;
  }

  .day-header {
    padding: 0.5rem;
    font-size: 0.7rem;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media print {
  .admin-sidebar,
  .logout-btn,
  .modal-actions,
  .orders-controls,
  .add-btn,
  .product-info .actions {
    display: none !important;
  }

  .modal-content {
    position: static;
    box-shadow: none;
    max-height: 100%;
    background: white;
  }

  .admin-content {
    padding: 0;
  }

  .tab-content {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
