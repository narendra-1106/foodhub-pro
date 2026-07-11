import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getAvailableDeliveries = createAsyncThunk(
  'delivery/getAvailable',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/deliveries/available');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch deliveries');
    }
  }
);

export const acceptDelivery = createAsyncThunk(
  'delivery/accept',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/deliveries/${id}/accept`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to accept delivery');
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'delivery/updateStatus',
  async ({ id, status, lat, lng }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/deliveries/${id}/status`, { status, lat, lng });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update delivery status');
    }
  }
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState: {
    availableDeliveries: [],
    activeDelivery: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Available
      .addCase(getAvailableDeliveries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAvailableDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.availableDeliveries = action.payload;
      })
      .addCase(getAvailableDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept Delivery
      .addCase(acceptDelivery.fulfilled, (state, action) => {
        state.activeDelivery = action.payload;
        state.availableDeliveries = state.availableDeliveries.filter(d => d._id !== action.payload._id);
      })
      // Update Status
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.activeDelivery = action.payload;
        if (action.payload.status === 'Delivered') {
          state.activeDelivery = null; // Clear active delivery once completed
        }
      });
  }
});

export default deliverySlice.reducer;
