import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebaseConfig';

export const obtenerProductos = createAsyncThunk(
  'products/obtenerProductos',
  async (_, { rejectWithValue }) => {
    try {
      return await new Promise((resolve) => {
        const productosRef = ref(db, 'products');
        onValue(productosRef, (snapshot) => {
          const data = snapshot.val() || {};
          const lista = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          resolve(lista);
        });
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    estado: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(obtenerProductos.pending, (state) => {
        state.estado = 'cargando';
        state.error = null;
      })
      .addCase(obtenerProductos.fulfilled, (state, action) => {
        state.estado = 'exitoso';
        state.items = action.payload;
      })
      .addCase(obtenerProductos.rejected, (state, action) => {
        state.estado = 'error';
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
