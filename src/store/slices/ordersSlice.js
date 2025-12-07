import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder, getUserOrders } from '../../services/ordersService';

export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getUserOrders(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error órdenes');
    }
  }
);

export const sendOrder = createAsyncThunk(
  'orders/send',
  async ({ userId, items, total }, { rejectWithValue }) => {
    try {
      const id = await createOrder({ userId, items, total, createdAt: Date.now() });
      return { id, items, total };
    } catch (error) {
      return rejectWithValue(error.message || 'Error crear orden');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
