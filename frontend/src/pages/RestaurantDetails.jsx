import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiClock, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import api from '../services/api';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart State
  const cart = useSelector(state => state.cart);
  const cartItems = cart.items;
  const totalAmount = cart.totalAmount;

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

  const getItemQuantity = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAdd = (item) => {
    dispatch(addToCart({ item, restaurant }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#0a0a0a]"><div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div></div>;
  }

  if (!restaurant) {
    return <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">Restaurant not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      {/* Cover Image */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img 
          src={restaurant.image === 'no-photo.jpg' ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' : `http://localhost:5000${restaurant.image}`} 
          alt={restaurant.name} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-32">
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
            {menus.map((item, index) => {
              const qty = getItemQuantity(item._id);
              
              return (
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
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-orange-500">${item.price.toFixed(2)}</span>
                      
                      {qty === 0 ? (
                        <button 
                          onClick={() => handleAdd(item)}
                          className="flex items-center space-x-1 rounded-lg bg-orange-500/20 px-4 py-1.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
                        >
                          <FiPlus /> <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-3 rounded-lg bg-orange-500 px-2 py-1 text-white">
                          <button onClick={() => handleRemove(item._id)} className="p-1 hover:bg-white/20 rounded-md transition"><FiMinus /></button>
                          <span className="font-bold w-4 text-center">{qty}</span>
                          <button onClick={() => handleAdd(item)} className="p-1 hover:bg-white/20 rounded-md transition"><FiPlus /></button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={item.image === 'no-photo.jpg' ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop' : `http://localhost:5000${item.image}`} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      {cartItems.length > 0 && cart.restaurant?._id === restaurant._id && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl bg-orange-500 p-4 text-white shadow-2xl shadow-orange-500/30 backdrop-blur-xl">
            <div className="flex flex-col">
              <span className="text-sm font-medium opacity-90">{cartItems.reduce((a,c) => a + c.quantity, 0)} items added</span>
              <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="flex items-center space-x-2 rounded-xl bg-white px-6 py-3 font-bold text-orange-600 transition hover:bg-gray-100"
            >
              <span>Checkout</span> <FiShoppingCart />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RestaurantDetails;
