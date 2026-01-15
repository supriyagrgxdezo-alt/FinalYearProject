import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  otpSent: false,
  jwt: null,
  error: null,
  loading: false,
};

const API_URL = "/sellers";

export const sendLoginOtp = createAsyncThunk(
  "sellerAuth/sendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/send/login-otp`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const verifyLoginOtp = createAsyncThunk(
  "sellerAuth/verifyOtp",
  async (data , { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/verify/login-otp`, data);

      localStorage.setItem("jwt", response.data.jwt);

      data.navigate("/seller/dashboard");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createSeller = createAsyncThunk(
  "/sellers/createSeller",
  async (seller, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}`, seller);
      console.log("create seller", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);

      // Only pass a serializable message
      const message =
        error.response?.data?.message || error.message || "Signup failed";

      return rejectWithValue(message);
    }
  },
);

const sellerAuthSlice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {
    resetSellerAuthState: (state) => {
      state.otpSent = false;
      state.jwt = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // send OTP
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // verify OTP
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.otpSent = false; // OTP verified, reset flag
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create seller
      .addCase(createSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt || null; // save JWT if returned
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSellerAuthState } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
