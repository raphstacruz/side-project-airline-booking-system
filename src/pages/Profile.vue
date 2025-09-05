<template>
  <div class="profile-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>My Profile</h1>
        <p>Manage your account and bookings</p>
      </div>

      <div class="profile-layout">
        <!-- Sidebar -->
        <div class="profile-sidebar">
          <div class="user-info card">
            <div class="user-avatar">
              <span>{{ userInitials }}</span>
            </div>
            <div class="user-details">
              <h3>{{ user.firstName }} {{ user.lastName }}</h3>
              <p>{{ user.email }}</p>
              <span class="member-since">Member since {{ formatDate(user.joinDate) }}</span>
            </div>
          </div>

          <nav class="profile-nav">
            <button
              @click="activeTab = 'bookings'"
              :class="['nav-item', { active: activeTab === 'bookings' }]"
            >
              <span class="nav-icon">🎫</span>
              My Bookings
            </button>
            <button
              @click="activeTab = 'profile'"
              :class="['nav-item', { active: activeTab === 'profile' }]"
            >
              <span class="nav-icon">👤</span>
              Profile Settings
            </button>
            <button
              @click="activeTab = 'preferences'"
              :class="['nav-item', { active: activeTab === 'preferences' }]"
            >
              <span class="nav-icon">⚙️</span>
              Preferences
            </button>
            <button
              @click="activeTab = 'security'"
              :class="['nav-item', { active: activeTab === 'security' }]"
            >
              <span class="nav-icon">🔒</span>
              Security
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="profile-main">
          <!-- My Bookings Tab -->
          <div v-if="activeTab === 'bookings'" class="tab-content">
            <div class="tab-header">
              <h2>My Bookings</h2>
              <button @click="$router.push('/search')" class="btn btn-primary">
                Book New Flight
              </button>
            </div>

            <div v-if="bookings.length === 0" class="empty-state">
              <div class="empty-icon">🎫</div>
              <h3>No bookings yet</h3>
              <p>You haven't made any bookings yet. Start your journey today!</p>
              <button @click="$router.push('/search')" class="btn btn-primary">
                Search Flights
              </button>
            </div>

            <div v-else class="bookings-list">
              <div
                v-for="booking in bookings"
                :key="booking.id"
                class="booking-card card"
              >
                <div class="booking-header">
                  <div class="booking-info">
                    <h4>{{ booking.flight.from }} → {{ booking.flight.to }}</h4>
                    <p>{{ formatDate(booking.flight.date) }}</p>
                  </div>
                  <div class="booking-status">
                    <span :class="['status-badge', booking.status.toLowerCase()]">
                      {{ booking.status }}
                    </span>
                  </div>
                </div>

                <div class="booking-details">
                  <div class="detail-row">
                    <span class="label">Booking Reference:</span>
                    <span class="value">{{ booking.reference }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Airline:</span>
                    <span class="value">{{ booking.flight.airline }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Passengers:</span>
                    <span class="value">{{ booking.passengers.length }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Total Paid:</span>
                    <span class="value">₱{{ booking.totalAmount }}</span>
                  </div>
                </div>

                <div class="booking-actions">
                  <button @click="viewBooking(booking)" class="btn btn-outline">
                    View Details
                  </button>
                  <button
                    v-if="booking.status === 'Confirmed'"
                    @click="cancelBooking(booking)"
                    class="btn btn-danger"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Settings Tab -->
          <div v-if="activeTab === 'profile'" class="tab-content">
            <div class="tab-header">
              <h2>Profile Settings</h2>
            </div>

            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-section">
                <h3>Personal Information</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      v-model="profileForm.firstName"
                      class="form-control"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      v-model="profileForm.lastName"
                      class="form-control"
                      required
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    v-model="profileForm.email"
                    class="form-control"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="phone" class="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="profileForm.phone"
                    class="form-control"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="dateOfBirth" class="form-label">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    v-model="profileForm.dateOfBirth"
                    class="form-control"
                  >
                </div>
              </div>

              <div class="form-section">
                <h3>Address Information</h3>

                <div class="form-group">
                  <label for="address" class="form-label">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    v-model="profileForm.address"
                    class="form-control"
                  >
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city" class="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      v-model="profileForm.city"
                      class="form-control"
                    >
                  </div>

                  <div class="form-group">
                    <label for="state" class="form-label">State/Province</label>
                    <input
                      type="text"
                      id="state"
                      v-model="profileForm.state"
                      class="form-control"
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="zipCode" class="form-label">ZIP/Postal Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      v-model="profileForm.zipCode"
                      class="form-control"
                    >
                  </div>

                  <div class="form-group">
                    <label for="country" class="form-label">Country</label>
                    <select
                      id="country"
                      v-model="profileForm.country"
                      class="form-control"
                    >
                      <option value="">Select Country</option>
                      <option value="PH">Philippines</option>
                      <option value="US">United States</option>
                      <option value="SG">Singapore</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="updating">
                  <span v-if="updating" class="spinner small"></span>
                  <span v-else>Save Changes</span>
                </button>
                <button type="button" @click="resetForm" class="btn btn-outline">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'" class="tab-content">
            <div class="tab-header">
              <h2>Travel Preferences</h2>
            </div>

            <div class="preferences-form">
              <div class="preference-group">
                <h3>Seat Preferences</h3>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="preferences.windowSeat">
                    Window seat
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="preferences.aisleSeat">
                    Aisle seat
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="preferences.extraLegroom">
                    Extra legroom
                  </label>
                </div>
              </div>

              <div class="preference-group">
                <h3>Meal Preferences</h3>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" value="regular" v-model="preferences.mealType">
                    Regular meal
                  </label>
                  <label class="radio-label">
                    <input type="radio" value="vegetarian" v-model="preferences.mealType">
                    Vegetarian
                  </label>
                  <label class="radio-label">
                    <input type="radio" value="halal" v-model="preferences.mealType">
                    Halal
                  </label>
                  <label class="radio-label">
                    <input type="radio" value="kosher" v-model="preferences.mealType">
                    Kosher
                  </label>
                </div>
              </div>

              <div class="preference-group">
                <h3>Notifications</h3>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="preferences.emailNotifications">
                    Email notifications
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="preferences.smsNotifications">
                    SMS notifications
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="preferences.flightUpdates">
                    Flight status updates
                  </label>
                </div>
              </div>

              <div class="form-actions">
                <button @click="savePreferences" class="btn btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="tab-content">
            <div class="tab-header">
              <h2>Security Settings</h2>
            </div>

            <div class="security-settings">
              <div class="setting-group">
                <h3>Change Password</h3>
                <form @submit.prevent="changePassword" class="password-form">
                  <div class="form-group">
                    <label for="currentPassword" class="form-label">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      v-model="passwordForm.current"
                      class="form-control"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label for="newPassword" class="form-label">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      v-model="passwordForm.new"
                      class="form-control"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      v-model="passwordForm.confirm"
                      class="form-control"
                      required
                    >
                  </div>

                  <button type="submit" class="btn btn-primary" :disabled="changingPassword">
                    <span v-if="changingPassword" class="spinner small"></span>
                    <span v-else>Change Password</span>
                  </button>
                </form>
              </div>

              <div class="setting-group">
                <h3>Two-Factor Authentication</h3>
                <div class="tfa-status">
                  <p>Two-factor authentication is currently <strong>{{ tfaEnabled ? 'enabled' : 'disabled' }}</strong></p>
                  <button @click="toggleTFA" class="btn" :class="tfaEnabled ? 'btn-outline' : 'btn-primary'">
                    {{ tfaEnabled ? 'Disable' : 'Enable' }} 2FA
                  </button>
                </div>
              </div>

              <div class="setting-group danger-zone">
                <h3>Danger Zone</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button @click="deleteAccount" class="btn btn-danger">
                  Delete Account
                </button>
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
  name: 'Profile',
  data() {
    return {
      activeTab: 'bookings',
      updating: false,
      changingPassword: false,
      tfaEnabled: false,
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        joinDate: '2024-01-15'
      },
      bookings: [
        {
          id: 1,
          reference: 'AB123456',
          status: 'Confirmed',
          totalAmount: 4500,
          flight: {
            from: 'Manila',
            to: 'Cebu',
            date: '2024-12-25',
            airline: 'Philippine Airlines'
          },
          passengers: ['John Doe']
        }
      ],
      profileForm: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+63 912 345 6789',
        dateOfBirth: '1990-01-01',
        address: '123 Main St',
        city: 'Manila',
        state: 'Metro Manila',
        zipCode: '1000',
        country: 'PH'
      },
      preferences: {
        windowSeat: true,
        aisleSeat: false,
        extraLegroom: true,
        mealType: 'regular',
        emailNotifications: true,
        smsNotifications: false,
        flightUpdates: true
      },
      passwordForm: {
        current: '',
        new: '',
        confirm: ''
      }
    }
  },
  computed: {
    userInitials() {
      return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase()
    }
  },
  methods: {
    async updateProfile() {
      this.updating = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Profile updated successfully!')
      } catch (error) {
        console.error('Update error:', error)
        alert('Failed to update profile')
      } finally {
        this.updating = false
      }
    },

    resetForm() {
      // Reset form to original values
      this.profileForm = { ...this.user }
    },

    async savePreferences() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        alert('Preferences saved successfully!')
      } catch (error) {
        console.error('Save error:', error)
        alert('Failed to save preferences')
      }
    },

    async changePassword() {
      if (this.passwordForm.new !== this.passwordForm.confirm) {
        alert('New passwords do not match')
        return
      }

      this.changingPassword = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Password changed successfully!')
        this.passwordForm = { current: '', new: '', confirm: '' }
      } catch (error) {
        console.error('Password change error:', error)
        alert('Failed to change password')
      } finally {
        this.changingPassword = false
      }
    },

    toggleTFA() {
      this.tfaEnabled = !this.tfaEnabled
      alert(`Two-factor authentication ${this.tfaEnabled ? 'enabled' : 'disabled'}`)
    },

    deleteAccount() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('Account deletion is not implemented in this demo')
      }
    },

    viewBooking(booking) {
      // Navigate to booking details
      this.$router.push(`/booking/${booking.id}`)
    },

    cancelBooking(booking) {
      if (confirm('Are you sure you want to cancel this booking?')) {
        alert('Booking cancellation is not implemented in this demo')
      }
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 2rem 0;
  background: var(--gray-100);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.125rem;
  color: var(--gray-600);
}

