import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';
import api from '../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, menuRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/restaurants/${id}/menu`)
        ]);
        setRestaurant(resRes.data.data);
        setMenus(menuRes.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#0a0a0a]"><div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div></div>;
  }

  if (!restaurant) {
    return <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">Restaurant not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Cover Image */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img 
          src={restaurant.image === 'no-photo.jpg' ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' : `http://localhost:5000${restaurant.image}`} 
          alt={restaurant.name} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20">
        {/* Restaurant Header */}
        <div className="relative -mt-20 mb-12 rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col justify-between md:flex-row md:items-end">
            <div>
              <h1 className="mb-2 text-4xl font-extrabold">{restaurant.name}</h1>
              <p className="mb-4 text-gray-300">{restaurant.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <FiMapPin className="text-orange-500" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiClock className="text-orange-500" />
                  <span>Open Now</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-2 rounded-xl bg-green-500/20 px-4 py-3 text-lg font-bold text-green-500 md:mt-0">
              <span>{restaurant.averageRating || 'New'}</span>
              <FiStar className="fill-current" />
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <h2 className="mb-8 text-3xl font-bold border-b border-white/10 pb-4">Menu</h2>
        
        {menus.length === 0 ? (
          <p className="text-gray-400">No menu items available right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {menus.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    {item.isVegetarian && <span className="h-3 w-3 rounded-full bg-green-500" title="Vegetarian"></span>}
                  </div>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">{item.description}</p>
                  <div className="mt-3 text-lg font-semibold text-orange-500">${item.price.toFixed(2)}</div>
                </div>
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img 
                    src={item.image === 'no-photo.jpg' ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop' : `http://localhost:5000${item.image}`} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
