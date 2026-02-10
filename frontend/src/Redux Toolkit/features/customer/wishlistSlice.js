import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL = "/api/wishlist";

const initialState = {
  wishlist: null,  
  loading: false,
  error: "",
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (jwt, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ jwt, productId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_URL}/${productId}`, {}, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async ({ jwt, productId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = ""; };
    const handleFulfilled = (state, action) => { state.loading = false; state.wishlist = action.payload; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchWishlist.pending, handlePending)
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(fetchWishlist.rejected, handleRejected)
      .addCase(addToWishlist.pending, handlePending)
      .addCase(addToWishlist.fulfilled, handleFulfilled)
      .addCase(addToWishlist.rejected, handleRejected)
      .addCase(removeFromWishlist.pending, handlePending)
      .addCase(removeFromWishlist.fulfilled, handleFulfilled)
      .addCase(removeFromWishlist.rejected, handleRejected);
  },
});

export default wishlistSlice.reducer;
