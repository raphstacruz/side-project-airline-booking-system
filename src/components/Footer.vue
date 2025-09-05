<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Main Footer Content -->
        <div class="footer-main">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-icon">✈️</span>
              <span class="logo-text">AirBook</span>
            </div>
            <p class="footer-description">
              Your trusted partner for flight bookings worldwide. Safe, reliable, and affordable air travel.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">📘</a>
              <a href="#" class="social-link" aria-label="Twitter">🐦</a>
              <a href="#" class="social-link" aria-label="Instagram">📷</a>
              <a href="#" class="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-section">
              <h4>Company</h4>
              <ul>
                <li><router-link to="/about">About Us</router-link></li>
                <li><router-link to="/careers">Careers</router-link></li>
                <li><router-link to="/press">Press</router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Support</h4>
              <ul>
                <li><router-link to="/help">Help Center</router-link></li>
                <li><router-link to="/booking-support">Booking Support</router-link></li>
                <li><router-link to="/refund">Refunds</router-link></li>
                <li><router-link to="/faq">FAQ</router-link></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><router-link to="/privacy">Privacy Policy</router-link></li>
                <li><router-link to="/terms">Terms of Service</router-link></li>
                <li><router-link to="/cookies">Cookie Policy</router-link></li>
                <li><router-link to="/accessibility">Accessibility</router-link></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Services</h4>
              <ul>
                <li><router-link to="/flights">Flight Search</router-link></li>
                <li><router-link to="/hotels">Hotel Booking</router-link></li>
                <li><router-link to="/cars">Car Rental</router-link></li>
                <li><router-link to="/packages">Travel Packages</router-link></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Newsletter Signup -->
        <div class="newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to our newsletter for the latest deals and travel tips</p>
          <form @submit.prevent="handleNewsletterSignup" class="newsletter-form">
            <div class="input-group">
              <input
                type="email"
                v-model="newsletterEmail"
                placeholder="Enter your email"
                class="newsletter-input"
                required
              >
              <button type="submit" class="btn btn-primary newsletter-btn" :disabled="newsletterLoading">
                {{ newsletterLoading ? 'Subscribing...' : 'Subscribe' }}
              </button>
            </div>
          </form>
          <p v-if="newsletterSuccess" class="newsletter-success">
            ✅ Thanks for subscribing! Check your email for confirmation.
          </p>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="copyright">
              © {{ currentYear }} AirBook. All rights reserved.
            </p>
            <div class="footer-badges">
              <span class="badge">🔒 SSL Secured</span>
              <span class="badge">🛡️ Verified</span>
              <span class="badge">⭐ 4.8/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      newsletterEmail: '',
      newsletterLoading: false,
      newsletterSuccess: false,
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    async handleNewsletterSignup() {
      if (!this.newsletterEmail) return

      this.newsletterLoading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.newsletterSuccess = true
        this.newsletterEmail = ''
        setTimeout(() => {
          this.newsletterSuccess = false
        }, 5000)
      } catch (error) {
        console.error('Newsletter signup error:', error)
      } finally {
        this.newsletterLoading = false
      }
    }
  }
}
</script>

<style scoped>
.footer {
  background: var(--gray-900);
  color: var(--white);
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 2rem;
}

.footer-description {
  color: var(--gray-400);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-800);
  border-radius: 50%;
  color: var(--white);
  text-decoration: none;
  transition: var(--transition);
  font-size: 1.25rem;
}

.social-link:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  color: var(--white);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--gray-400);
  text-decoration: none;
  transition: var(--transition);
  font-size: 0.875rem;
}

.footer-section a:hover {
  color: var(--primary-color);
}

.newsletter {
  background: var(--gray-800);
  padding: 2rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  text-align: center;
}

.newsletter h4 {
  color: var(--white);
  margin-bottom: 0.5rem;
}

.newsletter p {
  color: var(--gray-400);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.newsletter-form {
  max-width: 400px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-600);
  border-radius: var(--border-radius);
  background: var(--gray-700);
  color: var(--white);
  font-size: 0.875rem;
}

.newsletter-input::placeholder {
  color: var(--gray-500);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.newsletter-btn {
  padding: 0.75rem 1.5rem;
  white-space: nowrap;
}

.newsletter-success {
  margin-top: 1rem;
  color: var(--success-color);
  font-size: 0.875rem;
}

.footer-bottom {
  border-top: 1px solid var(--gray-800);
  padding-top: 1.5rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: var(--gray-500);
  font-size: 0.875rem;
  margin: 0;
}

.footer-badges {
  display: flex;
  gap: 1rem;
}

.badge {
  background: var(--gray-800);
  color: var(--gray-400);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-brand {
    max-width: none;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .newsletter {
    padding: 1.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .newsletter-btn {
    width: 100%;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-badges {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-main {
    gap: 1.5rem;
  }

  .newsletter {
    padding: 1rem;
  }

  .social-links {
    gap: 0.5rem;
  }

  .social-link {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style>