.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* Sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.user-info {
  padding: 2rem;
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  background: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto 1rem;
}

.user-details h3 {
  margin: 0 0 0.5rem 0;
  color: var(--gray-900);
}

.user-details p {
  margin: 0 0 0.5rem 0;
  color: var(--gray-600);
}

.member-since {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
}

.nav-item:hover,
.nav-item.active {
  background: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

.nav-icon {
  font-size: 1.25rem;
}

/* Main Content */
.profile-main {
  min-height: 60vh;
}

.tab-content {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tab-header h2 {
  margin: 0;
  color: var(--gray-900);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--gray-600);
  margin-bottom: 2rem;
}

/* Bookings */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  padding: 1.5rem;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.booking-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--gray-900);
}

.booking-info p {
  margin: 0;
  color: var(--gray-600);
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.confirmed {
  background: var(--success-color);
  color: var(--white);
}

.status-badge.cancelled {
  background: var(--danger-color);
  color: var(--white);
}

.status-badge.pending {
  background: var(--warning-color);
  color: var(--white);
}

.booking-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.detail-row .label {
  font-weight: 600;
  color: var(--gray-700);
}

.detail-row .value {
  color: var(--gray-900);
}

.booking-actions {
  display: flex;
  gap: 1rem;
}

/* Forms */
.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  color: var(--gray-900);
  margin-bottom: 1.5rem;
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
  margin-bottom: 1rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

/* Preferences */
.preference-group {
  margin-bottom: 2rem;
}

.preference-group h3 {
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--gray-700);
}

/* Security */
.security-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-group {
  padding: 1.5rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
}

.setting-group h3 {
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tfa-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.danger-zone {
  border-color: var(--danger-color);
}

.danger-zone h3 {
  color: var(--danger-color);
}

.small.spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    order: -1;
  }

  .tab-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .nav-item {
    padding: 0.875rem;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .booking-header {
    flex-direction: column;
    gap: 1rem;
  }

  .booking-actions {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .tab-header h2 {
    font-size: 1.5rem;
  }

  .user-info {
    padding: 1.5rem;
  }

  .booking-card {
    padding: 1rem;
  }
}
</style>
