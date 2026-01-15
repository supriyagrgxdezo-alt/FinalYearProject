import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";


const API_URL = "/products";

const initialState = {
  product: null,
  products: [],
  loading: false,
  error: "",
  searchProduct: [],
  totalElements: 0,
  totalPages: 0,
  similarProducts: [],
};


export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch product",
      );
    }
  },
);


export const searchProducts = createAsyncThunk(
  "products/searchProduct",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/search`, {
        params: { q: query },
      });
      console.log("API response:", response.data); // ← add this
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to search products",
      );
    }
  },
);



export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${productId}/similar`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch similar products"
      );
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        params: {
          ...params,
          pageNumber: params.pageNumber || 0,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products",
      );
    }
  },
);

export const updateStockStatus = createAsyncThunk(
  "products/updateStockStatus",
  async ({ productId, inStock }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/products/${productId}/stock`, {
        inStock,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);


const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // GET ALL PRODUCTS
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;

        // FIX: match backend response naming
        state.products = action.payload.content;
        state.totalElements = action.payload.totalElement;
        state.totalPages = action.payload.totalpages;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PRODUCT BY ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIMILAR PRODUCTS
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SEARCH PRODUCT
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchProduct = action.payload;
        console.log("✅ fulfilled:", action.payload); // ← add this
      })
      .addCase(searchProducts.rejected, (state, action) => {
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

export default productSlice.reducer;
