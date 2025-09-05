<template>
  <div class="py-4">
    <div class="container">
      <!-- Page Header -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h1 class="display-5 fw-bold mb-3">Complete Your Booking</h1>
          <p class="lead text-muted">Please review your flight details and enter passenger information</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading booking details...</p>
      </div>

      <!-- Main Content -->
      <div v-else-if="flight" class="row g-4">
        <!-- Main Booking Form -->
        <div class="col-lg-8">
          <!-- Flight Summary -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-airplane-engines me-2"></i>
                Flight Summary
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

              <!-- Booking Details -->
              <div class="border-top pt-3">
                <div class="row">
                  <div class="col-6">
                    <small class="text-muted d-block">Class</small>
                    <span class="fw-semibold">{{ flight.class.charAt(0).toUpperCase() + flight.class.slice(1) }}</span>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block">Passengers</small>
                    <span class="fw-semibold">{{ searchQuery.passengers }}</span>
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-12">
                    <div class="border-top pt-2">
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-semibold">Total Price</span>
                        <span class="h5 text-primary mb-0">₱{{ flight.price * parseInt(searchQuery.passengers) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seat Selection Step -->
          <div v-if="currentStep === 'seats'" class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-person-circle me-2"></i>
                Select Your Seats
              </h3>

              <!-- Simple seat selection for demo -->
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Seat selection feature would be implemented here with an interactive seat map.
              </div>

              <div class="d-flex gap-2 flex-wrap">
                <button @click="$router.go(-1)" class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left me-2"></i>
                  Back to Results
                </button>
                <button @click="skipSeatSelection" class="btn btn-secondary">
                  <i class="bi bi-skip-forward me-2"></i>
                  Skip Seat Selection
                </button>
                <button
                  @click="continueToPassengers"
                  class="btn btn-primary"
                  :disabled="selectedSeats.length === 0"
                >
                  Continue to Passengers
                  <i class="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Passenger Information -->
          <div v-if="currentStep === 'passengers'" class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="card-title mb-0">
                  <i class="bi bi-people me-2"></i>
                  Passenger Information
                </h3>
                <button @click="currentStep = 'seats'" class="btn btn-outline-secondary btn-sm">
                  <i class="bi bi-arrow-left me-2"></i>
                  Back to Seats
                </button>
              </div>

              <div v-for="(passenger, index) in passengers" :key="index" class="border-bottom pb-4 mb-4">
                <h4 class="h5 mb-3">Passenger {{ index + 1 }}</h4>

                <div class="row g-3 mb-3">
                  <div class="col-md-3">
                    <label :for="`title-${index}`" class="form-label fw-semibold">Title</label>
                    <select
                      :id="`title-${index}`"
                      v-model="passenger.title"
                      class="form-select"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>

                  <div class="col-md-3">
                    <label :for="`firstName-${index}`" class="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      :id="`firstName-${index}`"
                      v-model="passenger.firstName"
                      placeholder="Enter first name"
                      class="form-control"
                      required
                    >
                  </div>

                  <div class="col-md-3">
                    <label :for="`lastName-${index}`" class="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      :id="`lastName-${index}`"
                      v-model="passenger.lastName"
                      placeholder="Enter last name"
                      class="form-control"
                      required
                    >
                  </div>

                  <div class="col-md-3">
                    <label :for="`gender-${index}`" class="form-label fw-semibold">Gender</label>
                    <select
                      :id="`gender-${index}`"
                      v-model="passenger.gender"
                      class="form-select"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-md-4">
                    <label :for="`dob-${index}`" class="form-label fw-semibold">Date of Birth</label>
                    <input
                      type="date"
                      :id="`dob-${index}`"
                      v-model="passenger.dateOfBirth"
                      class="form-control"
                      :max="maxDob"
                      required
                    >
                  </div>

                  <div class="col-md-4">
                    <label :for="`nationality-${index}`" class="form-label fw-semibold">Nationality</label>
                    <select
                      :id="`nationality-${index}`"
                      v-model="passenger.nationality"
                      class="form-select"
                      required
                    >
                      <option value="">Select</option>
                      <option value="PH">Philippines</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="SG">Singapore</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label :for="`passport-${index}`" class="form-label fw-semibold">
                      Passport Number
                      <small class="text-muted">(Optional for local flights)</small>
                    </label>
                    <input
                      type="text"
                      :id="`passport-${index}`"
                      v-model="passenger.passportNumber"
                      placeholder="Enter passport number"
                      class="form-control"
                    >
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label :for="`expiry-${index}`" class="form-label fw-semibold">
                      Passport Expiry
                      <small class="text-muted">(Optional for local flights)</small>
                    </label>
                    <input
                      type="date"
                      :id="`expiry-${index}`"
                      v-model="passenger.passportExpiry"
                      class="form-control"
                      :min="minExpiry"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div v-if="currentStep === 'passengers'" class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-envelope me-2"></i>
                Contact Information
              </h3>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label for="contactEmail" class="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    v-model="contactInfo.email"
                    placeholder="Enter email address"
                    class="form-control"
                    required
                  >
                </div>

                <div class="col-md-6">
                  <label for="contactPhone" class="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    v-model="contactInfo.phone"
                    placeholder="Enter phone number"
                    class="form-control"
                    required
                  >
                </div>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="receiveUpdates"
                  v-model="contactInfo.receiveUpdates"
                >
                <label class="form-check-label fw-semibold" for="receiveUpdates">
                  I would like to receive booking updates and travel deals via email
                </label>
              </div>
            </div>
          </div>

          <!-- Special Requests -->
          <div v-if="currentStep === 'passengers'" class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-chat-dots me-2"></i>
                Special Requests (Optional)
              </h3>

              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> Passport information is optional for domestic flights within the Philippines. International flights will require valid passport details.
              </div>

              <div class="mb-3">
                <label for="requests" class="form-label fw-semibold">Special Requests</label>
                <textarea
                  id="requests"
                  v-model="specialRequests"
                  placeholder="Any special requests or notes..."
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Sidebar -->
        <div class="col-lg-4">
          <!-- Price Breakdown -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-receipt me-2"></i>
                Price Breakdown
              </h3>

              <div class="d-flex justify-content-between mb-2">
                <span>Flight ({{ searchQuery.passengers }} passenger{{ searchQuery.passengers > 1 ? 's' : '' }})</span>
                <span>₱{{ flight.price * parseInt(searchQuery.passengers) }}</span>
              </div>

              <div v-if="seatPrice > 0" class="d-flex justify-content-between mb-2">
                <span>Seat Selection</span>
                <span>₱{{ seatPrice }}</span>
              </div>

              <div class="d-flex justify-content-between mb-3">
                <span>Taxes & Fees</span>
                <span>₱{{ taxesAndFees }}</span>
              </div>

              <hr>

              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">Total</span>
                <span class="h5 text-primary mb-0">₱{{ totalPrice }}</span>
              </div>
            </div>
          </div>

          <!-- Booking Actions -->
          <div class="d-grid gap-2 mb-4">
            <button
              @click="handleProceedToPayment"
              class="btn btn-primary"
              :disabled="!isFormValid || loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i class="bi bi-credit-card me-2"></i>
              Proceed to Payment
            </button>

            <button @click="$router.go(-1)" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Back to Results
            </button>
          </div>

          <!-- Terms and Conditions -->
          <div class="alert alert-light text-center">
            <small class="text-muted">
              By proceeding, you agree to our
              <a href="#" class="text-primary text-decoration-none">Terms & Conditions</a> and
              <a href="#" class="text-primary text-decoration-none">Privacy Policy</a>
            </small>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-5">
        <h3 class="text-muted mb-3">Unable to load booking details</h3>
        <p class="text-muted mb-4">Please try again or contact support</p>
        <button @click="$router.go(-1)" class="btn btn-primary">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script>
import SeatSelection from '../components/SeatSelection.vue'

export default {
  name: 'Booking',
  components: {
    SeatSelection
  },
  data() {
    return {
      currentStep: 'seats', // seats, passengers, payment
      flight: null, // Start as null to prevent template errors
      searchQuery: {},
      passengers: [],
      selectedSeats: [],
      seatPrice: 0,
      contactInfo: {
        email: '',
        phone: '',
        receiveUpdates: true
      },
      specialRequests: '',
      loading: true, // Start as loading
      maxDob: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      minExpiry: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  computed: {
    taxesAndFees() {
      return Math.round(this.flight.price * parseInt(this.searchQuery.passengers) * 0.15)
    },
    totalPrice() {
      return this.flight.price * parseInt(this.searchQuery.passengers) + this.taxesAndFees + this.seatPrice
    },
    isFormValid() {
      return this.passengers.every(p =>
        p.title && p.firstName && p.lastName && p.dateOfBirth &&
        p.gender && p.nationality
      ) && this.contactInfo.email && this.contactInfo.phone
    }
  },
  mounted() {
    console.log('Booking component mounted')
    console.log('Route params:', this.$route.params)
    console.log('Route query:', this.$route.query)
    this.loadBookingData()
  },
  methods: {
    loadBookingData() {
      // Get flight data from route params/query
      const flightId = this.$route.params.id
      const searchQuery = this.$route.query

      console.log('Loading booking data for flight:', flightId)
      console.log('Search query:', searchQuery)

      // Mock flight data - in real app, fetch from API
      this.flight = {
        id: flightId,
        airline: 'Philippine Airlines',
        flightNumber: 'PAL101',
        departure: {
          time: '10:30',
          airport: 'MNL',
          city: searchQuery.from || 'Manila',
          date: searchQuery.departureDate
        },
        arrival: {
          time: '14:45',
          airport: 'CEB',
          city: searchQuery.to || 'Cebu',
          date: searchQuery.departureDate
        },
        duration: '4h 15m',
        price: 1200,
        stops: 0,
        class: searchQuery.class || 'economy'
      }

      this.searchQuery = searchQuery

      console.log('Flight data loaded:', this.flight)

      // Initialize passenger forms
      const passengerCount = parseInt(searchQuery.passengers) || 1
      this.passengers = Array.from({ length: passengerCount }, () => ({
        title: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        passportNumber: '',
        passportExpiry: ''
      }))

      console.log('Passengers initialized:', this.passengers)

      // Set loading to false after data is loaded
      this.loading = false
    },

    proceedToPayment() {
      if (!this.isFormValid) {
        alert('Please fill in all required fields')
        return
      }

      this.loading = true

      // Simulate processing
      setTimeout(() => {
        this.loading = false

        // Navigate to payment page
        this.$router.push({
          name: 'Payment',
          params: { id: this.flight.id },
          query: {
            ...this.searchQuery,
            passengers: JSON.stringify(this.passengers),
            contactInfo: JSON.stringify(this.contactInfo),
            specialRequests: this.specialRequests,
            selectedSeats: JSON.stringify(this.selectedSeats),
            seatPrice: this.seatPrice,
            totalPrice: this.totalPrice
          }
        })
      }, 1000)
    },

    handleSeatsSelected(seatData) {
      console.log('Seats selected:', seatData)
      this.selectedSeats = seatData.seats
      this.seatPrice = seatData.totalPrice
      console.log('Updated selectedSeats:', this.selectedSeats)
      console.log('Updated seatPrice:', this.seatPrice)
    },

    continueToPassengers() {
      console.log('Continue to Passengers clicked')
      console.log('Current selectedSeats:', this.selectedSeats)
      console.log('Selected seats length:', this.selectedSeats.length)

      if (this.selectedSeats.length === 0) {
        alert('Please select at least one seat to continue')
        return
      }

      this.currentStep = 'passengers'
      console.log('Step changed to passengers')
    },

    skipSeatSelection() {
      console.log('Skip Seat Selection clicked')
      // Auto-select seats for testing
      this.selectedSeats = ['1A'] // Default seat selection
      this.seatPrice = 0 // No additional cost for economy
      this.currentStep = 'passengers'
      console.log('Skipped seat selection, auto-selected seat 1A')
    },

    handleProceedToPayment() {
      console.log('Proceed to Payment clicked')
      console.log('isFormValid:', this.isFormValid)
      console.log('loading:', this.loading)

      if (!this.isFormValid) {
        alert('Please fill in all required fields')
        return
      }

      this.proceedToPayment()
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
/* Custom flight path line */
.border-top.border-2 {
  border-color: #dee2e6 !important;
}

/* Enhanced card styling */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* Alert styling */
.alert {
  border-radius: 0.5rem;
}

/* Form styling */
.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
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

  .row.g-3 {
    --bs-gutter-x: 0.5rem;
  }

  .row.align-items-center.mb-3 .col {
    margin-bottom: 0.5rem;
  }

  .row.align-items-center.mb-3 .col-auto {
    margin-bottom: 1rem;
  }

  .d-flex.gap-2 {
    flex-direction: column;
  }

  .d-flex.gap-2 .btn {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 575.98px) {
  .display-5 {
    font-size: 1.75rem;
  }

  .lead {
    font-size: 1rem;
  }

  .h4 {
    font-size: 1.1rem;
  }

  .h5 {
    font-size: 1.25rem;
  }
}
</style>
