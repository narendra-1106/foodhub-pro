import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMapPin, FiCheckCircle, FiPackage, FiTruck, FiCheck } from 'react-icons/fi';
import { getAvailableDeliveries, acceptDelivery, updateDeliveryStatus } from '../../redux/slices/deliverySlice';

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const { availableDeliveries, activeDelivery, loading } = useSelector((state) => state.delivery);
  const [mockLocation, setMockLocation] = useState({ lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    dispatch(getAvailableDeliveries());
  }, [dispatch]);

  const handleAccept = (id) => {
    dispatch(acceptDelivery(id));
  };

  const handleUpdateStatus = (status) => {
    if (activeDelivery) {
      // Simulate slight movement
      const newLat = mockLocation.lat + 0.001;
      const newLng = mockLocation.lng + 0.001;
      setMockLocation({ lat: newLat, lng: newLng });
      
      dispatch(updateDeliveryStatus({
        id: activeDelivery._id,
        status,
        lat: newLat,
        lng: newLng
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-orange-500">Driver Dashboard</h1>

        {activeDelivery ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-orange-500/50 rounded-2xl p-6 shadow-2xl shadow-orange-500/20">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold flex items-center space-x-2 text-orange-500">
                <FiTruck /> <span>Active Delivery</span>
              </h2>
              <span className="bg-orange-500/20 text-orange-500 px-4 py-1 rounded-full font-bold">
                {activeDelivery.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center space-x-2 text-gray-300">
                  <FiPackage /> <span>Pickup From</span>
                </h3>
                <p className="text-xl font-bold">{activeDelivery.order?.restaurant?.name || 'Restaurant'}</p>
                <p className="text-gray-400">{activeDelivery.order?.restaurant?.address || 'Address hidden'}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center space-x-2 text-gray-300">
                  <FiMapPin /> <span>Deliver To</span>
                </h3>
                <p className="text-xl font-bold">{activeDelivery.order?.user?.name || 'Customer'}</p>
                <p className="text-gray-400">{activeDelivery.order?.user?.phone || 'Phone hidden'}</p>
              </div>
            </div>

            <div className="bg-black/50 rounded-xl p-4 mb-8 text-center text-gray-400 text-sm border border-white/5">
              Live Mock Location: Lat {mockLocation.lat.toFixed(4)}, Lng {mockLocation.lng.toFixed(4)}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button 
                disabled={activeDelivery.status !== 'Accepted'}
                onClick={() => handleUpdateStatus('Picked Up')}
                className={`py-3 rounded-xl font-bold transition flex flex-col items-center justify-center space-y-1 ${activeDelivery.status === 'Accepted' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'}`}
              >
                <FiPackage size={24} />
                <span>Mark Picked Up</span>
              </button>
              <button 
                disabled={activeDelivery.status !== 'Picked Up'}
                onClick={() => handleUpdateStatus('Delivered')}
                className={`py-3 rounded-xl font-bold transition flex flex-col items-center justify-center space-y-1 ${activeDelivery.status === 'Picked Up' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'}`}
              >
                <FiCheckCircle size={24} />
                <span>Mark Delivered</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <FiCheck /> <span>Available Orders</span>
            </h2>
            
            {loading ? (
              <p className="text-gray-400">Scanning for orders...</p>
            ) : availableDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <FiPackage className="mx-auto text-6xl text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">No orders available right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableDeliveries.map((delivery) => (
                  <div key={delivery._id} className="border border-white/10 bg-black/40 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition">
                    <div className="mb-4 md:mb-0">
                      <p className="font-bold text-lg">{delivery.order?.restaurant?.name || 'Restaurant'}</p>
                      <p className="text-sm text-gray-400 mb-2">{delivery.order?.restaurant?.address || 'Address'}</p>
                      <p className="text-xs text-orange-500 font-semibold">Delivery ID: {delivery._id}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleAccept(delivery._id)}
                      className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
