import { createSlice } from '@reduxjs/toolkit';

const estadoInicial = {
  usuario: null,
  autenticado: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: estadoInicial,
  reducers: {
    setUsuario: (state, action) => {
      state.usuario = action.payload;
      state.autenticado = !!action.payload;
    },
    cerrarSesion: (state) => {
      state.usuario = null;
      state.autenticado = false;
    },
  },
});

export const { setUsuario, cerrarSesion } = userSlice.actions;

export default userSlice.reducer;
