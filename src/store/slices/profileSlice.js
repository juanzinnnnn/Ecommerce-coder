import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateProfile } from '../../services/profileService';

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getProfile(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error perfil');
    }
  }
);

export const saveProfile = createAsyncThunk(
  'profile/save',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const saved = await updateProfile(userId, data);
      return saved;
    } catch (error) {
      return rejectWithValue(error.message || 'Error guardar perfil');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
