import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import RestaurantDetails from './pages/RestaurantDetails'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import OrderDetails from './pages/OrderDetails'

const Dashboard = () => (
  <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
    <h1 className="text-4xl font-bold">Protected Dashboard</h1>
  </div>
)

const Unauthorized = () => (
  <div className="flex h-screen items-center justify-center bg-[#121212] text-red-500">
    <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
  </div>
)

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Attempt to load user if token exists in localStorage
    if (localStorage.getItem('token')) {
      dispatch(loadUser())
    }
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['owner', 'admin']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
