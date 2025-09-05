<template>
  <div class="bookings-list-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>My Bookings</h1>
        <p>View and manage all your flight reservations</p>
      </div>

      <!-- Bookings Filters -->
      <div class="filters-section card">
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">Status</label>
            <select v-model="filters.status" @change="applyFilters" class="form-control">
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Date Range</label>
            <select v-model="filters.dateRange" @change="applyFilters" class="form-control">
              <option value="all">All Time</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Search</label>
            <input
              type="text"
              v-model="filters.search"
              @input="applyFilters"
              placeholder="Flight number, destination..."
              class="form-control"
            >
          </div>
        </div>
      </div>

      <!-- Bookings List -->
      <div v-if="filteredBookings.length === 0" class="no-bookings">
        <div class="no-bookings-icon">🎫</div>
        <h3>No bookings found</h3>
        <p>{{ noBookingsMessage }}</p>
        <router-link to="/search" class="btn btn-primary">
          Book Your First Flight
        </router-link>
      </div>

      <div v-else class="bookings-container">
        <div
          v-for="booking in filteredBookings"
          :key="booking.id"
          class="booking-card card"
          :class="{ 'past-booking': isPastBooking(booking) }"
        >
          <div class="booking-header">
            <div class="booking-info">
              <div class="booking-reference">
                <span class="label">Booking #</span>
                <span class="value">{{ booking.reference }}</span>
              </div>
              <div class="booking-status">
                <span :class="['status-badge', booking.status.toLowerCase()]">
                  {{ booking.status }}
                </span>
              </div>
            </div>
            <div class="booking-actions">
              <button @click="viewBooking(booking)" class="btn btn-outline btn-sm">
                View Details
              </button>
              <button
                v-if="booking.status === 'Confirmed' && !isPastBooking(booking)"
                @click="cancelBooking(booking)"
                class="btn btn-danger btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          <div class="flight-details">
            <div class="flight-route">
              <div class="departure">
                <div class="time">{{ booking.flight.departure.time }}</div>
                <div class="airport">{{ booking.flight.departure.airport }}</div>
                <div class="city">{{ booking.flight.departure.city }}</div>
                <div class="date">{{ formatDate(booking.flight.departure.date) }}</div>
              </div>

              <div class="flight-path">
                <div class="path-line"></div>
                <div class="flight-info">
                  <div class="airline">{{ booking.flight.airline }}</div>
                  <div class="flight-number">{{ booking.flight.flightNumber }}</div>
                  <div class="duration">{{ booking.flight.duration }}</div>
                </div>
              </div>

              <div class="arrival">
                <div class="time">{{ booking.flight.arrival.time }}</div>
                <div class="airport">{{ booking.flight.arrival.airport }}</div>
                <div class="city">{{ booking.flight.arrival.city }}</div>
                <div class="date">{{ formatDate(booking.flight.arrival.date) }}</div>
              </div>
            </div>

            <div class="booking-meta">
              <div class="meta-item">
                <span class="label">Passengers:</span>
                <span class="value">{{ booking.passengers.length }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Class:</span>
                <span class="value">{{ booking.flight.class.charAt(0).toUpperCase() + booking.flight.class.slice(1) }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Total Paid:</span>
                <span class="value price">₱{{ booking.totalAmount }}</span>
              </div>
              <div v-if="booking.seats && booking.seats.length > 0" class="meta-item">
                <span class="label">Seats:</span>
                <span class="value">{{ booking.seats.join(', ') }}</span>
              </div>
            </div>
          </div>

          <!-- Expandable Details -->
          <div v-if="expandedBooking === booking.id" class="booking-expanded">
            <div class="passenger-details">
              <h4>Passenger Details</h4>
              <div v-for="(passenger, index) in booking.passengers" :key="index" class="passenger-item">
                <div class="passenger-name">
                  {{ passenger.title }} {{ passenger.firstName }} {{ passenger.lastName }}
                </div>
                <div class="passenger-info">
                  <span>Passport: {{ passenger.passportNumber }}</span>
                  <span>Seat: {{ booking.seats ? booking.seats[index] || 'Not assigned' : 'Not assigned' }}</span>
                </div>
              </div>
            </div>

            <div class="contact-details">
              <h4>Contact Information</h4>
              <p><strong>Email:</strong> {{ booking.contactInfo.email }}</p>
              <p><strong>Phone:</strong> {{ booking.contactInfo.phone }}</p>
            </div>

            <div v-if="booking.specialRequests" class="special-requests">
              <h4>Special Requests</h4>
              <p>{{ booking.specialRequests }}</p>
            </div>
          </div>

          <div class="booking-footer">
            <button
              @click="toggleExpanded(booking.id)"
              class="btn btn-link"
            >
              {{ expandedBooking === booking.id ? 'Hide Details' : 'Show Details' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredBookings.length > 0" class="pagination">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="btn btn-outline"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingsList',
  data() {
    return {
      bookings: [],
      filteredBookings: [],
      expandedBooking: null,
      currentPage: 1,
      itemsPerPage: 5,
      filters: {
        status: 'all',
        dateRange: 'all',
        search: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.itemsPerPage)
    },
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredBookings.slice(start, end)
    },
    noBookingsMessage() {
      if (this.bookings.length === 0) {
        return "You haven't made any bookings yet."
      }
      return "No bookings match your current filters."
    }
  },
  mounted() {
    this.loadBookings()
  },
  methods: {
    loadBookings() {
      // Mock bookings data - in real app, fetch from API
      this.bookings = [
        {
          id: 'BK001',
          reference: 'AB123456',
          status: 'Confirmed',
          totalAmount: 4500,
          flight: {
            airline: 'Philippine Airlines',
            flightNumber: 'PAL101',
            departure: {
              time: '10:30',
              airport: 'MNL',
              city: 'Manila',
              date: '2024-12-25'
            },
            arrival: {
              time: '14:45',
              airport: 'CEB',
              city: 'Cebu',
              date: '2024-12-25'
            },
            duration: '4h 15m',
            class: 'economy'
          },
          passengers: [
            {
              title: 'Mr',
              firstName: 'John',
              lastName: 'Doe',
              passportNumber: 'P123456789'
            }
          ],
          seats: ['12A'],
          contactInfo: {
            email: 'john.doe@example.com',
            phone: '+63 912 345 6789'
          },
          specialRequests: 'Vegetarian meal preferred'
        },
        {
          id: 'BK002',
          reference: 'AB123457',
          status: 'Pending',
          totalAmount: 3200,
          flight: {
            airline: 'Cebu Pacific',
            flightNumber: 'CEB202',
            departure: {
              time: '08:00',
              airport: 'MNL',
              city: 'Manila',
              date: '2024-11-15'
            },
            arrival: {
              time: '09:30',
              airport: 'DVO',
              city: 'Davao',
              date: '2024-11-15'
            },
            duration: '1h 30m',
            class: 'economy'
          },
          passengers: [
            {
              title: 'Ms',
              firstName: 'Jane',
              lastName: 'Smith',
              passportNumber: 'P987654321'
            }
          ],
          seats: ['8C'],
          contactInfo: {
            email: 'jane.smith@example.com',
            phone: '+63 987 654 3210'
          }
        }
      ]

      this.applyFilters()
    },

    applyFilters() {
      let filtered = [...this.bookings]

      // Status filter
      if (this.filters.status !== 'all') {
        filtered = filtered.filter(booking => booking.status.toLowerCase() === this.filters.status)
      }

      // Date range filter
      if (this.filters.dateRange !== 'all') {
        const now = new Date()
        filtered = filtered.filter(booking => {
          const flightDate = new Date(booking.flight.departure.date)

          switch (this.filters.dateRange) {
            case 'upcoming':
              return flightDate >= now
            case 'past':
              return flightDate < now
            case 'thisMonth':
              return flightDate.getMonth() === now.getMonth() && flightDate.getFullYear() === now.getFullYear()
            case 'lastMonth':
              const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
              return flightDate.getMonth() === lastMonth.getMonth() && flightDate.getFullYear() === lastMonth.getFullYear()
            default:
              return true
          }
        })
      }

      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase()
        filtered = filtered.filter(booking =>
          booking.flight.flightNumber.toLowerCase().includes(searchTerm) ||
          booking.flight.departure.city.toLowerCase().includes(searchTerm) ||
          booking.flight.arrival.city.toLowerCase().includes(searchTerm) ||
          booking.reference.toLowerCase().includes(searchTerm)
        )
      }

      this.filteredBookings = filtered
      this.currentPage = 1 // Reset to first page when filtering
    },

    toggleExpanded(bookingId) {
      this.expandedBooking = this.expandedBooking === bookingId ? null : bookingId
    },

    viewBooking(booking) {
      // Navigate to booking details page
      this.$router.push(`/booking/${booking.id}`)
    },

    cancelBooking(booking) {
      if (confirm(`Are you sure you want to cancel booking ${booking.reference}?`)) {
        // In real app, make API call to cancel booking
        booking.status = 'Cancelled'
        alert('Booking cancelled successfully')
      }
    },

    isPastBooking(booking) {
      const flightDate = new Date(booking.flight.departure.date)
      return flightDate < new Date()
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.bookings-list-page {
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

/* Filters Section */
.filters-section {
  margin-bottom: 2rem;
  padding: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
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

/* No Bookings State */
.no-bookings {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.no-bookings-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-bookings h3 {
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.no-bookings p {
  color: var(--gray-600);
  margin-bottom: 2rem;
}

/* Bookings Container */
.bookings-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  padding: 0;
  transition: var(--transition);
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.booking-card.past-booking {
  opacity: 0.7;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.booking-reference .label {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.booking-reference .value {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 1.125rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.confirmed {
  background: var(--success-color);
  color: var(--white);
}

.status-badge.pending {
  background: var(--warning-color);
  color: var(--white);
}

.status-badge.cancelled {
  background: var(--danger-color);
  color: var(--white);
}

.status-badge.completed {
  background: var(--info-color);
  color: var(--white);
}

.booking-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Flight Details */
.flight-details {
  padding: 1.5rem;
}

.flight-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.departure,
.arrival {
  text-align: center;
  flex: 1;
}

.time {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.airport {
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 0.25rem;
}

.city {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.date {
  color: var(--gray-500);
  font-size: 0.75rem;
}

.flight-path {
  flex: 2;
  text-align: center;
  position: relative;
}

.path-line {
  height: 2px;
  background: var(--gray-300);
  position: relative;
  margin: 0 1rem;
}

.path-line::before {
  content: '✈️';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--white);
  padding: 0.25rem;
  border-radius: 50%;
  font-size: 1rem;
}

.flight-info {
  margin-top: 0.5rem;
}

.airline {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.flight-number {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.duration {
  color: var(--gray-700);
  font-size: 0.875rem;
}

.booking-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-item .label {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.meta-item .value {
  font-weight: 600;
  color: var(--gray-900);
}

.price {
  color: var(--primary-color);
  font-size: 1.125rem;
}

/* Expanded Details */
.booking-expanded {
  padding: 1.5rem;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.booking-expanded h4 {
  color: var(--gray-900);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.passenger-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.passenger-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.passenger-name {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.passenger-info {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  color: var(--gray-600);
}

.contact-details p {
  margin: 0.25rem 0;
  color: var(--gray-700);
}

.special-requests p {
  color: var(--gray-700);
  font-style: italic;
}

.booking-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-200);
  text-align: center;
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.875rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.page-info {
  color: var(--gray-600);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .bookings-list-page {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .booking-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .booking-actions {
    justify-content: center;
  }

  .flight-route {
    flex-direction: column;
    gap: 1rem;
  }

  .departure,
  .arrival {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .flight-path {
    order: 1;
  }

  .path-line {
    margin: 0;
    flex: 1;
  }

  .booking-meta {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .passenger-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pagination {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .filters-section {
    padding: 1.5rem;
  }

  .booking-card {
    margin: 0 0.5rem;
  }

  .flight-details {
    padding: 1rem;
  }

  .booking-expanded {
    padding: 1rem;
  }
}
</style>
