import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getSystemStats = createAsyncThunk(
  'admin/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(getSystemStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSystemStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getSystemStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      });
  }
});

export default adminSlice.reducer;
