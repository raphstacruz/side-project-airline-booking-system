<template>
  <div class="py-4">
    <div class="container">
      <!-- Page Header -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h1 class="display-5 fw-bold mb-3">
            <i class="bi bi-shield-check me-2"></i>
            Secure Payment
          </h1>
          <p class="lead text-muted">Complete your booking with secure payment</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading payment details...</p>
      </div>

      <!-- Main Content -->
      <div v-else-if="flight" class="row g-4">
        <!-- Payment Form -->
        <div class="col-lg-8">
          <!-- Payment Methods -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-credit-card me-2"></i>
                Payment Method
              </h3>

              <div class="mb-3">
                <div class="form-check mb-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="credit"
                    value="credit"
                    v-model="paymentMethod"
                  >
                  <label class="form-check-label d-flex align-items-center" for="credit">
                    <i class="bi bi-credit-card me-2"></i>
                    <div>
                      <div class="fw-semibold">Credit/Debit Card</div>
                      <small class="text-muted">Visa, MasterCard, American Express</small>
                    </div>
                  </label>
                </div>

                <div class="form-check mb-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="paypal"
                    value="paypal"
                    v-model="paymentMethod"
                  >
                  <label class="form-check-label d-flex align-items-center" for="paypal">
                    <i class="bi bi-paypal me-2"></i>
                    <div>
                      <div class="fw-semibold">PayPal</div>
                      <small class="text-muted">Pay with your PayPal account</small>
                    </div>
                  </label>
                </div>

                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="bank"
                    value="bank"
                    v-model="paymentMethod"
                  >
                  <label class="form-check-label d-flex align-items-center" for="bank">
                    <i class="bi bi-bank me-2"></i>
                    <div>
                      <div class="fw-semibold">Bank Transfer</div>
                      <small class="text-muted">Direct bank transfer</small>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Credit Card Form -->
          <div v-if="paymentMethod === 'credit'" class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-credit-card me-2"></i>
                Card Details
              </h3>

              <div class="mb-3">
                <label for="cardNumber" class="form-label fw-semibold">Card Number</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-credit-card"></i></span>
                  <input
                    type="text"
                    id="cardNumber"
                    v-model="cardDetails.number"
                    placeholder="1234 5678 9012 3456"
                    class="form-control"
                    maxlength="19"
                    @input="formatCardNumber"
                    required
                  >
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Expiry Date</label>
                  <div class="row g-2">
                    <div class="col-6">
                      <select
                        id="expiryMonth"
                        v-model="cardDetails.expiryMonth"
                        class="form-select"
                        required
                      >
                        <option value="">MM</option>
                        <option v-for="month in 12" :key="month" :value="month.toString().padStart(2, '0')">
                          {{ month.toString().padStart(2, '0') }}
                        </option>
                      </select>
                    </div>
                    <div class="col-6">
                      <select
                        id="expiryYear"
                        v-model="cardDetails.expiryYear"
                        class="form-select"
                        required
                      >
                        <option value="">YYYY</option>
                        <option v-for="year in 10" :key="year" :value="(new Date().getFullYear() + year - 1)">
                          {{ new Date().getFullYear() + year - 1 }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="cvv" class="form-label fw-semibold">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    v-model="cardDetails.cvv"
                    placeholder="123"
                    class="form-control"
                    maxlength="4"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="cardName" class="form-label fw-semibold">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  v-model="cardDetails.name"
                  placeholder="John Doe"
                  class="form-control"
                  required
                >
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="saveCard"
                  v-model="cardDetails.saveCard"
                >
                <label class="form-check-label fw-semibold" for="saveCard">
                  Save this card for future payments
                </label>
              </div>
            </div>
          </div>

          <!-- PayPal Section -->
          <div v-if="paymentMethod === 'paypal'" class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-paypal me-2"></i>
                PayPal Payment
              </h3>
              <p class="mb-3">You will be redirected to PayPal to complete your payment securely.</p>
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>PayPal</strong><br>
                Safe and secure payment processing
              </div>
            </div>
          </div>

          <!-- Bank Transfer Section -->
          <div v-if="paymentMethod === 'bank'" class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-bank me-2"></i>
                Bank Transfer
              </h3>
              <p class="mb-3">Transfer funds directly from your bank account.</p>

              <div class="row g-2 mb-3">
                <div class="col-sm-6">
                  <small class="text-muted d-block">Bank Name</small>
                  <span class="fw-semibold">AirBook Bank</span>
                </div>
                <div class="col-sm-6">
                  <small class="text-muted d-block">Account Number</small>
                  <span class="fw-semibold">1234-5678-9012</span>
                </div>
                <div class="col-sm-6">
                  <small class="text-muted d-block">Routing Number</small>
                  <span class="fw-semibold">123456789</span>
                </div>
                <div class="col-sm-6">
                  <small class="text-muted d-block">Reference</small>
                  <span class="fw-semibold">{{ bookingReference }}</span>
                </div>
              </div>

              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Please include the reference number in your transfer to ensure proper processing.
              </div>
            </div>
          </div>

          <!-- Billing Address -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-geo-alt me-2"></i>
                Billing Address
              </h3>

              <div class="mb-3">
                <label for="billingAddress" class="form-label fw-semibold">Address</label>
                <input
                  type="text"
                  id="billingAddress"
                  v-model="billingAddress.address"
                  placeholder="Street address"
                  class="form-control"
                  required
                >
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label for="billingCity" class="form-label fw-semibold">City</label>
                  <input
                    type="text"
                    id="billingCity"
                    v-model="billingAddress.city"
                    placeholder="City"
                    class="form-control"
                    required
                  >
                </div>

                <div class="col-md-3">
                  <label for="billingState" class="form-label fw-semibold">State/Province</label>
                  <input
                    type="text"
                    id="billingState"
                    v-model="billingAddress.state"
                    placeholder="State or Province"
                    class="form-control"
                    required
                  >
                </div>

                <div class="col-md-3">
                  <label for="billingZip" class="form-label fw-semibold">ZIP/Postal Code</label>
                  <input
                    type="text"
                    id="billingZip"
                    v-model="billingAddress.zipCode"
                    placeholder="ZIP or Postal Code"
                    class="form-control"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="billingCountry" class="form-label fw-semibold">Country</label>
                <select
                  id="billingCountry"
                  v-model="billingAddress.country"
                  class="form-select"
                  required
                >
                  <option value="">Select Country</option>
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
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="bi bi-receipt me-2"></i>
                Order Summary
              </h3>

              <!-- Flight Details -->
              <div class="border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center mb-2">
                  <span class="fw-semibold">{{ flight.departure.city }}</span>
                  <i class="bi bi-arrow-right mx-2 text-primary"></i>
                  <span class="fw-semibold">{{ flight.arrival.city }}</span>
                </div>
                <div class="small text-muted mb-1">{{ formatDate(flight.departure.date) }}</div>
                <div class="small text-muted">{{ flight.airline }} • {{ flight.flightNumber }} • {{ flight.class }}</div>
              </div>

              <!-- Passengers -->
              <div class="border-bottom pb-3 mb-3">
                <h5 class="mb-2">Passengers</h5>
                <div v-for="(passenger, index) in passengers" :key="index" class="small mb-1">
                  {{ passenger.title }} {{ passenger.firstName }} {{ passenger.lastName }}
                </div>
              </div>

              <!-- Price Breakdown -->
              <div>
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
                  <span class="fw-bold">Total</span>
                  <span class="h5 text-primary mb-0">₱{{ totalPrice }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Actions -->
          <div class="d-grid gap-2 mb-4">
            <button
              @click="processPayment"
              class="btn btn-primary"
              :disabled="!isFormValid || loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i class="bi bi-lock me-2"></i>
              {{ paymentMethod === 'credit' ? 'Pay ₱' + totalPrice : 'Continue to ' + getPaymentMethodName() }}
            </button>

            <button @click="$router.go(-1)" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Back to Booking
            </button>
          </div>

          <!-- Security Notice -->
          <div class="alert alert-light text-center">
            <i class="bi bi-shield-check me-2"></i>
            <small class="text-muted">Your payment information is encrypted and secure</small>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-5">
        <h3 class="text-muted mb-3">Unable to load payment details</h3>
        <p class="text-muted mb-4">Please try again or contact support</p>
        <button @click="$router.go(-1)" class="btn btn-primary">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Payment',
  data() {
    return {
      paymentMethod: 'credit',
      cardDetails: {
        number: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        name: '',
        saveCard: false
      },
      billingAddress: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      flight: null, // Start as null to prevent template errors
      passengers: [],
      searchQuery: {},
      contactInfo: {},
      specialRequests: '',
      totalPrice: 0,
      loading: true, // Start as loading
      bookingReference: 'AB' + Date.now().toString().slice(-8)
    }
  },
  computed: {
    taxesAndFees() {
      return Math.round(this.flight.price * this.passengers.length * 0.15)
    },
    cardType() {
      const number = this.cardDetails.number.replace(/\s/g, '')
      if (number.startsWith('4')) return 'visa'
      if (number.startsWith('5') || number.startsWith('2')) return 'mastercard'
      if (number.startsWith('3')) return 'amex'
      return ''
    },
    isFormValid() {
      if (this.paymentMethod === 'credit') {
        return this.cardDetails.number && this.cardDetails.expiryMonth &&
               this.cardDetails.expiryYear && this.cardDetails.cvv &&
               this.cardDetails.name && this.billingAddress.address &&
               this.billingAddress.city && this.billingAddress.state &&
               this.billingAddress.zipCode && this.billingAddress.country
      }
      return this.billingAddress.address && this.billingAddress.city &&
             this.billingAddress.state && this.billingAddress.zipCode &&
             this.billingAddress.country
    }
  },
  mounted() {
    console.log('Payment component mounted')
    console.log('Route params:', this.$route.params)
    console.log('Route query:', this.$route.query)
    this.loadPaymentData()
  },
  methods: {
    loadPaymentData() {
      // Get data from route query
      const query = this.$route.query

      console.log('Loading payment data from query:', query)

      try {
        // Mock flight data - in real app, fetch from API
        this.flight = {
          airline: 'Philippine Airlines',
          flightNumber: 'PAL101',
          departure: {
            city: query.from || 'Manila',
            date: query.departureDate
          },
          arrival: {
            city: query.to || 'Cebu'
          },
          price: 1200,
          class: query.class || 'economy'
        }

        this.searchQuery = query

        // Safely parse JSON data
        try {
          this.passengers = JSON.parse(query.passengers || '[]')
          console.log('Parsed passengers:', this.passengers)
        } catch (e) {
          console.error('Error parsing passengers:', e)
          this.passengers = []
        }

        try {
          this.contactInfo = JSON.parse(query.contactInfo || '{}')
          console.log('Parsed contactInfo:', this.contactInfo)
        } catch (e) {
          console.error('Error parsing contactInfo:', e)
          this.contactInfo = {}
        }

        this.specialRequests = query.specialRequests || ''
        this.totalPrice = parseInt(query.totalPrice) || 0

        console.log('Payment data loaded successfully')
        console.log('Flight:', this.flight)
        console.log('Total price:', this.totalPrice)

        // Set loading to false after data is loaded
        this.loading = false

      } catch (error) {
        console.error('Error in loadPaymentData:', error)
        this.loading = false
      }
    },

    formatCardNumber() {
      // Format card number with spaces
      let value = this.cardDetails.number.replace(/\s/g, '')
      value = value.replace(/(\d{4})/g, '$1 ').trim()
      this.cardDetails.number = value
    },

    getPaymentMethodName() {
      switch (this.paymentMethod) {
        case 'paypal': return 'PayPal'
        case 'bank': return 'Bank Transfer'
        default: return 'Payment'
      }
    },

    async processPayment() {
      if (!this.isFormValid) {
        alert('Please fill in all required fields')
        return
      }

      this.loading = true

      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Navigate to confirmation page
        this.$router.push({
          name: 'Confirmation',
          params: { id: this.$route.params.id },
          query: {
            bookingReference: this.bookingReference,
            totalPrice: this.totalPrice,
            paymentMethod: this.paymentMethod
          }
        })
      } catch (error) {
        console.error('Payment error:', error)
        alert('Payment failed. Please try again.')
      } finally {
        this.loading = false
      }
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
/* Custom card styling */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* Form styling */
.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Input group styling */
.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* Alert styling */
.alert {
  border-radius: 0.5rem;
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

  .row.g-3 {
    --bs-gutter-x: 0.5rem;
  }

  .row.g-2 {
    --bs-gutter-x: 0.5rem;
  }

  .form-check-label {
    font-size: 0.9rem;
  }

  .d-flex.align-items-center {
    flex-direction: column;
    text-align: center;
  }

  .d-flex.align-items-center .me-2 {
    margin-bottom: 0.5rem;
    margin-right: 0 !important;
  }
}

@media (max-width: 575.98px) {
  .display-5 {
    font-size: 1.75rem;
  }

  .h5 {
    font-size: 1.25rem;
  }

  .btn {
    font-size: 0.9rem;
  }
}
</style>
