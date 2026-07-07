import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../redux/slices/orderSlice';
import { FiBox, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div></div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl">
            <FiBox className="mx-auto text-6xl text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">Explore Restaurants</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={order._id} 
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold mb-1">{order.restaurant?.name || 'Restaurant Unavailable'}</h3>
                  <p className="text-sm text-gray-400 mb-2">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-400 mb-2">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 
                    order.orderStatus === 'Cancelled' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                    'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-orange-500 mb-4">${order.totalPrice.toFixed(2)}</span>
                  <Link to={`/order/${order._id}`} className="flex items-center space-x-1 text-sm font-semibold hover:text-orange-500 transition">
                    <span>View Details</span> <FiChevronRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
