<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <span class="fs-4 me-2">✈️</span>
          <span class="fw-bold">AirBook</span>
        </router-link>

        <!-- Mobile Menu Button -->
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleMobileMenu"
          aria-controls="navbarNav"
          :aria-expanded="showMobileMenu"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Desktop Navigation -->
        <div class="collapse navbar-collapse" :class="{ show: showMobileMenu }" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact>Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/search" class="nav-link">Search Flights</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/bookings" class="nav-link">
                <span class="me-1">🎫</span>
                My Bookings
              </router-link>
            </li>
            <li class="nav-item" v-if="isAdmin">
              <router-link to="/admin" class="nav-link">
                <span class="me-1">⚙️</span>
                Admin
              </router-link>
            </li>
          </ul>

          <!-- User Actions -->
          <div class="d-flex align-items-center">
            <div v-if="!isLoggedIn" class="d-flex gap-2">
              <router-link to="/login" class="btn btn-outline-primary">Sign In</router-link>
              <router-link to="/login" class="btn btn-primary">Sign Up</router-link>
            </div>
            <div v-else class="d-flex align-items-center gap-3">
              <span class="text-muted small d-none d-lg-inline">Welcome, {{ userName }}!</span>
              <button @click="logout" class="btn btn-outline-danger">
                <span class="me-1">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      showMobileMenu: false,
      isLoggedIn: false,
      isAdmin: false,
      userName: 'John Doe',
      userInitials: 'JD'
    }
  },
  mounted() {
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      const user = localStorage.getItem('user')
      if (user) {
        const userData = JSON.parse(user)
        this.isLoggedIn = true
        this.userName = userData.name || 'User'
        this.userInitials = this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
        this.isAdmin = userData.role === 'admin'
      }
    },

    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },

    logout() {
      localStorage.removeItem('user')
      this.isLoggedIn = false
      this.isAdmin = false
      this.userName = ''
      this.userInitials = ''
      this.showMobileMenu = false
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* Custom overrides for Bootstrap navbar */
.navbar-brand {
  color: #007bff !important;
  font-weight: 700;
}

.nav-link {
  position: relative;
}

.nav-link.router-link-active {
  color: #007bff !important;
  font-weight: 500;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #007bff;
  border-radius: 1px;
}

/* Mobile responsive adjustments */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background: white;
    padding: 1rem;
    border-radius: 0 0 0.375rem 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }

  .navbar-nav {
    margin: 0;
  }

  .navbar-nav .nav-item {
    margin-bottom: 0.5rem;
  }
}
</style>
