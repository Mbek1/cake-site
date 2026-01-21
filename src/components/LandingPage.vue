<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="logo-container">
          <div class="logo-animated">
            <span class="logo-emoji">🍰</span>
          </div>
        </div>
        <h1 class="hero-title">Mum's Cakes</h1>
        <p class="hero-subtitle">Handcrafted with Love, Baked with Care</p>
        <p class="hero-description">Custom cakes designed just for your special moments</p>
        <button @click="scrollToCatalogue" class="cta-button">
          Start Building Your Cake
          <span class="arrow">→</span>
        </button>
      </div>
      <div class="hero-background">
        <div class="floating-cake cake-1">🎂</div>
        <div class="floating-cake cake-2">🧁</div>
        <div class="floating-cake cake-3">🍰</div>
        <div class="floating-cake cake-4">✨</div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2>Why Choose Mum's Cakes?</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="about-content">
        <h2>About Mum's Cakes</h2>
        <p>
          At Mum's Cakes, we believe every celebration deserves something special. 
          With years of baking experience and a passion for creating unforgettable moments, 
          we craft custom cakes that are as beautiful as they are delicious.
        </p>
        <p>
          From birthdays to weddings, anniversaries to corporate events – 
          we bring your cake dreams to life!
        </p>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Ready to Order Your Perfect Cake?</h2>
      <button @click="scrollToCatalogue" class="cta-button-large">
        Design Your Cake Now
      </button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      features: [
        {
          icon: '🎨',
          title: 'Custom Design',
          description: 'Fully customizable cakes with your choice of size, flavor, color, and special details'
        },
        {
          icon: '🥘',
          title: 'Fresh Ingredients',
          description: 'Made with premium, fresh ingredients for the best taste and quality'
        },
        {
          icon: '⚡',
          title: 'Quick Orders',
          description: 'Easy online ordering process with fast turnaround times'
        },
        {
          icon: '❤️',
          title: 'Made with Love',
          description: 'Every cake is baked with care and attention to detail'
        }
      ]
    }
  },
  methods: {
    scrollToCatalogue() {
      this.$emit('scroll-to-catalogue');
    }
  }
}
</script>

<style scoped>
.landing-page {
  width: 100%;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Hero Section */
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff6b9d 100%);
  color: white;
  overflow: hidden;
  z-index: 1;
}

.hero-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  animation: slideUp 1s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logo-container {
  margin-bottom: 2rem;
  perspective: 1000px;
}

.logo-animated {
  font-size: 120px;
  display: inline-block;
  animation: float 3s ease-in-out infinite, spin 20s linear infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

@keyframes spin {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

.logo-emoji {
  display: inline-block;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: slideDown 1s ease-out 0.2s both;
  letter-spacing: 2px;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.hero-subtitle {
  font-size: 1.8rem;
  margin: 0.5rem 0;
  opacity: 0.95;
  animation: fadeInDelay 1s ease-out 0.4s both;
  font-weight: 300;
}

.hero-description {
  font-size: 1.2rem;
  margin: 1rem 0 2rem 0;
  opacity: 0.9;
  animation: fadeInDelay 1s ease-out 0.6s both;
}

@keyframes fadeInDelay {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-button {
  background: white;
  color: #f5576c;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  animation: bounceIn 1s ease-out 0.8s both;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.cta-button:active {
  transform: translateY(-1px);
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow {
  transform: translateX(5px);
}

/* Floating Elements */
.floating-cake {
  position: absolute;
  font-size: 3rem;
  opacity: 0.15;
  animation: float 6s ease-in-out infinite;
}

.cake-1 {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
  animation-duration: 8s;
}

.cake-2 {
  top: 60%;
  right: 5%;
  animation-delay: 2s;
  animation-duration: 10s;
}

.cake-3 {
  top: 30%;
  right: 15%;
  animation-delay: 1s;
  animation-duration: 7s;
}

.cake-4 {
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
  animation-duration: 9s;
}

/* Features Section */
.features {
  padding: 6rem 2rem;
  background: #f8f9fa;
}

.features h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  animation: fadeIn 0.8s ease-out;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  animation: scaleIn 0.6s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(245, 87, 108, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.2) rotate(10deg);
}

.feature-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #f5576c;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* About Section */
.about {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

.about-content p {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.8s ease-out;
}

/* CTA Section */
.cta-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: white;
}

.cta-button-large {
  background: white;
  color: #f5576c;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cta-button-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    height: 70vh;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .logo-animated {
    font-size: 80px;
  }

  .features h2, .about-content h2, .cta-section h2 {
    font-size: 1.8rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .cta-button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
}
</style>
