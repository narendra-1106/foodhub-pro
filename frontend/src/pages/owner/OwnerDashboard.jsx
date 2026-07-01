import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { createRestaurant, getOwnerRestaurant } from '../../redux/slices/restaurantSlice';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { restaurants, loading } = useSelector((state) => state.restaurant);
  const { register, handleSubmit, reset } = useForm();
  
  const myRestaurant = restaurants.find(r => r.owner === user?.id || r.owner?._id === user?.id);

  useEffect(() => {
    dispatch(getOwnerRestaurant());
  }, [dispatch]);

  const onSubmit = (data) => {
    // split cuisines by comma
    data.cuisines = data.cuisines.split(',').map(c => c.trim());
    dispatch(createRestaurant(data)).then(() => {
        reset();
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-orange-500">Owner Dashboard</h1>
        
        {myRestaurant ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">{myRestaurant.name}</h2>
            <p className="mt-2 text-gray-400">{myRestaurant.description}</p>
            <p className="mt-2 text-sm text-orange-400">{myRestaurant.address}</p>
            
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-xl font-semibold">Menu Management</h3>
              <p className="text-sm text-gray-500">Add, edit, or delete menu items here (UI placeholder for Day 8).</p>
              {/* Menu items list will go here */}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold">Register Your Restaurant</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Restaurant Name</label>
                <input {...register('name')} className="w-full rounded-lg bg-black/50 p-3 text-white border border-gray-700 focus:border-orange-500 outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Description</label>
                <textarea {...register('description')} className="w-full rounded-lg bg-black/50 p-3 text-white border border-gray-700 focus:border-orange-500 outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Address</label>
                <input {...register('address')} className="w-full rounded-lg bg-black/50 p-3 text-white border border-gray-700 focus:border-orange-500 outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Cuisines (comma separated)</label>
                <input {...register('cuisines')} placeholder="Italian, Chinese, Indian" className="w-full rounded-lg bg-black/50 p-3 text-white border border-gray-700 focus:border-orange-500 outline-none" required />
              </div>
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
