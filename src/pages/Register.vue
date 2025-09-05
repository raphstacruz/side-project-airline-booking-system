<template>
  <div class="register-page">
    <div class="container">
      <div class="register-container">
        <!-- Register Form -->
        <div class="register-form-section">
          <div class="form-header">
            <h1>Create Account</h1>
            <p>Join AirBook and start booking your flights</p>
          </div>

          <!-- Register Form -->
          <form @submit.prevent="handleRegister" class="register-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  v-model="registerForm.firstName"
                  placeholder="Enter your first name"
                  class="form-control"
                  required
                  :class="{ 'is-invalid': errors.firstName }"
                >
                <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="registerForm.lastName"
                  placeholder="Enter your last name"
                  class="form-control"
                  required
                  :class="{ 'is-invalid': errors.lastName }"
                >
                <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="registerForm.email"
                placeholder="Enter your email"
                class="form-control"
                required
                :class="{ 'is-invalid': errors.email }"
              >
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                v-model="registerForm.phone"
                placeholder="Enter your phone number"
                class="form-control"
                required
                :class="{ 'is-invalid': errors.phone }"
              >
              <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="input-with-icon">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="registerForm.password"
                  placeholder="Create a password"
                  class="form-control"
                  required
                  :class="{ 'is-invalid': errors.password }"
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
              <small class="form-help">Password must be at least 8 characters long</small>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                placeholder="Confirm your password"
                class="form-control"
                required
                :class="{ 'is-invalid': errors.confirmPassword }"
              >
              <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="registerForm.agreeToTerms"
                  required
                >
                I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a>
              </label>
              <div v-if="errors.agreeToTerms" class="error-message">{{ errors.agreeToTerms }}</div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="registerForm.subscribeNewsletter"
                >
                Subscribe to our newsletter for flight deals and travel tips
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary register-btn"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner small"></span>
              <span v-else>Create Account</span>
            </button>
          </form>

          <!-- Social Register -->
          <div class="social-register">
            <div class="divider">
              <span>or continue with</span>
            </div>
            <div class="social-buttons">
              <button @click="registerWithGoogle" class="btn btn-outline social-btn">
                <span class="social-icon">🌐</span>
                Google
              </button>
              <button @click="registerWithFacebook" class="btn btn-outline social-btn">
                <span class="social-icon">📘</span>
                Facebook
              </button>
            </div>
          </div>

          <!-- Sign In Link -->
          <div class="signin-link">
            <p>Already have an account?
              <router-link to="/login" class="signin-link-text">Sign in</router-link>
            </p>
          </div>
        </div>

        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h2>Welcome to AirBook</h2>
            <p>Create your account and unlock exclusive benefits</p>

            <div class="benefits-list">
              <div class="benefit-item">
                <span class="benefit-icon">✈️</span>
                <span>Book flights worldwide</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">💺</span>
                <span>Choose preferred seats</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎫</span>
                <span>Manage all bookings</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🔔</span>
                <span>Flight status updates</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">🎁</span>
                <span>Exclusive member deals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      showPassword: false,
      loading: false,
      registerForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        subscribeNewsletter: false
      },
      errors: {}
    }
  },
  methods: {
    validateForm() {
      this.errors = {}

      // Name validation
      if (this.registerForm.firstName.length < 2) {
        this.errors.firstName = 'First name must be at least 2 characters'
      }
      if (this.registerForm.lastName.length < 2) {
        this.errors.lastName = 'Last name must be at least 2 characters'
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.registerForm.email)) {
        this.errors.email = 'Please enter a valid email address'
      }

      // Phone validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(this.registerForm.phone.replace(/[\s\-\(\)]/g, ''))) {
        this.errors.phone = 'Please enter a valid phone number'
      }

      // Password validation
      if (this.registerForm.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long'
      }

      // Confirm password validation
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
      }

      // Terms validation
      if (!this.registerForm.agreeToTerms) {
        this.errors.agreeToTerms = 'You must agree to the terms and conditions'
      }

      return Object.keys(this.errors).length === 0
    },

    async handleRegister() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock successful registration
        alert('Account created successfully! Welcome to AirBook!')
        this.$router.push('/login')
      } catch (error) {
        console.error('Registration error:', error)
        alert('Registration failed. Please try again.')
      } finally {
        this.loading = false
      }
    },

    registerWithGoogle() {
      // Handle Google OAuth
      console.log('Google register clicked')
      alert('Google registration integration coming soon!')
    },

    registerWithFacebook() {
      // Handle Facebook OAuth
      console.log('Facebook register clicked')
      alert('Facebook registration integration coming soon!')
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, #0056b3 100%);
  padding: 2rem 0;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
}

.register-form-section {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 2rem;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--gray-600);
}

.register-form {
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.form-control {
  padding: 0.875rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
  outline: none;
}

.form-control.is-invalid {
  border-color: var(--danger-color);
}

.input-with-icon {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  color: var(--gray-500);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-help {
  color: var(--gray-600);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--gray-700);
  line-height: 1.4;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.small.spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

/* Social Register */
.social-register {
  margin: 2rem 0;
}

.divider {
  text-align: center;
  position: relative;
  margin: 2rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-300);
}

.divider span {
  background: var(--white);
  padding: 0 1rem;
  color: var(--gray-600);
  font-size: 0.875rem;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
}

.social-icon {
  font-size: 1.125rem;
}

/* Sign In Link */
.signin-link {
  text-align: center;
  margin-top: 2rem;
}

.signin-link-text {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
}

.signin-link-text:hover {
  text-decoration: underline;
}

/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, #0056b3 100%);
  color: var(--white);
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
}

.welcome-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.welcome-content p {
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.benefit-icon {
  font-size: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .register-container {
    grid-template-columns: 1fr;
  }

  .register-form-section,
  .welcome-section {
    padding: 2rem 1.5rem;
  }

  .welcome-section {
    order: -1;
  }

  .form-header h1 {
    font-size: 1.75rem;
  }

  .welcome-content h2 {
    font-size: 1.75rem;
  }

  .social-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .register-page {
    padding: 1rem 0;
  }

  .register-form-section,
  .welcome-section {
    padding: 1.5rem 1rem;
  }

  .form-header h1 {
    font-size: 1.5rem;
  }

  .welcome-content h2 {
    font-size: 1.5rem;
  }

  .register-btn {
    padding: 0.875rem;
    font-size: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
