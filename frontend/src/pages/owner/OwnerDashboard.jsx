import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { createRestaurant, getOwnerRestaurant } from '../../redux/slices/restaurantSlice';
import api from '../../services/api';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { restaurants, loading } = useSelector((state) => state.restaurant);
  const { register, handleSubmit, reset } = useForm();
  
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'menu' or 'orders'

  const myRestaurant = restaurants.find(r => r.owner === user?.id || r.owner?._id === user?.id);

  useEffect(() => {
    dispatch(getOwnerRestaurant());
  }, [dispatch]);

  useEffect(() => {
    if (myRestaurant && activeTab === 'orders') {
      fetchOrders();
    }
  }, [myRestaurant, activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/restaurant/${myRestaurant._id}`);
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = (data) => {
    data.cuisines = data.cuisines.split(',').map(c => c.trim());
    dispatch(createRestaurant(data)).then(() => reset());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-orange-500">Owner Dashboard</h1>
        
        {myRestaurant ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <h2 className="text-xl font-bold">{myRestaurant.name}</h2>
                <p className="mt-2 text-xs text-orange-400">{myRestaurant.address}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`p-3 rounded-lg text-left font-semibold transition ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  Incoming Orders
                </button>
                <button 
                  onClick={() => setActiveTab('menu')}
                  className={`p-3 rounded-lg text-left font-semibold transition ${activeTab === 'menu' ? 'bg-orange-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  Menu Management
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl">
                  <h3 className="text-2xl font-bold mb-6">Live Orders</h3>
                  
                  {orders.length === 0 ? (
                    <p className="text-gray-400">No orders received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-white/10 bg-black/40 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-4 md:mb-0">
                            <p className="font-bold">Order ID: <span className="font-normal text-gray-400">{order._id}</span></p>
                            <p className="text-sm">Customer: <span className="text-gray-400">{order.user?.name}</span></p>
                            <p className="text-sm">Total: <span className="text-orange-500 font-bold">${order.totalPrice.toFixed(2)}</span></p>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-gray-400">Update Status</label>
                            <select 
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="bg-[#121212] border border-orange-500/50 rounded-lg p-2 outline-none text-white focus:border-orange-500"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'menu' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl">
                  <h3 className="text-2xl font-bold mb-6">Menu Items</h3>
                  <p className="text-gray-500">Menu item CRUD UI placeholder.</p>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl max-w-xl">
            <h2 className="mb-6 text-xl font-semibold">Register Your Restaurant</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Form fields omitted for brevity, keeping existing logic */}
              <input {...register('name')} placeholder="Restaurant Name" className="w-full bg-black/50 p-3 rounded-lg border border-gray-700 focus:border-orange-500" required />
              <textarea {...register('description')} placeholder="Description" className="w-full bg-black/50 p-3 rounded-lg border border-gray-700 focus:border-orange-500" required />
              <input {...register('address')} placeholder="Address" className="w-full bg-black/50 p-3 rounded-lg border border-gray-700 focus:border-orange-500" required />
              <input {...register('cuisines')} placeholder="Cuisines (comma separated)" className="w-full bg-black/50 p-3 rounded-lg border border-gray-700 focus:border-orange-500" required />
              
              <button disabled={loading} type="submit" className="w-full rounded-lg bg-orange-500 p-3 font-semibold hover:bg-orange-600 transition">
                {loading ? 'Creating...' : 'Create Restaurant'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
