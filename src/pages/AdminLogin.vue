<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🍰 Baker Admin Login</h1>
      <p class="subtitle">Access your bakery management dashboard</p>

      <form @submit.prevent="handleLogin" v-if="!isLoggedIn">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            placeholder="Enter your username"
            class="form-input"
          >
          <small v-if="errors.username" class="error">{{ errors.username }}</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="Enter your password"
            class="form-input"
          >
          <small v-if="errors.password" class="error">{{ errors.password }}</small>
        </div>

        <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? '⏳ Logging in...' : '🔓 Login' }}
        </button>

        <div class="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: <code>baker</code></p>
          <p>Password: <code>password123</code></p>
        </div>
      </form>

      <div v-else class="logged-in">
        <p>✅ Redirecting to dashboard...</p>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: white;
  border-radius: 15px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.8rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 5px;
  font-size: 0.9rem;
  border-left: 4px solid #f44336;
}

.btn-login {
  padding: 0.85rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.demo-info {
  background: #f0f4ff;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #333;
  border-left: 4px solid #667eea;
}

.demo-info p {
  margin: 0.3rem 0;
}

.demo-info code {
  background: white;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #667eea;
  font-weight: bold;
}

.logged-in {
  text-align: center;
  color: #4caf50;
  font-size: 1.1rem;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
