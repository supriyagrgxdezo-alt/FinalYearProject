import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api"; 

const API_URL = "/api/users";

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ jwt, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/profile`, data, {
       
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

const initialState = {
  user: null,
  loading: false,
  updateLoading: false,
  error: "",
  updateError: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
  
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

   
    builder 
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = "";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = { ...state.user, ...action.payload }; // merges → navbar re-renders
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
