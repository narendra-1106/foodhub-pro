import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { getSystemStats, getAllUsers, deleteUser } from '../../redux/slices/adminSlice';
import { FiUsers, FiDollarSign, FiShoppingBag, FiStar, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, users, loading } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(getSystemStats());
    if (activeTab === 'users') {
      dispatch(getAllUsers());
    }
  }, [dispatch, activeTab]);

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-orange-500">Admin Control Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full p-3 rounded-lg text-left font-semibold transition ${activeTab === 'overview' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 hover:bg-white/10'}`}
            >
              System Overview
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full p-3 rounded-lg text-left font-semibold transition ${activeTab === 'users' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 hover:bg-white/10'}`}
            >
              Manage Users
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-4">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-orange-500">${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                    <FiDollarSign size={24} />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <h3 className="text-2xl font-bold">{stats?.totalOrders || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <FiShoppingBag size={24} />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <h3 className="text-2xl font-bold">{stats?.totalUsers || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <FiUsers size={24} />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-gray-400 text-sm">Restaurants</p>
                    <h3 className="text-2xl font-bold">{stats?.totalRestaurants || 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                    <FiStar size={24} />
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl overflow-x-auto">
                <h3 className="text-2xl font-bold mb-6">User Management</h3>
                {loading ? <div className="text-center p-4">Loading...</div> : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="p-3">ID</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-3 text-sm text-gray-500">{user._id}</td>
                          <td className="p-3 font-semibold">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                              user.role === 'admin' ? 'bg-red-500/20 text-red-500' :
                              user.role === 'owner' ? 'bg-orange-500/20 text-orange-500' :
                              'bg-green-500/20 text-green-500'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3">
                            {user.role !== 'admin' && (
                              <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 transition p-2 bg-red-500/10 rounded-lg">
                                <FiTrash2 />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
