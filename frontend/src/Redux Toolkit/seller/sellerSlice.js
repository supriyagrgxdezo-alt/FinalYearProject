import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  sellers: [],
  selectedSeller: null,
  loading: false,
  error: null,
  profile: null,
  report: null,
  profileUpdated: false,
};

const API_URL = "/sellers";

export const fetchSellerProfile = createAsyncThunk(
  "sellers/fetchSellerProfile",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch seller profile", response.data);
      return response.data;
    } catch (error) {
      console.log("Fetch seller profile error", error);
      return rejectWithValue("Failed to fetch sellers");
    }
  },
);

export const fetchSellers = createAsyncThunk(
  "sellers/fetchSellers",
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        params: { status },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("fetch sellers", response.data);
      return response.data;
    } catch (error) {
      console.error("fetch sellers error message:", error.message);
      return rejectWithValue(error.message);
    }
  },
);

export const fetchSellerReport = createAsyncThunk(
  "sellers/fetchSellerReport",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/seller/report`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch seller report", response.data);
      return response.data;
    } catch (error) {
      console.log("fetch seller report error", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchSellerById = createAsyncThunk(
  "sellers/fetchSellerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.log("fetch seller by id error", error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateSellerAccountStatus = createAsyncThunk(
  "sellers/updateSellerAccountStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/admin/seller/${id}/status/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        },
      );
      console.log("update seller status:", response.data);
      return response.data;
    } catch (error) {
      console.log("update seller status error", error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateSellerProfile = createAsyncThunk(
  "sellers/updateSellerProfile",
  async ({ jwt, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/profile`, data, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profileUpdated = false;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch seller profile";
      })

      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.sellers = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sellers";
      })

      .addCase(fetchSellerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerById.fulfilled, (state, action) => {
        state.selectedSeller = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch seller";
      })

      .addCase(updateSellerAccountStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerAccountStatus.fulfilled, (state, action) => {
        const index = state.sellers.findIndex(
          (seller) => seller._id === action.payload._id,
        );
        if (index !== -1) {
          state.sellers[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateSellerAccountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update seller status";
      })

      .addCase(fetchSellerReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchSellerReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellerSlice.reducer;
