<template>
  <div class="py-4">
    <div class="container">
      <!-- Success Header -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <div class="text-success mb-3">
            <i class="bi bi-check-circle-fill fs-1"></i>
          </div>
          <h1 class="display-5 fw-bold text-success mb-3">
            <i class="bi bi-check-circle me-2"></i>
            Booking Confirmed!
          </h1>
          <p class="lead text-muted">Your flight has been successfully booked</p>
        </div>
      </div>

      <!-- Booking Reference -->
      <div class="card mb-5 bg-primary text-white">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-8">
              <div class="mb-2">
                <small class="opacity-75">Booking Reference</small>
              </div>
              <div class="h3 mb-0 font-monospace">{{ bookingReference }}</div>
            </div>
            <div class="col-md-4 text-end">
              <span class="badge bg-success fs-6 px-3 py-2">
                <i class="bi bi-check-circle me-1"></i>
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Booking Details -->
        <div class="col-lg-8">
          <!-- Flight Information -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-airplane-engines me-2"></i>
                Flight Details
              </h3>

              <div class="row align-items-center mb-3">
                <div class="col-auto">
                  <div class="bg-light rounded p-3">
                    <i class="bi bi-airplane-engines fs-2 text-primary"></i>
                  </div>
                </div>
                <div class="col">
                  <h5 class="mb-1">{{ flight.airline }}</h5>
                  <small class="text-muted">{{ flight.flightNumber }}</small>
                </div>
              </div>

              <!-- Flight Route -->
              <div class="row align-items-center mb-3">
                <div class="col text-center">
                  <div class="h4 mb-1">{{ flight.departure.time }}</div>
                  <div class="fw-semibold">{{ flight.departure.airport }}</div>
                  <small class="text-muted">{{ flight.departure.city }}</small>
                  <div class="small text-muted">{{ formatDate(flight.departure.date) }}</div>
                </div>

                <div class="col text-center position-relative">
                  <div class="border-top border-2 mb-2" style="width: 100%;"></div>
                  <div class="mb-1">
                    <span v-if="flight.stops === 0" class="badge bg-success">Nonstop</span>
                    <span v-else class="badge bg-warning">{{ flight.stops }} stop{{ flight.stops > 1 ? 's' : '' }}</span>
                  </div>
                  <small class="text-muted">{{ flight.duration }}</small>
                </div>

                <div class="col text-center">
                  <div class="h4 mb-1">{{ flight.arrival.time }}</div>
                  <div class="fw-semibold">{{ flight.arrival.airport }}</div>
                  <small class="text-muted">{{ flight.arrival.city }}</small>
                  <div class="small text-muted">{{ formatDate(flight.arrival.date) }}</div>
                </div>
              </div>

              <div class="text-center">
                <span class="badge bg-primary fs-6 px-3 py-2">
                  {{ flight.class.charAt(0).toUpperCase() + flight.class.slice(1) }} Class
                </span>
              </div>
            </div>
          </div>

          <!-- Passenger Information -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-people me-2"></i>
                Passenger Information
              </h3>

              <div v-for="(passenger, index) in passengers" :key="index" class="border-bottom pb-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="mb-0">Passenger {{ index + 1 }}</h5>
                  <span class="badge bg-primary">Adult</span>
                </div>

                <div class="row g-2">
                  <div class="col-sm-6">
                    <small class="text-muted d-block">Name</small>
                    <span class="fw-semibold">{{ passenger.title }} {{ passenger.firstName }} {{ passenger.lastName }}</span>
                  </div>
                  <div class="col-sm-6">
                    <small class="text-muted d-block">Date of Birth</small>
                    <span class="fw-semibold">{{ formatDate(passenger.dateOfBirth) }}</span>
                  </div>
                  <div class="col-sm-6">
                    <small class="text-muted d-block">Passport</small>
                    <span class="fw-semibold">{{ passenger.passportNumber }}</span>
                  </div>
                  <div class="col-sm-6">
                    <small class="text-muted d-block">Nationality</small>
                    <span class="fw-semibold">{{ getCountryName(passenger.nationality) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-envelope me-2"></i>
                Contact Information
              </h3>

              <div class="row g-2">
                <div class="col-sm-6">
                  <small class="text-muted d-block">Email</small>
                  <span class="fw-semibold">{{ contactInfo.email }}</span>
                </div>
                <div class="col-sm-6">
                  <small class="text-muted d-block">Phone</small>
                  <span class="fw-semibold">{{ contactInfo.phone }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-receipt me-2"></i>
                Price Summary
              </h3>

              <div class="mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>Flight ({{ passengers.length }} passenger{{ passengers.length > 1 ? 's' : '' }})</span>
                  <span>₱{{ flight.price * passengers.length }}</span>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <span>Taxes & Fees</span>
                  <span>₱{{ taxesAndFees }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold">Total Paid</span>
                  <span class="h5 text-primary mb-0">₱{{ totalPrice }}</span>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                <span class="fw-semibold">Payment Method</span>
                <span class="fw-semibold">{{ getPaymentMethodName() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps Sidebar -->
        <div class="col-lg-4">
          <!-- Important Information -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-info-circle me-2"></i>
                Important Information
              </h3>

              <div class="mb-3">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-envelope me-3 mt-1 text-primary"></i>
                  <div>
                    <h6 class="mb-1">Confirmation Email</h6>
                    <small class="text-muted">A detailed confirmation email has been sent to {{ contactInfo.email }}</small>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-airplane me-3 mt-1 text-primary"></i>
                  <div>
                    <h6 class="mb-1">Check-in</h6>
                    <small class="text-muted">Online check-in opens 24 hours before departure</small>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-ticket-perforated me-3 mt-1 text-primary"></i>
                  <div>
                    <h6 class="mb-1">Boarding Pass</h6>
                    <small class="text-muted">Download your boarding pass from the airline website or app</small>
                  </div>
                </div>

                <div class="d-flex align-items-start">
                  <i class="bi bi-clipboard-check me-3 mt-1 text-primary"></i>
                  <div>
                    <h6 class="mb-1">Documents Required</h6>
                    <small class="text-muted">
                      <ul class="mb-0 small">
                        <li>Valid passport</li>
                        <li>Visa (if required)</li>
                        <li>Booking confirmation</li>
                      </ul>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Travel Tips -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-lightbulb me-2"></i>
                Travel Tips
              </h3>

              <div class="mb-3">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-clock me-3 mt-1 text-warning"></i>
                  <div>
                    <h6 class="mb-1">Arrival Time</h6>
                    <small class="text-muted">Arrive at the airport at least 2-3 hours before international flights</small>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-suitcase me-3 mt-1 text-warning"></i>
                  <div>
                    <h6 class="mb-1">Baggage</h6>
                    <small class="text-muted">Check airline baggage policies and weight limits</small>
                  </div>
                </div>

                <div class="d-flex align-items-start">
                  <i class="bi bi-shield-check me-3 mt-1 text-warning"></i>
                  <div>
                    <h6 class="mb-1">Health Requirements</h6>
                    <small class="text-muted">Check for any COVID-19 or health requirements for your destination</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-gear me-2"></i>
                Manage Your Booking
              </h3>

              <div class="d-grid gap-2">
                <button @click="downloadConfirmation" class="btn btn-primary">
                  <i class="bi bi-download me-2"></i>
                  Download Confirmation
                </button>

                <button @click="addToCalendar" class="btn btn-outline-secondary">
                  <i class="bi bi-calendar-plus me-2"></i>
                  Add to Calendar
                </button>

                <button @click="shareBooking" class="btn btn-outline-secondary">
                  <i class="bi bi-share me-2"></i>
                  Share Booking
                </button>
              </div>
            </div>
          </div>

          <!-- Support -->
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-headset me-2"></i>
                Need Help?
              </h3>
              <p class="text-muted small mb-3">Our customer support team is here to help</p>

              <div class="d-flex flex-column gap-3">
                <div class="d-flex align-items-center">
                  <i class="bi bi-telephone me-3 text-success"></i>
                  <div>
                    <div class="fw-semibold small">Phone Support</div>
                    <div class="text-muted small">1-800-AIRBOOK</div>
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <i class="bi bi-chat-dots me-3 text-success"></i>
                  <div>
                    <div class="fw-semibold small">Live Chat</div>
                    <div class="text-muted small">Available 24/7</div>
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <i class="bi bi-envelope me-3 text-success"></i>
                  <div>
                    <div class="fw-semibold small">Email</div>
                    <div class="text-muted small">support@airbook.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="row justify-content-center mt-5">
        <div class="col-lg-6">
          <div class="d-grid gap-2 d-md-flex justify-content-md-center">
            <button @click="$router.push('/')" class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>
              Book Another Flight
            </button>

            <button @click="$router.push('/profile')" class="btn btn-outline-secondary">
              <i class="bi bi-person me-2"></i>
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirmation',
  data() {
    return {
      bookingReference: '',
      flight: {},
      passengers: [],
      contactInfo: {},
      totalPrice: 0,
      paymentMethod: ''
    }
  },
  computed: {
    taxesAndFees() {
      return Math.round(this.flight.price * this.passengers.length * 0.15)
    }
  },
  mounted() {
    this.loadConfirmationData()
  },
  methods: {
    loadConfirmationData() {
      // Get data from route query
      const query = this.$route.query

      this.bookingReference = query.bookingReference || 'AB' + Date.now().toString().slice(-8)
      this.totalPrice = parseInt(query.totalPrice) || 0
      this.paymentMethod = query.paymentMethod || 'credit'

      // Mock flight and passenger data - in real app, fetch from API
      this.flight = {
        airline: 'Airline A',
        flightNumber: 'FL123',
        departure: {
          time: '10:30',
          airport: 'JFK',
          city: 'New York',
          date: '2024-12-25'
        },
        arrival: {
          time: '14:45',
          airport: 'LAX',
          city: 'Los Angeles',
          date: '2024-12-25'
        },
        duration: '5h 15m',
        price: 450,
        stops: 0,
        class: 'economy'
      }

      this.passengers = [
        {
          title: 'Mr',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          passportNumber: 'P123456789',
          nationality: 'US'
        }
      ]

      this.contactInfo = {
        email: 'john.doe@example.com',
        phone: '+1-555-0123'
      }
    },

    getPaymentMethodName() {
      switch (this.paymentMethod) {
        case 'credit': return 'Credit/Debit Card'
        case 'paypal': return 'PayPal'
        case 'bank': return 'Bank Transfer'
        default: return 'Unknown'
      }
    },

    getCountryName(code) {
      const countries = {
        'US': 'United States',
        'UK': 'United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France',
        'JP': 'Japan',
        'SG': 'Singapore'
      }
      return countries[code] || code
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
    },

    downloadConfirmation() {
      // Mock download functionality
      alert('Downloading booking confirmation...')
    },

    addToCalendar() {
      // Mock calendar integration
      alert('Adding to calendar...')
    },

    shareBooking() {
      // Mock sharing functionality
      if (navigator.share) {
        navigator.share({
          title: 'My Flight Booking',
          text: `Flight booking confirmed! Reference: ${this.bookingReference}`,
          url: window.location.href
        })
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`Flight booking confirmed! Reference: ${this.bookingReference}`)
        alert('Booking reference copied to clipboard!')
      }
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
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

/* Flight path line */
.border-top.border-2 {
  border-color: #dee2e6 !important;
}

/* Badge styling */
.badge {
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .col-lg-8 {
    margin-bottom: 2rem;
  }

  .col-lg-4 {
    order: -1;
  }
}

@media (max-width: 767.98px) {
  .py-4 {
    padding: 1rem 0 !important;
  }

  .display-5 {
    font-size: 2rem;
  }

  .lead {
    font-size: 1rem;
  }

  .row.g-4 {
    --bs-gutter-x: 1rem;
  }

  .row.g-2 {
    --bs-gutter-x: 0.5rem;
  }

  .d-flex.align-items-start {
    flex-direction: column;
    text-align: center;
  }

  .d-flex.align-items-start .me-3 {
    margin-bottom: 0.5rem;
    margin-right: 0 !important;
  }

  .d-flex.align-items-center .me-3 {
    margin-bottom: 0.5rem;
    margin-right: 0 !important;
  }

  .d-grid.gap-2.d-md-flex {
    flex-direction: column;
  }

  .d-grid.gap-2.d-md-flex .btn {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 575.98px) {
  .display-5 {
    font-size: 1.75rem;
  }

  .h4 {
    font-size: 1.1rem;
  }

  .h5 {
    font-size: 1.25rem;
  }

  .btn {
    font-size: 0.9rem;
  }

  .small {
    font-size: 0.8rem;
  }
}
</style>
