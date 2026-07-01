import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const createRestaurant = createAsyncThunk(
  'restaurant/create',
  async (restaurantData, { rejectWithValue }) => {
    try {
      const response = await api.post('/restaurants', restaurantData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error || 'Failed to create restaurant');
    }
  }
);

export const getOwnerRestaurant = createAsyncThunk(
  'restaurant/getOwner',
  async (_, { rejectWithValue }) => {
    try {
      // In a real scenario we'd query by owner ID, or just fetch all and filter,
      // For now we'll fetch all and filter in component, or create a specific endpoint.
      // Let's assume we fetch all and filter by current user.
      const response = await api.get('/restaurants');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error || 'Failed to fetch restaurant');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    restaurants: [],
    myRestaurant: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.myRestaurant = action.payload;
        state.restaurants.push(action.payload);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOwnerRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnerRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(getOwnerRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearErrors } = restaurantSlice.actions;
export default restaurantSlice.reducer;
