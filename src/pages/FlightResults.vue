<template>
  <div class="py-4">
    <div class="container">
      <!-- Search Summary -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h2 class="h4 mb-1">{{ searchQuery.from }} → {{ searchQuery.to }}</h2>
              <p class="text-muted mb-0">
                {{ formatDate(searchQuery.departureDate) }}
                <span v-if="searchQuery.returnDate"> - {{ formatDate(searchQuery.returnDate) }}</span>
                • {{ searchQuery.passengers }} passenger{{ searchQuery.passengers > 1 ? 's' : '' }}
              </p>
            </div>
            <div class="col-md-4 text-end">
              <button @click="$router.push('/search')" class="btn btn-outline-secondary">
                Modify Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Filters Sidebar -->
        <aside class="col-lg-3 mb-4">
          <div class="card sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">Filters</h5>

              <!-- Price Range -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Price Range</label>
                <input
                  type="range"
                  min="0"
                  :max="maxPrice"
                  v-model="filters.priceRange"
                  class="form-range"
                  @input="applyFilters"
                >
                <div class="d-flex justify-content-between small text-muted">
                  <span>₱0</span>
                  <span>₱{{ filters.priceRange }}</span>
                </div>
              </div>

              <!-- Airlines -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Airlines</label>
                <div class="form-check" v-for="airline in availableAirlines" :key="airline">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="airline"
                    v-model="filters.airlines"
                    @change="applyFilters"
                    :id="`airline-${airline}`"
                  >
                  <label class="form-check-label" :for="`airline-${airline}`">
                    {{ airline }}
                  </label>
                </div>
              </div>

              <!-- Stops -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Stops</label>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="any"
                    v-model="filters.stops"
                    @change="applyFilters"
                    id="stops-any"
                  >
                  <label class="form-check-label" for="stops-any">Any</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="nonstop"
                    v-model="filters.stops"
                    @change="applyFilters"
                    id="stops-nonstop"
                  >
                  <label class="form-check-label" for="stops-nonstop">Non-stop</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="1stop"
                    v-model="filters.stops"
                    @change="applyFilters"
                    id="stops-1stop"
                  >
                  <label class="form-check-label" for="stops-1stop">1 stop</label>
                </div>
              </div>

              <!-- Departure Time -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Departure Time</label>
                <div class="form-check" v-for="slot in timeSlots" :key="slot.value">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="slot.value"
                    v-model="filters.departureTime"
                    @change="applyFilters"
                    :id="`time-${slot.value}`"
                  >
                  <label class="form-check-label" :for="`time-${slot.value}`">
                    {{ slot.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results Main -->
        <main class="col-lg-9">
          <!-- Sort Options -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <div class="btn-group" role="group">
                    <button
                      v-for="option in sortOptions"
                      :key="option.value"
                      :class="['btn', sortBy === option.value ? 'btn-primary' : 'btn-outline-primary']"
                      @click="sortBy = option.value; applySorting()"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
                <div class="col-md-4 text-end">
                  <small class="text-muted">{{ filteredFlights.length }} flights found</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Searching for the best flights...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredFlights.length === 0" class="text-center py-5">
            <h3 class="text-muted mb-3">No flights found</h3>
            <p class="text-muted mb-4">Try adjusting your search criteria or dates</p>
            <button @click="$router.push('/search')" class="btn btn-primary">Modify Search</button>
          </div>

          <!-- Flight Results -->
          <div v-else class="row g-3">
            <div class="col-12" v-for="flight in filteredFlights" :key="flight.id">
              <FlightCard
                :flight="flight"
                @select-flight="handleFlightSelect"
              />
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMoreResults" class="text-center mt-4">
            <button @click="loadMore" class="btn btn-outline-secondary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Load More Flights
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import FlightCard from '../components/FlightCard.vue'

export default {
  name: 'FlightResults',
  components: {
    FlightCard
  },
  data() {
    return {
      loading: false,
      searchQuery: {},
      flights: [],
      filteredFlights: [],
      sortBy: 'price',
      filters: {
        priceRange: 2000,
        airlines: [],
        stops: 'any',
        departureTime: []
      },
      sortOptions: [
        { value: 'price', label: 'Price' },
        { value: 'duration', label: 'Duration' },
        { value: 'departure', label: 'Departure' },
        { value: 'arrival', label: 'Arrival' }
      ],
      timeSlots: [
        { value: 'morning', label: 'Morning (6AM - 12PM)' },
        { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
        { value: 'evening', label: 'Evening (6PM - 12AM)' },
        { value: 'night', label: 'Night (12AM - 6AM)' }
      ],
      hasMoreResults: false
    }
  },
  computed: {
    maxPrice() {
      return Math.max(...this.flights.map(f => f.price), 2000)
    },
    availableAirlines() {
      return [...new Set(this.flights.map(f => f.airline))]
    }
  },
  mounted() {
    this.searchQuery = this.$route.query
    this.loadFlights()
  },
  methods: {
    async loadFlights() {
      this.loading = true
      try {
        // Simulate API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock flight data
        this.flights = this.generateMockFlights()
        this.applyFilters()
        this.applySorting()
      } catch (error) {
        console.error('Error loading flights:', error)
      } finally {
        this.loading = false
      }
    },

    generateMockFlights() {
      // Philippine airlines and budget carriers
      const airlines = ['Philippine Airlines', 'Cebu Pacific', 'PAL Express', 'AirAsia Philippines']
      const philippineRoutes = [
        // Domestic routes
        { from: 'Manila', to: 'Cebu', fromCode: 'MNL', toCode: 'CEB', basePrice: 1200, duration: '1h 15m' },
        { from: 'Manila', to: 'Davao', fromCode: 'MNL', toCode: 'DVO', basePrice: 1500, duration: '2h 30m' },
        { from: 'Manila', to: 'Boracay', fromCode: 'MNL', toCode: 'MPH', basePrice: 1800, duration: '1h 10m' },
        { from: 'Manila', to: 'Puerto Princesa', fromCode: 'MNL', toCode: 'PPS', basePrice: 2000, duration: '1h 45m' },
        { from: 'Manila', to: 'Bacolod', fromCode: 'MNL', toCode: 'BCD', basePrice: 1400, duration: '1h 20m' },
        { from: 'Cebu', to: 'Davao', fromCode: 'CEB', toCode: 'DVO', basePrice: 1300, duration: '1h 45m' },
        { from: 'Cebu', to: 'Boracay', fromCode: 'CEB', toCode: 'MPH', basePrice: 1000, duration: '45m' },

        // International routes
        { from: 'Manila', to: 'Hong Kong', fromCode: 'MNL', toCode: 'HKG', basePrice: 4500, duration: '2h 15m' },
        { from: 'Manila', to: 'Singapore', fromCode: 'MNL', toCode: 'SIN', basePrice: 3800, duration: '3h 45m' },
        { from: 'Manila', to: 'Tokyo', fromCode: 'MNL', toCode: 'NRT', basePrice: 8500, duration: '4h 30m' },
        { from: 'Manila', to: 'Seoul', fromCode: 'MNL', toCode: 'ICN', basePrice: 7200, duration: '4h 15m' },
        { from: 'Manila', to: 'Taipei', fromCode: 'MNL', toCode: 'TPE', basePrice: 5200, duration: '2h 45m' },
        { from: 'Manila', to: 'Bangkok', fromCode: 'MNL', toCode: 'BKK', basePrice: 4800, duration: '3h 30m' },
        { from: 'Manila', to: 'Kuala Lumpur', fromCode: 'MNL', toCode: 'KUL', basePrice: 4200, duration: '4h 0m' },
        { from: 'Cebu', to: 'Singapore', fromCode: 'CEB', toCode: 'SIN', basePrice: 4100, duration: '3h 20m' },
        { from: 'Cebu', to: 'Hong Kong', fromCode: 'CEB', toCode: 'HKG', basePrice: 4800, duration: '2h 30m' }
      ]

      const flights = []

      for (let i = 0; i < 20; i++) {
        const route = philippineRoutes[Math.floor(Math.random() * philippineRoutes.length)]
        const departureTime = new Date()
        departureTime.setHours(5 + Math.floor(Math.random() * 16)) // 5 AM to 9 PM
        departureTime.setMinutes(Math.floor(Math.random() * 60))

        // Add some time variation to duration
        const durationParts = route.duration.split(' ')
        const hours = parseInt(durationParts[0])
        const minutes = parseInt(durationParts[1])
        const totalMinutes = hours * 60 + minutes + (Math.random() * 30 - 15) // ±15 minutes variation
        const arrivalTime = new Date(departureTime.getTime() + totalMinutes * 60 * 1000)

        // Price variation based on airline and timing
        let priceMultiplier = 1
        if (route.airline === 'Philippine Airlines') priceMultiplier = 1.3 // Premium pricing
        else if (route.airline === 'Cebu Pacific') priceMultiplier = 0.8 // Budget pricing

        // Peak hour pricing (6-9 AM, 5-8 PM)
        const hour = departureTime.getHours()
        if ((hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20)) {
          priceMultiplier *= 1.2
        }

        const basePrice = route.basePrice * priceMultiplier
        const priceVariation = Math.random() * 0.4 - 0.2 // ±20% variation
        const finalPrice = Math.round(basePrice * (1 + priceVariation))

        flights.push({
          id: i + 1,
          airline: airlines[Math.floor(Math.random() * airlines.length)],
          flightNumber: `${route.fromCode}${100 + i}`,
          departure: {
            time: departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            airport: route.fromCode,
            city: route.from,
            date: this.searchQuery.departureDate
          },
          arrival: {
            time: arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            airport: route.toCode,
            city: route.to,
            date: this.searchQuery.departureDate
          },
          duration: route.duration,
          price: finalPrice,
          stops: Math.random() > 0.8 ? 1 : 0, // Mostly direct flights
          class: this.searchQuery.class || 'economy'
        })
      }

      return flights
    },

    applyFilters() {
      this.filteredFlights = this.flights.filter(flight => {
        // Price filter
        if (flight.price > this.filters.priceRange) return false

        // Airline filter
        if (this.filters.airlines.length > 0 && !this.filters.airlines.includes(flight.airline)) return false

        // Stops filter
        if (this.filters.stops !== 'any') {
          if (this.filters.stops === 'nonstop' && flight.stops !== 0) return false
          if (this.filters.stops === '1stop' && flight.stops !== 1) return false
        }

        // Time filter
        if (this.filters.departureTime.length > 0) {
          const hour = parseInt(flight.departure.time.split(':')[0])
          const isMorning = hour >= 6 && hour < 12
          const isAfternoon = hour >= 12 && hour < 18
          const isEvening = hour >= 18 && hour < 24
          const isNight = hour >= 0 && hour < 6

          const timeMatches = this.filters.departureTime.some(slot => {
            if (slot === 'morning') return isMorning
            if (slot === 'afternoon') return isAfternoon
            if (slot === 'evening') return isEvening
            if (slot === 'night') return isNight
            return false
          })

          if (!timeMatches) return false
        }

        return true
      })
    },

    applySorting() {
      this.filteredFlights.sort((a, b) => {
        switch (this.sortBy) {
          case 'price':
            return a.price - b.price
          case 'duration':
            return parseInt(a.duration) - parseInt(b.duration)
          case 'departure':
            return a.departure.time.localeCompare(b.departure.time)
          case 'arrival':
            return a.arrival.time.localeCompare(b.arrival.time)
          default:
            return 0
        }
      })
    },

    handleFlightSelect(flight) {
      this.$router.push({
        name: 'Booking',
        params: { id: flight.id },
        query: { ...this.searchQuery, flightId: flight.id }
      })
    },

    loadMore() {
      // Simulate loading more results
      this.loading = true
      setTimeout(() => {
        const moreFlights = this.generateMockFlights().slice(0, 10)
        this.flights.push(...moreFlights)
        this.applyFilters()
        this.applySorting()
        this.loading = false
        this.hasMoreResults = this.flights.length < 50 // Simulate pagination
      }, 1000)
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
/* Custom styles for enhanced Bootstrap components */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* Sticky sidebar on larger screens */
@media (min-width: 992px) {
  .sticky-top {
    position: sticky !important;
    top: 20px !important;
  }
}

/* Custom button group styling */
.btn-group .btn {
  border-radius: 0.375rem !important;
  margin-right: 2px;
}

.btn-group .btn:not(:last-child) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.btn-group .btn:not(:first-child) {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .col-lg-3 {
    margin-bottom: 2rem;
  }

  .sticky-top {
    position: static !important;
  }
}

@media (max-width: 767.98px) {
  .btn-group {
    flex-direction: column;
    width: 100%;
  }

  .btn-group .btn {
    border-radius: 0.375rem !important;
    margin-right: 0;
    margin-bottom: 0.25rem;
  }
}
</style>
