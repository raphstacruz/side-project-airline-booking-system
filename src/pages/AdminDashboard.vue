<template>
  <div class="admin-dashboard">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage flights, bookings, and system settings</p>
      </div>

      <!-- Dashboard Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">✈️</div>
          <div class="stat-info">
            <h3>{{ stats.totalFlights }}</h3>
            <p>Total Flights</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎫</div>
          <div class="stat-info">
            <h3>{{ stats.totalBookings }}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Registered Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>₱{{ stats.totalRevenue }}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <!-- Admin Navigation -->
      <div class="admin-nav">
        <button
          @click="activeSection = 'flights'"
          :class="['nav-btn', { active: activeSection === 'flights' }]"
        >
          Manage Flights
        </button>
        <button
          @click="activeSection = 'bookings'"
          :class="['nav-btn', { active: activeSection === 'bookings' }]"
        >
          Manage Bookings
        </button>
        <button
          @click="activeSection = 'users'"
          :class="['nav-btn', { active: activeSection === 'users' }]"
        >
          Manage Users
        </button>
        <button
          @click="activeSection = 'reports'"
          :class="['nav-btn', { active: activeSection === 'reports' }]"
        >
          Reports
        </button>
      </div>

      <!-- Flights Management -->
      <div v-if="activeSection === 'flights'" class="section-content">
        <div class="section-header">
          <h2>Flight Management</h2>
          <button @click="showAddFlightModal = true" class="btn btn-primary">
            Add New Flight
          </button>
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>Flight Number</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Airline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="flight in flights" :key="flight.id">
                <td>{{ flight.flightNumber }}</td>
                <td>{{ flight.from }} → {{ flight.to }}</td>
                <td>{{ formatDateTime(flight.departure) }}</td>
                <td>{{ flight.airline }}</td>
                <td>
                  <span :class="['status-badge', flight.status.toLowerCase()]">
                    {{ flight.status }}
                  </span>
                </td>
                <td>
                  <button @click="editFlight(flight)" class="btn btn-sm btn-outline">
                    Edit
                  </button>
                  <button @click="deleteFlight(flight)" class="btn btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bookings Management -->
      <div v-if="activeSection === 'bookings'" class="section-content">
        <div class="section-header">
          <h2>Booking Management</h2>
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Flight</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.id">
                <td>{{ booking.id }}</td>
                <td>{{ booking.customerName }}</td>
                <td>{{ booking.flightNumber }}</td>
                <td>
                  <span :class="['status-badge', booking.status.toLowerCase()]">
                    {{ booking.status }}
                  </span>
                </td>
                <td>₱{{ booking.amount }}</td>
                <td>
                  <button @click="viewBooking(booking)" class="btn btn-sm btn-outline">
                    View
                  </button>
                  <button @click="cancelBooking(booking)" class="btn btn-sm btn-danger">
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users Management -->
      <div v-if="activeSection === 'users'" class="section-content">
        <div class="section-header">
          <h2>User Management</h2>
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ formatDate(user.joinDate) }}</td>
                <td>
                  <span :class="['status-badge', user.status.toLowerCase()]">
                    {{ user.status }}
                  </span>
                </td>
                <td>
                  <button @click="editUser(user)" class="btn btn-sm btn-outline">
                    Edit
                  </button>
                  <button @click="toggleUserStatus(user)" class="btn btn-sm" :class="user.status === 'Active' ? 'btn-danger' : 'btn-success'">
                    {{ user.status === 'Active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reports -->
      <div v-if="activeSection === 'reports'" class="section-content">
        <div class="section-header">
          <h2>Reports & Analytics</h2>
        </div>

        <div class="reports-grid">
          <div class="report-card">
            <h3>Revenue Report</h3>
            <p>Monthly revenue breakdown and trends</p>
            <button class="btn btn-outline">Generate Report</button>
          </div>

          <div class="report-card">
            <h3>Booking Report</h3>
            <p>Booking statistics and popular routes</p>
            <button class="btn btn-outline">Generate Report</button>
          </div>

          <div class="report-card">
            <h3>User Report</h3>
            <p>User registration and activity metrics</p>
            <button class="btn btn-outline">Generate Report</button>
          </div>

          <div class="report-card">
            <h3>Flight Performance</h3>
            <p>Flight occupancy and performance data</p>
            <button class="btn btn-outline">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeSection: 'flights',
      showAddFlightModal: false,
      stats: {
        totalFlights: 45,
        totalBookings: 1234,
        totalUsers: 567,
        totalRevenue: 2500000
      },
      flights: [
        {
          id: 1,
          flightNumber: 'PAL101',
          from: 'Manila',
          to: 'Cebu',
          departure: '2024-12-25T10:30:00',
          airline: 'Philippine Airlines',
          status: 'Active'
        },
        {
          id: 2,
          flightNumber: 'CEB202',
          from: 'Manila',
          to: 'Davao',
          departure: '2024-12-25T14:15:00',
          airline: 'Cebu Pacific',
          status: 'Active'
        }
      ],
      bookings: [
        {
          id: 'AB123456',
          customerName: 'John Doe',
          flightNumber: 'PAL101',
          status: 'Confirmed',
          amount: 4500
        },
        {
          id: 'AB123457',
          customerName: 'Jane Smith',
          flightNumber: 'CEB202',
          status: 'Pending',
          amount: 3200
        }
      ],
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'User',
          joinDate: '2024-01-15',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Admin User',
          email: 'admin@airbook.com',
          role: 'Admin',
          joinDate: '2024-01-01',
          status: 'Active'
        }
      ]
    }
  },
  methods: {
    editFlight(flight) {
      alert(`Edit flight: ${flight.flightNumber}`)
    },

    deleteFlight(flight) {
      if (confirm(`Are you sure you want to delete flight ${flight.flightNumber}?`)) {
        alert('Flight deletion not implemented in demo')
      }
    },

    viewBooking(booking) {
      alert(`View booking: ${booking.id}`)
    },

    cancelBooking(booking) {
      if (confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
        alert('Booking cancellation not implemented in demo')
      }
    },

    editUser(user) {
      alert(`Edit user: ${user.name}`)
    },

    toggleUserStatus(user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active'
      alert(`User ${user.name} is now ${user.status}`)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.stat-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: var(--gray-900);
}

.stat-info p {
  margin: 0;
  color: var(--gray-600);
  font-size: 0.875rem;
}

/* Admin Navigation */
.admin-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.875rem 1.5rem;
  border: 2px solid var(--gray-300);
  background: var(--white);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.nav-btn:hover,
.nav-btn.active {
  background: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

/* Section Content */
.section-content {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  color: var(--gray-900);
}

/* Data Table */
.data-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background: var(--gray-100);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--gray-700);
  border-bottom: 2px solid var(--gray-200);
}

tbody td {
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
  color: var(--gray-900);
}

tbody tr:hover {
  background: var(--gray-50);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: var(--success-color);
  color: var(--white);
}

.status-badge.inactive {
  background: var(--danger-color);
  color: var(--white);
}

.status-badge.pending {
  background: var(--warning-color);
  color: var(--white);
}

.status-badge.confirmed {
  background: var(--success-color);
  color: var(--white);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: var(--gray-50);
  padding: 2rem;
  border-radius: var(--border-radius);
  text-align: center;
}

.report-card h3 {
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.report-card p {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .admin-nav {
    flex-direction: column;
  }

  .nav-btn {
    width: 100%;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .section-content {
    padding: 1.5rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-info h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  thead th,
  tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
