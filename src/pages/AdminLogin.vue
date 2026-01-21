<template>
  <div class="login-container">
    <div class="login-background">
      <div class="floating-element element-1">🍰</div>
      <div class="floating-element element-2">🎂</div>
      <div class="floating-element element-3">🧁</div>
    </div>

    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🍰</div>
        <h1>Baker Admin</h1>
        <p class="subtitle">Access your dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" v-if="!isLoggedIn">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            placeholder="baker"
            class="form-input"
            autocomplete="username"
          >
          <small v-if="errors.username" class="error">{{ errors.username }}</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="••••••••••"
            class="form-input"
            autocomplete="current-password"
          >
          <small v-if="errors.password" class="error">{{ errors.password }}</small>
        </div>

        <div v-if="loginError" class="error-message">
          ⚠️ {{ loginError }}
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="isLoading">⏳ Logging in...</span>
          <span v-else>🔓 Login</span>
        </button>

        <div class="demo-info">
          <p class="demo-label">Demo Credentials</p>
          <div class="demo-row">
            <span class="demo-key">Username:</span>
            <code>baker</code>
          </div>
          <div class="demo-row">
            <span class="demo-key">Password:</span>
            <code>password123</code>
          </div>
        </div>
      </form>

      <div v-else class="logged-in">
        <div class="success-icon">✅</div>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      isLoggedIn: false,
      loginError: '',
      errors: {}
    }
  },
  methods: {
    validateForm() {
      this.errors = {};
      
      if (!this.username) {
        this.errors.username = 'Username is required';
      }
      if (!this.password) {
        this.errors.password = 'Password is required';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    handleLogin() {
      this.loginError = '';
      
      if (!this.validateForm()) {
        return;
      }
      
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        // Demo credentials
        if (this.username === 'baker' && this.password === 'password123') {
          localStorage.setItem('admin-logged-in', 'true');
          localStorage.setItem('admin-username', this.username);
          this.isLoggedIn = true;
          this.$emit('login-success', this.username);
          setTimeout(() => {
            this.$router?.push('/admin') || this.$emit('admin-access');
          }, 1500);
        } else {
          this.loginError = 'Invalid username or password. Try baker / password123';
        }
        this.isLoading = false;
      }, 1000);
    }
  },
  mounted() {
    // Check if already logged in
    if (localStorage.getItem('admin-logged-in')) {
      this.$router?.push('/admin') || this.$emit('admin-access');
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff6b9d 100%);
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.floating-element {
  position: absolute;
  font-size: 4rem;
  opacity: 0.08;
  animation: float 8s ease-in-out infinite;
}

.element-1 {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
  animation-duration: 8s;
}

.element-2 {
  top: 60%;
  right: 5%;
  animation-delay: 2s;
  animation-duration: 10s;
}

.element-3 {
  bottom: 20%;
  left: 15%;
  animation-delay: 4s;
  animation-duration: 9s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 3.5rem 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  animation: slideInUp 0.8s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.logo-icon {
  font-size: 3.5rem;
  display: inline-block;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: slideInUp 0.8s ease-out 0.3s both;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.form-input {
  padding: 0.9rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:hover {
  border-color: #f093fb;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
  background: white;
}

.error {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.2rem;
  font-weight: 500;
}

.error-message {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  border-left: 4px solid #f44336;
  animation: slideInUp 0.3s ease-out;
}

.btn-login {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 0.5rem;
  box-shadow: 0 10px 25px rgba(245, 87, 108, 0.2);
  letter-spacing: 0.5px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(245, 87, 108, 0.35);
}

.btn-login:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.demo-info {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%);
  border: 2px solid rgba(240, 147, 251, 0.2);
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #333;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.demo-label {
  margin: 0 0 0.8rem 0;
  font-weight: 700;
  color: #f5576c;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.demo-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
  font-size: 0.85rem;
}

.demo-key {
  font-weight: 600;
  color: #666;
}

.demo-info code {
  background: white;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  color: #f5576c;
  font-weight: 700;
  border: 1px solid rgba(245, 87, 108, 0.2);
}

.logged-in {
  text-align: center;
  animation: slideInUp 0.6s ease-out;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 0.8s ease-out;
}

.logged-in p {
  color: #4caf50;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2.5rem 1.5rem;
    border-radius: 15px;
  }

  h1 {
    font-size: 1.7rem;
  }

  .logo-icon {
    font-size: 2.8rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .form-input {
    padding: 0.8rem 0.9rem;
    font-size: 1rem;
  }

  .btn-login {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }
}
</style>
