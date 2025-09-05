<template>
  <div class="seat-selection">
    <div class="seat-selection-header">
      <h3>Select Your Seats</h3>
      <p>Choose your preferred seats for {{ flight.airline }} {{ flight.flightNumber }}</p>
    </div>

    <!-- Seat Legend -->
    <div class="seat-legend">
      <div class="legend-item">
        <div class="seat-icon available"></div>
        <span>Available</span>
      </div>
      <div class="legend-item">
        <div class="seat-icon selected"></div>
        <span>Selected</span>
      </div>
      <div class="legend-item">
        <div class="seat-icon occupied"></div>
        <span>Occupied</span>
      </div>
      <div class="legend-item">
        <div class="seat-icon premium"></div>
        <span>Premium</span>
      </div>
    </div>

    <!-- Aircraft Layout -->
    <div class="aircraft-layout">
      <!-- Cockpit -->
      <div class="cockpit">
        <div class="cockpit-shape"></div>
      </div>

      <!-- Seat Map -->
      <div class="seat-map">
        <!-- Economy Section -->
        <div class="cabin-section">
          <h4>Economy Class</h4>
          <div class="seat-grid">
            <!-- Rows 1-5 -->
            <div v-for="row in 5" :key="row" class="seat-row">
              <div class="row-number">{{ row }}</div>
              <div class="seats">
                <!-- Left side (A-B-C) -->
                <div
                  v-for="seat in ['A', 'B', 'C']"
                  :key="`${row}${seat}`"
                  :class="['seat', getSeatClass(row, seat)]"
                  @click="selectSeat(`${row}${seat}`)"
                >
                  {{ seat }}
                </div>
                <!-- Aisle -->
                <div class="aisle"></div>
                <!-- Right side (D-E-F) -->
                <div
                  v-for="seat in ['D', 'E', 'F']"
                  :key="`${row}${seat}`"
                  :class="['seat', getSeatClass(row, seat)]"
                  @click="selectSeat(`${row}${seat}`)"
                >
                  {{ seat }}
                </div>
              </div>
            </div>

            <!-- Premium Economy Section -->
            <div class="section-divider">
              <span>Premium Economy</span>
            </div>

            <!-- Rows 6-8 -->
            <div v-for="row in [6, 7, 8]" :key="row" class="seat-row">
              <div class="row-number">{{ row }}</div>
              <div class="seats">
                <!-- Left side (A-B-C) -->
                <div
                  v-for="seat in ['A', 'B', 'C']"
                  :key="`${row}${seat}`"
                  :class="['seat', 'premium', getSeatClass(row, seat)]"
                  @click="selectSeat(`${row}${seat}`)"
                >
                  {{ seat }}
                </div>
                <!-- Aisle -->
                <div class="aisle"></div>
                <!-- Right side (D-E-F) -->
                <div
                  v-for="seat in ['D', 'E', 'F']"
                  :key="`${row}${seat}`"
                  :class="['seat', 'premium', getSeatClass(row, seat)]"
                  @click="selectSeat(`${row}${seat}`)"
                >
                  {{ seat }}
                </div>
              </div>
            </div>

            <!-- Business Class Section -->
            <div class="section-divider">
              <span>Business Class</span>
            </div>

            <!-- Rows 9-10 -->
            <div v-for="row in [9, 10]" :key="row" class="seat-row">
              <div class="row-number">{{ row }}</div>
              <div class="seats business">
                <!-- Left side (A-B) -->
                <div
                  v-for="seat in ['A', 'B']"
                  :key="`${row}${seat}`"
                  :class="['seat', 'business', getSeatClass(row, seat)]"
                  @click="selectSeat(`${row}${seat}`)"
                >
                  {{ seat }}
                </div>
                <!-- Aisle -->
                <div class="aisle wide"></div>
                <!-- Right side (C-D) -->
                <div
                  v-for="seat in ['C', 'D']"
                  :key="`${row}${seat}`"
                  :class="['seat', 'business', getSeatClass(row, seat)]"
                  @click="selectSeat(`${row}${seat}`)"
                >
                  {{ seat }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Emergency Exit -->
      <div class="emergency-exit">
        <div class="exit-row">
          <div class="exit-sign">🚪 EMERGENCY EXIT</div>
        </div>
      </div>
    </div>

    <!-- Selected Seats Summary -->
    <div v-if="selectedSeats.length > 0" class="selected-seats-summary">
      <h4>Selected Seats</h4>
      <div class="selected-seats-list">
        <div
          v-for="seat in selectedSeats"
          :key="seat"
          class="selected-seat-item"
        >
          <span class="seat-number">{{ seat }}</span>
          <span class="seat-class">{{ getSeatType(seat) }}</span>
          <span class="seat-price">₱{{ getSeatPrice(seat) }}</span>
          <button @click="removeSeat(seat)" class="remove-seat">×</button>
        </div>
      </div>
      <div class="total-seats">
        <strong>Total Seats: {{ selectedSeats.length }}</strong>
        <strong>Total Price: ₱{{ totalSeatPrice }}</strong>
      </div>
    </div>

    <!-- Seat Selection Notice -->
    <div class="seat-notice">
      <div class="notice-icon">ℹ️</div>
      <div class="notice-content">
        <h5>Seat Selection Guidelines</h5>
        <ul>
          <li>Premium Economy seats offer extra legroom and priority boarding</li>
          <li>Business Class includes complimentary meals and lounge access</li>
          <li>Emergency exit rows have limited recline for safety reasons</li>
          <li>Seat selection is final and cannot be changed after booking</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeatSelection',
  props: {
    flight: {
      type: Object,
      required: true
    },
    passengers: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      selectedSeats: [],
      occupiedSeats: ['1A', '2B', '3C', '4D', '5E', '6F', '7A', '8B', '9C', '10D'], // Mock occupied seats
      seatPrices: {
        economy: 0,      // Included in base price
        premium: 1500,   // Additional cost
        business: 5000   // Additional cost
      }
    }
  },
  computed: {
    totalSeatPrice() {
      return this.selectedSeats.reduce((total, seat) => {
        return total + this.getSeatPrice(seat)
      }, 0)
    }
  },
  methods: {
    getSeatClass(row, seat) {
      const seatId = `${row}${seat}`

      if (this.selectedSeats.includes(seatId)) {
        return 'selected'
      }

      if (this.occupiedSeats.includes(seatId)) {
        return 'occupied'
      }

      // Determine seat type based on row
      if (row >= 9) {
        return 'business available'
      } else if (row >= 6) {
        return 'premium available'
      } else {
        return 'available'
      }
    },

    selectSeat(seatId) {
      if (this.occupiedSeats.includes(seatId)) {
        return // Can't select occupied seats
      }

      const index = this.selectedSeats.indexOf(seatId)

      if (index > -1) {
        // Deselect seat
        this.selectedSeats.splice(index, 1)
      } else {
        // Select seat (limit to number of passengers)
        if (this.selectedSeats.length < this.passengers) {
          this.selectedSeats.push(seatId)
        } else {
          alert(`You can only select ${this.passengers} seat${this.passengers > 1 ? 's' : ''} for ${this.passengers} passenger${this.passengers > 1 ? 's' : ''}`)
        }
      }

      this.$emit('seats-selected', {
        seats: this.selectedSeats,
        totalPrice: this.totalSeatPrice
      })
    },

    removeSeat(seatId) {
      const index = this.selectedSeats.indexOf(seatId)
      if (index > -1) {
        this.selectedSeats.splice(index, 1)
        this.$emit('seats-selected', {
          seats: this.selectedSeats,
          totalPrice: this.totalSeatPrice
        })
      }
    },

    getSeatType(seatId) {
      const row = parseInt(seatId.slice(0, -1))

      if (row >= 9) {
        return 'Business Class'
      } else if (row >= 6) {
        return 'Premium Economy'
      } else {
        return 'Economy'
      }
    },

    getSeatPrice(seatId) {
      const row = parseInt(seatId.slice(0, -1))

      if (row >= 9) {
        return this.seatPrices.business
      } else if (row >= 6) {
        return this.seatPrices.premium
      } else {
        return this.seatPrices.economy
      }
    }
  }
}
</script>

