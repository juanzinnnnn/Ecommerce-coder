import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  obtenerItemsCarrito,
  insertarItemCarrito,
  actualizarCantidadCarrito,
  borrarItemCarrito,
  limpiarCarritoBD,
} from '../../database/sqlite';

const estadoInicial = {
  items: [],
  total: 0,
  loading: false,
};

export const cargarCarritoDesdeBD = createAsyncThunk('cart/cargarCarrito', async () => {
  const filas = await obtenerItemsCarrito();
  return filas.map((row) => ({
    id: row.productoId,
    titulo: row.titulo,
    precio: row.precio,
    cantidad: row.cantidad,
    imagen: row.imagen,
  }));
});

export const agregarAlCarritoBD = createAsyncThunk(
  'cart/agregarAlCarritoBD',
  async (producto, { rejectWithValue }) => {
    try {
      await insertarItemCarrito(producto);
      return producto;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const actualizarCantidadBD = createAsyncThunk(
  'cart/actualizarCantidadBD',
  async ({ id, cantidad }, { rejectWithValue }) => {
    try {
      await actualizarCantidadCarrito(id, cantidad);
      return { id, cantidad };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const quitarDelCarritoBD = createAsyncThunk(
  'cart/quitarDelCarritoBD',
  async (id, { rejectWithValue }) => {
    try {
      await borrarItemCarrito(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const limpiarCarritoCompletoBD = createAsyncThunk(
  'cart/limpiarCarritoCompletoBD',
  async (_, { rejectWithValue }) => {
    try {
      await limpiarCarritoBD();
      return true;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: estadoInicial,
  reducers: {
    agregarAlCarrito: (state, action) => {
      const producto = action.payload;
      const existente = state.items.find((i) => i.id === producto.id);
      if (existente) {
        existente.cantidad += 1;
      } else {
        state.items.push({ ...producto, cantidad: 1 });
      }
      state.total = state.items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      );
    },
    quitarDelCarrito: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      state.total = state.items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      );
    },
    actualizarCantidad: (state, action) => {
      const { id, cantidad } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.cantidad = cantidad;
      }
      state.total = state.items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      );
    },
    limpiarCarrito: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarCarritoDesdeBD.pending, (state) => {
        state.loading = true;
      })
      .addCase(cargarCarritoDesdeBD.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = state.items.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0
        );
      })
      .addCase(cargarCarritoDesdeBD.rejected, (state) => {
        state.loading = false;
      })
      .addCase(agregarAlCarritoBD.fulfilled, (state, action) => {
        cartSlice.caseReducers.agregarAlCarrito(state, action);
      })
      .addCase(actualizarCantidadBD.fulfilled, (state, action) => {
        cartSlice.caseReducers.actualizarCantidad(state, action);
      })
      .addCase(quitarDelCarritoBD.fulfilled, (state, action) => {
        cartSlice.caseReducers.quitarDelCarrito(state, action);
      })
      .addCase(limpiarCarritoCompletoBD.fulfilled, (state) => {
        cartSlice.caseReducers.limpiarCarrito(state);
      });
  },
});

export const {
  agregarAlCarrito,
  quitarDelCarrito,
  actualizarCantidad,
  limpiarCarrito,
} = cartSlice.actions;

export default cartSlice.reducer;
