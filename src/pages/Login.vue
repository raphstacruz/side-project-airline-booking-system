<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-primary py-4">
    <div class="container">
      <div class="row g-0 bg-white rounded shadow-lg overflow-hidden" style="max-width: 1000px;">
        <!-- Login Form -->
        <div class="col-lg-6 p-4 p-md-5 d-flex flex-column">
          <div class="text-center mb-4">
            <h1 class="h2 fw-bold text-dark mb-2">Welcome Back</h1>
            <p class="text-muted">Sign in to your AirBook account</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" v-if="!showForgotPassword" class="flex-grow-1">
            <div class="mb-3">
              <label for="email" class="form-label fw-semibold">Email Address</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input
                  type="email"
                  id="email"
                  v-model="loginForm.email"
                  placeholder="Enter your email"
                  class="form-control"
                  required
                  :class="{ 'is-invalid': errors.email }"
                >
              </div>
              <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label fw-semibold">Password</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="loginForm.password"
                  placeholder="Enter your password"
                  class="form-control"
                  required
                  :class="{ 'is-invalid': errors.password }"
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="btn btn-outline-secondary"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  v-model="loginForm.rememberMe"
                >
                <label class="form-check-label fw-semibold" for="rememberMe">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                @click="showForgotPassword = true"
                class="btn btn-link p-0 text-decoration-none fw-semibold"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 mb-3"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Sign In
            </button>
          </form>

          <!-- Forgot Password Form -->
          <form @submit.prevent="handleForgotPassword" v-else class="flex-grow-1">
            <div class="mb-3">
              <label for="resetEmail" class="form-label fw-semibold">Email Address</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input
                  type="email"
                  id="resetEmail"
                  v-model="resetForm.email"
                  placeholder="Enter your email"
                  class="form-control"
                  required
                >
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 mb-3"
              :disabled="resetLoading"
            >
              <span v-if="resetLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i class="bi bi-send me-2"></i>
              Send Reset Link
            </button>

            <button
              type="button"
              @click="showForgotPassword = false"
              class="btn btn-outline-secondary w-100"
            >
              <i class="bi bi-arrow-left me-2"></i>
              Back to Sign In
            </button>
          </form>

          <!-- Social Login -->
          <div class="mt-4">
            <div class="position-relative text-center mb-3">
              <hr class="my-0">
              <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                or continue with
              </span>
            </div>
            <div class="row g-2">
              <div class="col-6">
                <button @click="loginWithGoogle" class="btn btn-outline-secondary w-100">
                  <i class="bi bi-google me-2"></i>
                  Google
                </button>
              </div>
              <div class="col-6">
                <button @click="loginWithFacebook" class="btn btn-outline-secondary w-100">
                  <i class="bi bi-facebook me-2"></i>
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center mt-4">
            <p class="mb-0 text-muted">
              Don't have an account?
              <router-link to="/register" class="text-primary fw-semibold text-decoration-none">Sign up</router-link>
            </p>
          </div>
        </div>

        <!-- Welcome Section -->
        <div class="col-lg-6 bg-primary text-white p-4 p-md-5 d-flex align-items-center">
          <div>
            <h2 class="h3 fw-bold mb-3">Start Your Journey</h2>
            <p class="mb-4 opacity-75 lh-base">
              Access exclusive deals, manage your bookings, and enjoy a seamless travel experience with AirBook.
            </p>

            <div class="d-flex flex-column gap-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-airplane-engines fs-4 me-3"></i>
                <span>Book flights worldwide</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-person-circle fs-4 me-3"></i>
                <span>Choose your preferred seats</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-ticket-perforated fs-4 me-3"></i>
                <span>Manage all your bookings</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-bell fs-4 me-3"></i>
                <span>Get flight updates</span>
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
  name: 'Login',
  data() {
    return {
      showPassword: false,
      showForgotPassword: false,
      loading: false,
      resetLoading: false,
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      resetForm: {
        email: ''
      },
      errors: {}
    }
  },
  methods: {
    async handleLogin() {
      this.errors = {}
      this.loading = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Mock validation
        if (this.loginForm.email === 'demo@airbook.com' && this.loginForm.password === 'demo123') {
          // Success - store user data and redirect
          const userData = {
            name: 'Demo User',
            email: this.loginForm.email,
            role: 'user'
          }
          localStorage.setItem('user', JSON.stringify(userData))

          // Success - redirect to home or intended page
          const redirectTo = this.$route.query.redirect || '/'
          this.$router.push(redirectTo)
        } else if (this.loginForm.email === 'admin@airbook.com' && this.loginForm.password === 'admin123') {
          // Admin login
          const userData = {
            name: 'Admin User',
            email: this.loginForm.email,
            role: 'admin'
          }
          localStorage.setItem('user', JSON.stringify(userData))

          // Success - redirect to admin dashboard
          this.$router.push('/admin')
        } else {
          this.errors.email = 'Invalid email or password'
          this.errors.password = 'Invalid email or password'
        }
      } catch (error) {
        console.error('Login error:', error)
        this.errors.general = 'An error occurred. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async handleForgotPassword() {
      this.resetLoading = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        alert('Password reset link sent to your email!')
        this.showForgotPassword = false
        this.resetForm.email = ''
      } catch (error) {
        console.error('Reset password error:', error)
        alert('An error occurred. Please try again.')
      } finally {
        this.resetLoading = false
      }
    },

    loginWithGoogle() {
      // Handle Google OAuth
      console.log('Google login clicked')
      alert('Google login integration coming soon!')
    },

    loginWithFacebook() {
      // Handle Facebook OAuth
      console.log('Facebook login clicked')
      alert('Facebook login integration coming soon!')
    }
  }
}
</script>

<style scoped>
/* Custom gradient background */
.bg-primary {
  background: linear-gradient(135deg, #0d6efd 0%, #0056b3 100%) !important;
}

/* Enhanced card styling */
.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}

/* Input group styling */
.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* Button hover effects */
.btn:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .col-lg-6 {
    order: 2;
  }

  .bg-primary {
    order: 1 !important;
  }
}

@media (max-width: 767.98px) {
  .p-4 {
    padding: 1.5rem !important;
  }

  .p-md-5 {
    padding: 1.5rem !important;
  }

  .h2 {
    font-size: 1.75rem;
  }

  .h3 {
    font-size: 1.5rem;
  }

  .row.g-2 .col-6 {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 575.98px) {
  .min-vh-100 {
    padding: 1rem 0 !important;
  }

  .rounded {
    border-radius: 0.5rem !important;
  }
}
</style>
