import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import { updateStockStatus } from "../customer/productSlice";

const API_URL = "/api/sellers/products";

export const fetchSellerProduct = createAsyncThunk(
  "sellerProduct/fetchSellerProduct",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createProduct = createAsyncThunk(
  "sellerProduct/createProduct",
  async ({ jwt, request }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}`, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "sellerProduct/updateProduct",
  async ({ jwt, product, productId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${productId}`, product, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "sellerProduct/deleteProduct",
  async ({ jwt, productId }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return productId; // return id so we can filter it out of state
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  products: [],
  loading: false,
  error: "",
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = "";
      })
      .addCase(fetchSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.error = "";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id,
        );
        if (index !== -1) state.products[index] = action.payload;
        state.error = "";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload,
        );
        state.error = "";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStockStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.products.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.products[index] = updated;
      });
  },
});

export default sellerProductSlice.reducer;
