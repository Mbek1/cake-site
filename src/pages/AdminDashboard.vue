<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <div class="admin-header">
        <h1>🍰 Baker Admin</h1>
        <p class="baker-name">{{ bakerName }}</p>
      </div>
      <nav class="admin-nav">
        <button 
          v-for="item in navItems" 
          :key="item.id"
          :class="['nav-item', { active: activeTab === item.id }]"
          @click="activeTab = item.id"
        >
          {{ item.icon }} {{ item.label }}
        </button>
      </nav>
      <button @click="logout" class="logout-btn">🚪 Logout</button>
    </div>

    <div class="admin-content">
      <!-- Dashboard Tab -->
      <section v-if="activeTab === 'dashboard'" class="tab-content">
        <h2>📊 Dashboard</h2>
        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-number">{{ totalOrders }}</div>
            <div class="stat-label">Total Orders</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${{ totalRevenue.toFixed(2) }}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ pendingOrders }}</div>
            <div class="stat-label">Pending Orders</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ completedOrders }}</div>
            <div class="stat-label">Completed Orders</div>
          </div>
        </div>
      </section>

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
      <section v-if="activeTab === 'calendar'" class="tab-content">
        <h2>📅 Delivery Schedule</h2>
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

      <!-- Products Tab -->
      <section v-if="activeTab === 'products'" class="tab-content">
        <h2>🎂 Manage Products</h2>
        
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

      <!-- Settings Tab -->
      <section v-if="activeTab === 'settings'" class="tab-content">
        <h2>⚙️ Baker Settings</h2>
        <div class="settings-form">
          <div class="form-group">
            <label>Baker Name</label>
            <input v-model="bakerName" type="text" class="form-input">
          </div>
          <div class="form-group">
            <label>Business Email</label>
            <input v-model="bakerEmail" type="email" class="form-input">
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="bakerPhone" type="tel" class="form-input">
          </div>
          <div class="form-group">
            <label>Business Address</label>
            <textarea v-model="bakerAddress" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Default Delivery Time</label>
            <input v-model="defaultDeliveryTime" type="time" class="form-input">
          </div>
          <button @click="saveSettings" class="btn-primary">💾 Save Settings</button>
        </div>
      </section>
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
.admin-container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

.admin-sidebar {
  width: 250px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-header {
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 1rem;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.baker-name {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.admin-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nav-item {
  background: none;
  border: none;
  color: white;
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  border-left-color: white;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.tab-content {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.8rem;
}

/* Dashboard Stats */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Orders List */
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input, .filter-select {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
}

.search-input {
  flex: 1;
}

.search-input:focus, .filter-select:focus {
  outline: none;
  border-color: #f093fb;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: #f093fb;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.2);
  transform: translateY(-2px);
}

.order-card.pending {
  border-left: 4px solid #ff9800;
}

.order-card.in-progress {
  border-left: 4px solid #2196f3;
}

.order-card.ready {
  border-left: 4px solid #4caf50;
}

.order-card.completed {
  border-left: 4px solid #9c27b0;
}

.order-card.cancelled {
  border-left: 4px solid #f44336;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.75rem;
}

.order-id {
  font-weight: bold;
  color: #333;
}

.order-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: bold;
}

.order-status.pending {
  background: #ffe0b2;
  color: #e65100;
}

.order-status.in-progress {
  background: #bbdefb;
  color: #1565c0;
}

.order-status.ready {
  background: #c8e6c9;
  color: #2e7d32;
}

.order-status.completed {
  background: #e1bee7;
  color: #6a1b9a;
}

.order-status.cancelled {
  background: #ffcdd2;
  color: #c62828;
}

.order-customer {
  margin-bottom: 1rem;
}

.order-customer strong {
  display: block;
  color: #333;
  margin-bottom: 0.3rem;
}

.customer-contact {
  font-size: 0.85rem;
  color: #666;
  display: block;
}

.order-items {
  margin: 1rem 0;
}

.order-item-preview {
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid #f0f0f0;
  padding-top: 0.75rem;
  font-size: 0.9rem;
}

.order-date {
  color: #666;
}

.order-total {
  font-weight: bold;
  color: #f5576c;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

/* Modal */
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
  border-radius: 10px;
  padding: 2rem;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f0f0f0;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5576c;
  color: white;
}

.order-details-modal h2 {
  margin-top: 1rem;
}

.details-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.details-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  color: #333;
}

.value.total {
  color: #f5576c;
  font-size: 1.2rem;
  font-weight: bold;
}

.cake-details {
  background: white;
  padding: 1rem;
  border-left: 4px solid #f093fb;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.cake-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.qty {
  background: #f093fb;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.cake-custom {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.cake-custom p {
  margin: 0;
  font-size: 0.85rem;
}

.cake-special {
  background: #fff3cd;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.cake-special p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.cake-price {
  text-align: right;
  font-weight: bold;
  color: #f5576c;
}

.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.status-btn:hover {
  border-color: #f093fb;
  background: #f9f9f9;
}

.status-btn.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: transparent;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 2px solid #e0e0e0;
  padding-top: 1.5rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Calendar */
.calendar-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-btn {
  background: #f093fb;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #f5576c;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day-header {
  background: #f093fb;
  color: white;
  padding: 0.75rem;
  text-align: center;
  font-weight: bold;
  border-radius: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  border-color: #f093fb;
  background: #f9f9f9;
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.has-orders {
  background: #e3f2fd;
  border-color: #2196f3;
}

.day-number {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
}

.day-orders {
  font-size: 0.75rem;
  color: #2196f3;
  font-weight: bold;
}

/* Settings */
.settings-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #f093fb;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    padding: 1rem;
  }

  .admin-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-item {
    padding: 0.75rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .calendar-grid {
    gap: 0.25rem;
  }

  .orders-list {
    grid-template-columns: 1fr;
  }
}

@media print {
  .admin-sidebar,
/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: #f093fb;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.2);
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #f5576c;
  margin: 0.75rem 0;
}

.product-info .actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #2196f3;
  color: white;
}

.btn-edit:hover {
  background: #1976d2;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #da190b;
}

.add-btn {
  margin-bottom: 1.5rem;
}

/* Product Edit Modal */
.product-edit-modal {
  max-width: 600px;
}

.product-form {
  margin: 1.5rem 0;
}

.product-form .form-group {
  margin-bottom: 1rem;
}

.image-preview {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.image-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.image-upload-section {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
}

.upload-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.upload-tab {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-tab h4 {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
}

.file-input {
  padding: 0.5rem;
  border: 2px dashed #f093fb;
  border-radius: 5px;
  cursor: pointer;
  background: white;
}

.file-input:hover {
  border-color: #f5576c;
  background: #f9f9f9;
}

.upload-tab small {
  color: #666;
  font-size: 0.8rem;
}

  .modal-actions,
  .filter-bar {
    display: none;
  }

  .modal-content {
    position: static;
    box-shadow: none;
    max-height: 100%;
  }
}
</style>
