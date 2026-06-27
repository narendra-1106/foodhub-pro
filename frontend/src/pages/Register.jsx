import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { register as registerAction, clearErrors } from '../redux/slices/authSlice';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(registerAction(data));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-900/20 via-[#0d0d0d] to-[#0d0d0d] px-4 py-12 font-sans text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-4xl font-extrabold text-transparent">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-400">Join FoodHub Pro today.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-lg bg-red-500/10 p-3 text-center text-sm font-medium text-red-500"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiUser className="text-gray-500" />
              </div>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="block w-full rounded-lg border border-gray-700 bg-black/50 p-3 pl-10 text-white placeholder-gray-500 transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <span className="mt-1 text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div>
            <label className="mb-1 text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiMail className="text-gray-500" />
              </div>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="block w-full rounded-lg border border-gray-700 bg-black/50 p-3 pl-10 text-white placeholder-gray-500 transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <span className="mt-1 text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div>
            <label className="mb-1 text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiLock className="text-gray-500" />
              </div>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className="block w-full rounded-lg border border-gray-700 bg-black/50 p-3 pl-10 text-white placeholder-gray-500 transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <span className="mt-1 text-xs text-red-500">{errors.password.message}</span>}
          </div>
          
          <div>
            <label className="mb-1 text-sm font-medium text-gray-300">Account Type</label>
            <select
              {...register('role')}
              className="block w-full rounded-lg border border-gray-700 bg-black/50 p-3 text-white transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="customer">Customer</option>
              <option value="owner">Restaurant Owner</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="mt-2 flex w-full justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign up'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
