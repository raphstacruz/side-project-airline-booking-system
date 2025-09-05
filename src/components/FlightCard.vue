<template>
  <div class="card h-100" :class="{ 'border-primary': isSelected }">
    <div class="card-body">
      <!-- Flight Header -->
      <div class="row align-items-center mb-3">
        <div class="col">
          <h5 class="card-title mb-1">{{ flight.airline }}</h5>
          <small class="text-muted">{{ flight.flightNumber }}</small>
        </div>
        <div class="col-auto text-end">
          <div class="h4 text-primary mb-0">₱{{ flight.price }}</div>
          <small class="text-muted">per person</small>
        </div>
      </div>

      <!-- Flight Route -->
      <div class="row align-items-center mb-3">
        <div class="col text-center">
          <div class="h5 mb-1">{{ flight.departure.time }}</div>
          <div class="fw-semibold">{{ flight.departure.airport }}</div>
          <small class="text-muted">{{ flight.departure.city }}</small>
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
          <div class="h5 mb-1">{{ flight.arrival.time }}</div>
          <div class="fw-semibold">{{ flight.arrival.airport }}</div>
          <small class="text-muted">{{ flight.arrival.city }}</small>
        </div>
      </div>

      <!-- Flight Details -->
      <div class="row mb-3">
        <div class="col-4">
          <small class="text-muted d-block">Class</small>
          <span class="fw-semibold">{{ flight.class.charAt(0).toUpperCase() + flight.class.slice(1) }}</span>
        </div>
        <div class="col-4">
          <small class="text-muted d-block">Baggage</small>
          <span class="fw-semibold">Included</span>
        </div>
        <div class="col-4">
          <small class="text-muted d-block">Refundable</small>
          <span class="fw-semibold">Yes</span>
        </div>
      </div>

      <!-- Flight Actions -->
      <div class="row g-2">
        <div class="col-6">
          <button
            @click="$emit('select-flight', flight)"
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ loading ? 'Selecting...' : 'Select Flight' }}
          </button>
        </div>
        <div class="col-6">
          <button @click="toggleDetails" class="btn btn-outline-secondary w-100">
            {{ showDetails ? 'Hide Details' : 'Flight Details' }}
          </button>
        </div>
      </div>

      <!-- Expanded Details -->
      <div v-if="showDetails" class="mt-3 pt-3 border-top">
        <div class="mb-3">
          <h6 class="fw-bold">Aircraft Information</h6>
          <p class="mb-1 small">Aircraft: Boeing 737-800</p>
          <p class="mb-1 small">WiFi: Available (paid)</p>
          <p class="mb-0 small">Entertainment: In-flight entertainment system</p>
        </div>

        <div class="mb-3">
          <h6 class="fw-bold">Baggage Allowance</h6>
          <p class="mb-1 small">Carry-on: 1 piece (max 7kg)</p>
          <p class="mb-1 small">Checked: 1 piece (max 23kg)</p>
          <p class="mb-0 small">Additional baggage fees may apply</p>
        </div>

        <div>
          <h6 class="fw-bold">Cancellation Policy</h6>
          <p class="mb-1 small">Free cancellation up to 24 hours before departure</p>
          <p class="mb-1 small">Change fee: $50 + fare difference</p>
          <p class="mb-0 small">Refund: 100% credit for future travel</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightCard',
  props: {
    flight: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDetails: false,
      loading: false
    }
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails
    }
  }
}
</script>

<style scoped>
/* Custom card styling */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.card.border-primary {
  box-shadow: 0 0 0 2px rgba(13,110,253,0.25) !important;
}

/* Custom flight path line */
.border-top.border-2 {
  border-color: #dee2e6 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .row.align-items-center.mb-3 {
    text-align: center;
  }

  .col-auto.text-end {
    text-align: center !important;
    margin-top: 1rem;
  }

  .row.align-items-center.mb-3 .col {
    margin-bottom: 0.5rem;
  }

  .row.mb-3 {
    text-align: center;
  }

  .row.mb-3 .col-4 {
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .h5 {
    font-size: 1.1rem;
  }

  .h4 {
    font-size: 1.25rem;
  }
}
</style>
