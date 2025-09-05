<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary text-white py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h1 class="display-4 fw-bold mb-4">Find Your Perfect Flight</h1>
            <p class="lead mb-5">
              Discover amazing deals on flights worldwide. Book with confidence and travel with ease.
            </p>

            <!-- Quick Search Form -->
            <div class="card shadow-lg">
              <div class="card-body p-4">
                <form @submit.prevent="handleQuickSearch">
                  <div class="row g-3">
                    <div class="col-md-6 col-lg-3">
                      <label for="from" class="form-label fw-semibold">From</label>
                      <input
                        type="text"
                        id="from"
                        v-model="searchForm.from"
                        placeholder="Departure city"
                        class="form-control"
                        required
                      >
                    </div>

                    <div class="col-md-6 col-lg-3">
                      <label for="to" class="form-label fw-semibold">To</label>
                      <input
                        type="text"
                        id="to"
                        v-model="searchForm.to"
                        placeholder="Arrival city"
                        class="form-control"
                        required
                      >
                    </div>

                    <div class="col-md-6 col-lg-3">
                      <label for="departure" class="form-label fw-semibold">Departure</label>
                      <input
                        type="date"
                        id="departure"
                        v-model="searchForm.departureDate"
                        class="form-control"
                        :min="today"
                        required
                      >
                    </div>

                    <div class="col-md-6 col-lg-3">
                      <label for="return" class="form-label fw-semibold">Return</label>
                      <input
                        type="date"
                        id="return"
                        v-model="searchForm.returnDate"
                        class="form-control"
                        :min="searchForm.departureDate || today"
                      >
                    </div>

                    <div class="col-md-6">
                      <label for="passengers" class="form-label fw-semibold">Passengers</label>
                      <select
                        id="passengers"
                        v-model="searchForm.passengers"
                        class="form-control"
                      >
                        <option value="1">1 Passenger</option>
                        <option value="2">2 Passengers</option>
                        <option value="3">3 Passengers</option>
                        <option value="4">4 Passengers</option>
                        <option value="5">5+ Passengers</option>
                      </select>
                    </div>

                    <div class="col-md-6">
                      <label for="class" class="form-label fw-semibold">Class</label>
                      <select
                        id="class"
                        v-model="searchForm.class"
                        class="form-control"
                      >
                        <option value="economy">Economy</option>
                        <option value="premium">Premium Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                  </div>

                  <div class="text-center mt-4">
                    <button type="submit" class="btn btn-light btn-lg px-5">
                      <span class="me-2">🔍</span>
                      Search Flights
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-5 fw-bold mb-3">Why Choose AirBook?</h2>
            <p class="lead text-muted">Experience the best in flight booking with our premium features</p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <div class="fs-1 mb-3">✈️</div>
                <h5 class="card-title fw-bold">Best Price Guarantee</h5>
                <p class="card-text text-muted">Find the lowest fares with our price match promise</p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <div class="fs-1 mb-3">🛡️</div>
                <h5 class="card-title fw-bold">Secure Booking</h5>
                <p class="card-text text-muted">Your data is protected with bank-level security</p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <div class="fs-1 mb-3">📱</div>
                <h5 class="card-title fw-bold">24/7 Support</h5>
                <p class="card-text text-muted">Get help anytime with our customer support team</p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm text-center">
              <div class="card-body">
                <div class="fs-1 mb-3">🤖</div>
                <h5 class="card-title fw-bold">AI Assistant</h5>
                <p class="card-text text-muted">Let our AI chatbot help you find the perfect flight</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Destinations -->
    <section class="py-5">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-5 fw-bold mb-3">Popular Destinations</h2>
            <p class="lead text-muted">Explore the Philippines and beyond</p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="destination in popularDestinations" :key="destination.id">
            <div class="card border-0 shadow-sm h-100">
              <div class="position-relative">
                <img :src="destination.image" :alt="destination.name" class="card-img-top" style="height: 250px; object-fit: cover;">
                <div class="card-img-overlay d-flex flex-column justify-content-end text-white" style="background: linear-gradient(transparent, rgba(0,0,0,0.7));">
                  <h5 class="card-title fw-bold mb-1">{{ destination.name }}</h5>
                  <p class="card-text mb-2">{{ destination.country }}</p>
                  <span class="badge bg-primary fs-6">From ₱{{ destination.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary text-white py-5">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h2 class="display-5 fw-bold mb-3">Ready to Start Your Journey?</h2>
            <p class="lead mb-4">Join millions of travelers who trust AirBook for their flight bookings</p>
            <router-link to="/search" class="btn btn-light btn-lg px-5">Start Booking Now</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      today: new Date().toISOString().split('T')[0],
      searchForm: {
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        passengers: '1',
        class: 'economy'
      },
      popularDestinations: [
        {
          id: 1,
          name: 'Cebu',
          country: 'Philippines',
          price: 1200,
          image: 'https://images.unsplash.com/photo-1559638376-f6ba1a3e8e6c?w=400&h=300&fit=crop'
        },
        {
          id: 2,
          name: 'Boracay',
          country: 'Philippines',
          price: 1800,
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
        },
        {
          id: 3,
          name: 'Davao',
          country: 'Philippines',
          price: 1500,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
        },
        {
          id: 4,
          name: 'Puerto Princesa',
          country: 'Philippines',
          price: 2000,
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'
        },
        {
          id: 5,
          name: 'Singapore',
          country: 'Singapore',
          price: 3800,
          image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&h=300&fit=crop'
        },
        {
          id: 6,
          name: 'Hong Kong',
          country: 'Hong Kong',
          price: 4500,
          image: 'https://images.unsplash.com/photo-1536599018102-9a12bec293b3?w=400&h=300&fit=crop'
        }
      ]
    }
  },
  methods: {
    handleQuickSearch() {
      if (!this.searchForm.from || !this.searchForm.to || !this.searchForm.departureDate) {
        alert('Please fill in all required fields')
        return
      }

      this.$router.push({
        name: 'FlightSearch',
        query: { ...this.searchForm }
      })
    }
  }
}
</script>

<style scoped>
/* Custom hero background with gradient */
.bg-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
}

/* Card hover effects */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
}

/* Destination card image overlay */
.card-img-overlay {
  background: linear-gradient(transparent, rgba(0,0,0,0.7)) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .display-4 {
    font-size: 2rem;
  }

  .display-5 {
    font-size: 2rem;
  }

  .lead {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .display-4 {
    font-size: 1.75rem;
  }

  .display-5 {
    font-size: 1.5rem;
  }

  .py-5 {
    padding: 3rem 0 !important;
  }
}
</style>
