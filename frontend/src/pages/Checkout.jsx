import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { createOrder, clearOrderState } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, success, error, order } = useSelector((state) => state.order);

  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Fixed mocked pricing rules
  const taxRate = 0.05;
  const shippingCost = 2.99;
  
  const itemsPrice = cart.totalAmount;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + taxPrice + shippingCost;

  useEffect(() => {
    if (success) {
      // Clear cart locally and redirect to a success page or order details (Day 14)
      dispatch(clearCart());
      setTimeout(() => {
        dispatch(clearOrderState());
        navigate('/profile'); // Temporary redirect until Order History is built
      }, 3000);
    }
  }, [success, dispatch, navigate]);

  if (cart.items.length === 0 && !success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="text-orange-500 hover:underline">Go back to restaurants</button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    const orderData = {
      orderItems: cart.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        image: i.image,
        price: i.price,
        menuItem: i._id
      })),
      restaurant: cart.restaurant._id,
      deliveryAddress: { address, city, postalCode },
      paymentMethod: 'Stripe', // Hardcoded mock
      itemsPrice,
      taxPrice,
      shippingPrice: shippingCost,
      totalPrice
    };

    dispatch(createOrder(orderData));
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
          <FiCheckCircle className="mx-auto mb-4 text-6xl text-green-500" />
          <h2 className="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-400">Order ID: {order?._id}</p>
          <p className="mt-4 text-sm text-gray-500">Redirecting you to your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Forms */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          
          {error && <div className="bg-red-500/20 text-red-500 p-4 rounded-xl border border-red-500/30">{error}</div>}

          {/* Delivery Address */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <FiMapPin className="text-orange-500" /> <span>Delivery Address</span>
            </h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Street Address</label>
                <input required value={address} onChange={e=>setAddress(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-orange-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">City</label>
                  <input required value={city} onChange={e=>setCity(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-orange-500 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Postal Code</label>
                  <input required value={postalCode} onChange={e=>setPostalCode(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-orange-500 transition" />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Mock */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <FiCreditCard className="text-orange-500" /> <span>Payment Method</span>
            </h2>
            <div className="p-4 border border-orange-500/50 bg-orange-500/10 rounded-xl flex items-center justify-between">
              <span className="font-medium">Credit / Debit Card (Stripe)</span>
              <div className="flex space-x-2">
                <div className="h-6 w-10 bg-blue-600 rounded"></div>
                <div className="h-6 w-10 bg-red-500 rounded"></div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Note: Actual payment processing will be implemented later.</p>
          </div>
        </div>

        {/* Right Col: Order Summary */}
        <div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 border-b border-white/10 pb-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img src={item.image === 'no-photo.jpg' ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop' : `http://localhost:5000${item.image}`} className="w-12 h-12 object-cover rounded-md" alt={item.name} />
                    <div>
                      <h4 className="font-medium text-sm text-gray-200">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-gray-400 mb-6 border-b border-white/10 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="text-white">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-orange-500">${totalPrice.toFixed(2)}</span>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
