import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import deliveryReducer from './slices/deliverySlice';
import reviewReducer from './slices/reviewSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
    delivery: deliveryReducer,
    review: reviewReducer,
  },
});

export default store;