<style scoped>
.seat-selection {
  max-width: 800px;
  margin: 0 auto;
}

.seat-selection-header {
  text-align: center;
  margin-bottom: 2rem;
}

.seat-selection-header h3 {
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.seat-selection-header p {
  color: var(--gray-600);
}

/* Seat Legend */
.seat-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--gray-700);
}

.seat-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid var(--gray-300);
}

.seat-icon.available {
  background: var(--success-color);
  border-color: var(--success-color);
}

.seat-icon.selected {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.seat-icon.occupied {
  background: var(--danger-color);
  border-color: var(--danger-color);
}

.seat-icon.premium {
  background: var(--warning-color);
  border-color: var(--warning-color);
}

/* Aircraft Layout */
.aircraft-layout {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
}

.cockpit {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.cockpit-shape {
  width: 120px;
  height: 60px;
  background: linear-gradient(135deg, var(--gray-600), var(--gray-800));
  border-radius: 30px 30px 0 0;
  position: relative;
}

.cockpit-shape::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 20px;
  background: var(--gray-400);
  border-radius: 10px;
}

/* Seat Map */
.seat-map {
  margin-bottom: 2rem;
}

.cabin-section h4 {
  text-align: center;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.seat-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.row-number {
  width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.875rem;
}

.seats {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
}

.seats.business {
  justify-content: center;
  gap: 1rem;
}

.seat {
  width: 32px;
  height: 32px;
  border: 2px solid var(--gray-300);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  background: var(--white);
  color: var(--gray-700);
}

.seat.available:hover {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.seat.selected {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--white);
}

.seat.occupied {
  background: var(--danger-color);
  border-color: var(--danger-color);
  color: var(--white);
  cursor: not-allowed;
}

.seat.premium {
  border-color: var(--warning-color);
  background: var(--warning-color);
  color: var(--white);
}

.seat.business {
  width: 40px;
  height: 40px;
  font-size: 0.875rem;
}

.aisle {
  width: 20px;
  height: 2px;
  background: var(--gray-300);
}

.aisle.wide {
  width: 40px;
}

.section-divider {
  text-align: center;
  margin: 2rem 0 1rem;
  position: relative;
}

.section-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-300);
}

