import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiMapPin, FiCamera, FiCheck, FiLogOut } from 'react-icons/fi';
import api from '../services/api';
import { loadUser, logout } from '../redux/slices/authSlice';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      await api.put('/users/profile', data);
      await dispatch(loadUser());
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await dispatch(loadUser());
      setMessage('Avatar updated successfully!');
    } catch (error) {
      setMessage('Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath || avatarPath === 'default.jpg') {
      return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=FF5A00&color=fff&size=200`;
    }
    return `http://localhost:5000${avatarPath}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/10 via-[#0a0a0a] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
        >
          {/* Header Area */}
          <div className="relative h-48 bg-gradient-to-r from-orange-600 to-red-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <button
              onClick={() => dispatch(logout())}
              className="absolute top-4 right-4 flex items-center space-x-2 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/60 backdrop-blur-md"
            >
              <FiLogOut /> <span>Logout</span>
            </button>
          </div>

          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative -mt-20 mb-8 flex justify-between items-end">
              <div className="relative group">
                <img
                  src={getAvatarUrl(user?.avatar)}
                  alt="Profile"
                  className="h-40 w-40 rounded-full border-4 border-[#121212] object-cover shadow-xl transition-all group-hover:opacity-80"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600"
                >
                  <FiCamera />
                </button>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </div>
              <div className="pb-4 text-right">
                <div className="inline-flex items-center rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 border border-orange-500/30">
                  {user?.role.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
              
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-orange-500" />
                  <span>{user?.address || 'No address added'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiPhone className="text-orange-500" />
                  <span>{user?.phone || 'No phone added'}</span>
                </div>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mb-6 rounded-xl p-4 text-sm font-medium ${message.includes('failed') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500 flex items-center space-x-2'}`}
              >
                {!message.includes('failed') && <FiCheck />}
                <span>{message}</span>
              </motion.div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <h3 className="mb-4 text-xl font-semibold border-b border-white/10 pb-2">Edit Details</h3>
              </div>

              <div>
                <label className="mb-1 text-sm font-medium text-gray-400">Full Name</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiUser className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="block w-full rounded-xl border border-white/10 bg-black/30 p-3 pl-10 text-white transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </div>

              <div>
                <label className="mb-1 text-sm font-medium text-gray-400">Phone Number</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiPhone className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    {...register('phone')}
                    className="block w-full rounded-xl border border-white/10 bg-black/30 p-3 pl-10 text-white transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 text-sm font-medium text-gray-400">Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMapPin className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    {...register('address')}
                    className="block w-full rounded-xl border border-white/10 bg-black/30 p-3 pl-10 text-white transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading || uploading}
                  type="submit"
                  className="flex w-full md:w-auto justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/40 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
