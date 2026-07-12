// Force HMR Reload
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiStar, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (searchQuery = '') => {
    setLoading(true);
    try {
      const url = searchQuery ? `/restaurants?keyword=${searchQuery}` : '/restaurants';
      const res = await api.get(url);
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(search);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="relative flex h-[60vh] flex-col items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-3xl px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-extrabold md:text-6xl"
          >
            Discover the best food & drinks
          </motion.h1>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch} 
            className="flex w-full items-center overflow-hidden rounded-full bg-white p-2 shadow-2xl"
          >
            <div className="flex pl-4 pr-2 text-gray-500">
              <FiSearch size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search for restaurants, cuisines..." 
              className="w-full bg-transparent p-3 text-gray-800 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600">
              Search
            </button>
          </motion.form>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold">Popular Restaurants</h2>
        
        {loading ? (
          <div className="flex justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div></div>
        ) : restaurants.length === 0 ? (
          <p className="text-gray-400">No restaurants found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant, index) => (
              <motion.div 
                key={restaurant._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <Link to={`/restaurant/${restaurant._id}`}>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={restaurant.image === 'no-photo.jpg' ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' : `http://localhost:5000${restaurant.image}`} 
                      alt={restaurant.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <div className="flex items-center space-x-1 rounded-md bg-green-500/20 px-2 py-1 text-sm font-bold text-green-500">
                        <span>{restaurant.averageRating || 'New'}</span>
                        <FiStar className="fill-current" />
                      </div>
                    </div>
                    <div className="mb-4 flex items-center space-x-2 text-sm text-gray-400">
                      <FiMapPin />
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.cuisines.slice(0, 3).map((cuisine, i) => (
                        <span key={i} className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