.section-divider span {
  background: var(--white);
  padding: 0 1rem;
  color: var(--gray-600);
  font-size: 0.875rem;
  font-weight: 600;
}

/* Emergency Exit */
.emergency-exit {
  margin-top: 2rem;
}

.exit-row {
  display: flex;
  justify-content: center;
}

.exit-sign {
  background: var(--danger-color);
  color: var(--white);
  padding: 0.5rem 2rem;
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  font-weight: 600;
}

/* Selected Seats Summary */
.selected-seats-summary {
  background: var(--gray-50);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.selected-seats-summary h4 {
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.selected-seats-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.selected-seat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.seat-number {
  font-weight: 600;
  color: var(--gray-900);
}

.seat-class {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.seat-price {
  font-weight: 600;
  color: var(--primary-color);
}

.remove-seat {
  background: none;
  border: none;
  color: var(--danger-color);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
}

.remove-seat:hover {
  background: var(--danger-color);
  color: var(--white);
}

.total-seats {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: var(--gray-900);
  padding-top: 1rem;
  border-top: 1px solid var(--gray-300);
}

/* Seat Selection Notice */
.seat-notice {
  display: flex;
  gap: 1rem;
  background: var(--info-color);
  background: rgba(0, 123, 255, 0.1);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.notice-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notice-content h5 {
  color: var(--gray-900);
  margin-bottom: 0.75rem;
}

.notice-content ul {
  margin: 0;
  padding-left: 1.25rem;
}

.notice-content li {
  color: var(--gray-700);
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .seat-legend {
    gap: 1rem;
  }

  .aircraft-layout {
    padding: 1rem;
  }

  .seat-row {
    gap: 0.5rem;
  }

  .seats {
    gap: 0.125rem;
  }

  .seat {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }

  .seat.business {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }

  .aisle {
    width: 16px;
  }

  .aisle.wide {
    width: 32px;
  }

  .seat-notice {
    flex-direction: column;
    gap: 0.75rem;
  }

  .selected-seat-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .seat-legend {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .seat-grid {
    gap: 0.25rem;
  }

  .seat-row {
    gap: 0.25rem;
  }

  .row-number {
    width: 24px;
    font-size: 0.75rem;
  }

  .seat {
    width: 24px;
    height: 24px;
    font-size: 0.65rem;
  }

  .seat.business {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
}
</style>
