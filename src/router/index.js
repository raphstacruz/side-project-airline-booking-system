import Home from '../pages/Home.vue'
import FlightSearch from '../pages/FlightSearch.vue'
import FlightResults from '../pages/FlightResults.vue'
import Booking from '../pages/Booking.vue'
import Payment from '../pages/Payment.vue'
import Confirmation from '../pages/Confirmation.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import BookingsList from '../pages/BookingsList.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'FlightSearch',
    component: FlightSearch
  },
  {
    path: '/results',
    name: 'FlightResults',
    component: FlightResults
  },
  {
    path: '/booking/:id',
    name: 'Booking',
    component: Booking,
    props: true
  },
  {
    path: '/payment/:id',
    name: 'Payment',
    component: Payment,
    props: true
  },
  {
    path: '/confirmation/:id',
    name: 'Confirmation',
    component: Confirmation,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/bookings',
    name: 'BookingsList',
    component: BookingsList
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard
  }
]

export default routes
