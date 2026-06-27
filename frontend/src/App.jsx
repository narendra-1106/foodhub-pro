import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'

import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

const Home = () => (
  <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
    <h1 className="text-4xl font-bold">Welcome to FoodHub Pro</h1>
  </div>
)

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected Routes Example */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
