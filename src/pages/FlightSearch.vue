<template>
  <div class="py-4">
    <div class="container">
      <!-- Page Header -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h1 class="display-5 fw-bold mb-3">Search Flights</h1>
          <p class="lead text-muted">Find the perfect flight for your journey</p>
        </div>
      </div>

      <!-- Search Form -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-10">
          <div class="card shadow">
            <div class="card-body p-4">
              <form @submit.prevent="handleSearch">
                <!-- Trip Type -->
                <div class="mb-4">
                  <div class="btn-group w-100" role="group">
                    <input
                      type="radio"
                      class="btn-check"
                      id="roundtrip"
                      value="roundtrip"
                      v-model="searchForm.tripType"
                    >
                    <label class="btn btn-outline-primary" for="roundtrip">Round Trip</label>

                    <input
                      type="radio"
                      class="btn-check"
                      id="oneway"
                      value="oneway"
                      v-model="searchForm.tripType"
                    >
                    <label class="btn btn-outline-primary" for="oneway">One Way</label>

                    <input
                      type="radio"
                      class="btn-check"
                      id="multicity"
                      value="multicity"
                      v-model="searchForm.tripType"
                    >
                    <label class="btn btn-outline-primary" for="multicity">Multi-City</label>
                  </div>
                </div>

                <!-- Main Search Fields -->
                <div class="row g-3 mb-4">
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

                  <div class="col-md-6 col-lg-3" v-if="searchForm.tripType === 'roundtrip'">
                    <label for="return" class="form-label fw-semibold">Return</label>
                    <input
                      type="date"
                      id="return"
                      v-model="searchForm.returnDate"
                      class="form-control"
                      :min="searchForm.departureDate || today"
                      required
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

                <!-- Advanced Options -->
                <div class="mb-4">
                  <button
                    type="button"
                    @click="showAdvanced = !showAdvanced"
                    class="btn btn-outline-secondary mb-3"
                  >
                    {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Options
                    <span class="ms-2">{{ showAdvanced ? '▲' : '▼' }}</span>
                  </button>

                  <div v-if="showAdvanced" class="border rounded p-3 bg-light">
                    <div class="row g-3 mb-3">
                      <div class="col-md-4">
                        <label for="airlines" class="form-label fw-semibold">Preferred Airlines</label>
                        <select
                          id="airlines"
                          v-model="searchForm.preferredAirlines"
                          class="form-select"
                          multiple
                        >
                          <option value="any">Any Airline</option>
                          <option value="pal">Philippine Airlines</option>
                          <option value="cebupac">Cebu Pacific</option>
                          <option value="airasia">AirAsia Philippines</option>
                          <option value="palexpress">PAL Express</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label for="maxStops" class="form-label fw-semibold">Max Stops</label>
                        <select
                          id="maxStops"
                          v-model="searchForm.maxStops"
                          class="form-select"
                        >
                          <option value="any">Any number of stops</option>
                          <option value="0">Nonstop only</option>
                          <option value="1">Up to 1 stop</option>
                          <option value="2">Up to 2 stops</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label for="maxPrice" class="form-label fw-semibold">Max Price</label>
                        <div class="input-group">
                          <span class="input-group-text">₱</span>
                          <input
                            type="number"
                            id="maxPrice"
                            v-model="searchForm.maxPrice"
                            placeholder="No limit"
                            class="form-control"
                            min="0"
                          >
                        </div>
                      </div>
                    </div>

                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="flexibleDates"
                        v-model="searchForm.flexibleDates"
                      >
                      <label class="form-check-label fw-semibold" for="flexibleDates">
                        My dates are flexible (±3 days)
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Search Actions -->
                <div class="row g-3">
                  <div class="col-md-6">
                    <button
                      type="submit"
                      class="btn btn-primary w-100"
                      :disabled="loading"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      <span class="me-2">🔍</span>
                      {{ loading ? 'Searching...' : 'Search Flights' }}
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      type="button"
                      @click="clearForm"
                      class="btn btn-outline-secondary w-100"
                    >
                      Clear Form
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Routes -->
      <div class="mb-5">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <h2 class="h3 fw-bold mb-4 text-center">Popular Routes</h2>
            <div class="row g-3">
              <div
                v-for="route in popularRoutes"
                :key="route.id"
                class="col-md-6 col-lg-4"
              >
                <div class="card h-100 cursor-pointer" @click="selectRoute(route)">
                  <div class="card-body text-center">
                    <div class="mb-2">
                      <span class="fw-semibold">{{ route.from }}</span>
                      <span class="mx-2">→</span>
                      <span class="fw-semibold">{{ route.to }}</span>
                    </div>
                    <div class="text-primary fw-bold">From ₱{{ route.price }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Searches -->
      <div v-if="recentSearches.length > 0" class="row justify-content-center">
        <div class="col-lg-8">
          <h3 class="h4 fw-bold mb-3 text-center">Recent Searches</h3>
          <div class="row g-3">
            <div
              v-for="(search, index) in recentSearches"
              :key="index"
              class="col-md-6"
            >
              <div class="card cursor-pointer" @click="repeatSearch(search)">
                <div class="card-body">
                  <div class="fw-semibold mb-1">
                    {{ search.from }} → {{ search.to }}
                  </div>
                  <div class="text-muted small mb-1">
                    {{ formatDate(search.departureDate) }}
                    <span v-if="search.returnDate"> - {{ formatDate(search.returnDate) }}</span>
                  </div>
                  <div class="text-muted small">
                    {{ search.passengers }} passenger{{ search.passengers > 1 ? 's' : '' }} • {{ search.class }}
                  </div>
                </div>
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
  name: 'FlightSearch',
  data() {
    return {
      today: new Date().toISOString().split('T')[0],
      showAdvanced: false,
      loading: false,
      searchForm: {
        tripType: 'roundtrip',
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        passengers: '1',
        class: 'economy',
        preferredAirlines: [],
        maxStops: 'any',
        maxPrice: '',
        flexibleDates: false
      },
      popularRoutes: [
        { id: 1, from: 'Manila', to: 'Cebu', price: 1200 },
        { id: 2, from: 'Manila', to: 'Davao', price: 1500 },
        { id: 3, from: 'Manila', to: 'Boracay', price: 1800 },
        { id: 4, from: 'Cebu', to: 'Manila', price: 1200 },
        { id: 5, from: 'Manila', to: 'Singapore', price: 3800 },
        { id: 6, from: 'Manila', to: 'Hong Kong', price: 4500 }
      ],
      recentSearches: []
    }
  },
  mounted() {
    // Load recent searches from localStorage
    this.loadRecentSearches()

    // Pre-fill form if coming from home page quick search
    if (this.$route.query.from) {
      this.searchForm = { ...this.searchForm, ...this.$route.query }
    }
  },
  methods: {
    async handleSearch() {
      if (!this.searchForm.from || !this.searchForm.to || !this.searchForm.departureDate) {
        alert('Please fill in all required fields')
        return
      }

      if (this.searchForm.tripType === 'roundtrip' && !this.searchForm.returnDate) {
        alert('Please select a return date for round trip')
        return
      }

      this.loading = true

      try {
        // Save to recent searches
        this.saveRecentSearch()

        // Navigate to results
        this.$router.push({
          name: 'FlightResults',
          query: { ...this.searchForm }
        })
      } catch (error) {
        console.error('Search error:', error)
        alert('An error occurred while searching. Please try again.')
      } finally {
        this.loading = false
      }
    },

    clearForm() {
      this.searchForm = {
        tripType: 'roundtrip',
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        passengers: '1',
        class: 'economy',
        preferredAirlines: [],
        maxStops: 'any',
        maxPrice: '',
        flexibleDates: false
      }
      this.showAdvanced = false
    },

    selectRoute(route) {
      this.searchForm.from = route.from
      this.searchForm.to = route.to
      // Scroll to form
      document.querySelector('.search-form').scrollIntoView({ behavior: 'smooth' })
    },

    saveRecentSearch() {
      const search = { ...this.searchForm, timestamp: Date.now() }
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      recent.unshift(search)
      // Keep only last 5 searches
      if (recent.length > 5) recent.pop()
      localStorage.setItem('recentSearches', JSON.stringify(recent))
      this.recentSearches = recent
    },

    loadRecentSearches() {
      try {
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      } catch (error) {
        console.error('Error loading recent searches:', error)
        this.recentSearches = []
      }
    },

    repeatSearch(search) {
      this.searchForm = { ...search }
      delete this.searchForm.timestamp
      this.handleSearch()
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.flight-search {
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

/* Search Form */
.search-form {
  margin-bottom: 3rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.search-form-content {
  padding: 2rem;
}

.trip-type {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--gray-700);
}

.search-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}


.form-control {
  padding: 0.875rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

/* Advanced Options */
.advanced-options {
  margin-bottom: 2rem;
}

.advanced-toggle {
  width: 100%;
  justify-content: center;
}

.advanced-fields {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--gray-50);
  border-radius: var(--border-radius);
}

.advanced-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.flexible-dates {
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--gray-700);
}

/* Search Actions */
.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.search-btn {
  padding: 1rem 3rem;
  font-size: 1.125rem;
  font-weight: 600;
  min-width: 200px;
}

.clear-btn {
  padding: 1rem 2rem;
}

.small.spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

/* Popular Routes */
.popular-routes {
  margin-bottom: 3rem;
}

.popular-routes h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--gray-900);
  margin-bottom: 2rem;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.route-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  cursor: pointer;
  transition: var(--transition);
}

.route-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.route-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-cities {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--gray-900);
}

.arrow {
  color: var(--primary-color);
}

.route-price {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.125rem;
}

/* Recent Searches */
.recent-searches {
  max-width: 800px;
  margin: 0 auto;
}

.recent-searches h3 {
  text-align: center;
  font-size: 1.5rem;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-item {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  cursor: pointer;
  transition: var(--transition);
}

.recent-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.recent-route {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.recent-date {
  color: var(--gray-600);
  margin-bottom: 0.5rem;
}

.recent-details {
  color: var(--gray-500);
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .flight-search {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .search-form-content {
    padding: 1.5rem;
  }

  .trip-type {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .search-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .advanced-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .search-actions {
    flex-direction: column;
  }

  .search-btn {
    min-width: auto;
  }

  .routes-grid {
    grid-template-columns: 1fr;
  }

  .route-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .search-form-content {
    padding: 1rem;
  }

  .popular-routes h2,
  .recent-searches h3 {
    font-size: 1.25rem;
  }
}
</style>
