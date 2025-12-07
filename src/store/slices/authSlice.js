import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { uid: cred.user.uid, email: cred.user.email };
  } catch (error) {
    return rejectWithValue(error.code || 'Error login');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      return { uid: cred.user.uid, email: cred.user.email };
    } catch (error) {
      return rejectWithValue(error.code || 'Error register');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
  return true;
});

export const updateEmailAuth = createAsyncThunk(
  'auth/updateEmail',
  async (nuevoEmail, { getState, rejectWithValue }) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No hay usuario autenticado');
      await updateEmail(currentUser, nuevoEmail.trim());
      return nuevoEmail.trim();
    } catch (error) {
      return rejectWithValue(error.code || 'Error updateEmail');
    }
  }
);

export const updatePasswordAuth = createAsyncThunk(
  'auth/updatePassword',
  async (nuevoPassword, { rejectWithValue }) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No hay usuario autenticado');
      await updatePassword(currentUser, nuevoPassword);
      return true;
    } catch (error) {
      return rejectWithValue(error.code || 'Error updatePassword');
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateEmailAuth.fulfilled, (state, action) => {
        if (state.user) {
          state.user.email = action.payload;
        }
      });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
