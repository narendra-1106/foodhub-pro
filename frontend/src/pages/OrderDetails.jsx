import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderDetails } from '../redux/slices/orderSlice';
import { FiCheckCircle, FiClock, FiTruck, FiHome } from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div></div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="mx-auto max-w-4xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
        <p className="text-gray-400 mb-8">Order ID: {order._id}</p>

        {/* Status Tracker */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 right-0 h-1 bg-white/10 top-1/2 -translate-y-1/2 z-0"></div>
          
          <div className={`relative z-10 flex flex-col items-center ${['Placed', 'Preparing', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'text-orange-500' : 'text-gray-500'}`}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border-4 border-[#0a0a0a] ${['Placed', 'Preparing', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>
              <FiCheckCircle size={24} />
            </div>
            <span className="mt-2 font-semibold text-sm">Placed</span>
          </div>

          <div className={`relative z-10 flex flex-col items-center ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'text-orange-500' : 'text-gray-500'}`}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border-4 border-[#0a0a0a] ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>
              <FiClock size={24} />
            </div>
            <span className="mt-2 font-semibold text-sm">Preparing</span>
          </div>

          <div className={`relative z-10 flex flex-col items-center ${['Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'text-orange-500' : 'text-gray-500'}`}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border-4 border-[#0a0a0a] ${['Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>
              <FiTruck size={24} />
            </div>
            <span className="mt-2 font-semibold text-sm">On the Way</span>
          </div>

          <div className={`relative z-10 flex flex-col items-center ${['Delivered'].includes(order.orderStatus) ? 'text-green-500' : 'text-gray-500'}`}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center border-4 border-[#0a0a0a] ${['Delivered'].includes(order.orderStatus) ? 'bg-green-500 text-white' : 'bg-gray-700'}`}>
              <FiHome size={24} />
            </div>
            <span className="mt-2 font-semibold text-sm">Delivered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Shipping Details</h3>
            <p className="text-gray-300">{order.user?.name}</p>
            <p className="text-gray-400">{order.deliveryAddress.address}</p>
            <p className="text-gray-400">{order.deliveryAddress.city}, {order.deliveryAddress.postalCode}</p>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Payment Status</h3>
              <p className={order.isPaid ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                {order.isPaid ? 'Paid via Stripe' : 'Payment Pending'}
              </p>
            </div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-xl border border-white/5">
            <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Order Items</h3>
            <div className="space-y-4 mb-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-gray-400">
              <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10 text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-500">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
