import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import { resetUserState } from "../customer/userSlice";
import { resetSellerAuthState } from "../seller/sellerAuthentication";

const API_URL = "/auth";

const initialState = {
  jwt: null,
  role: null,
  loading: false,
  error: null,
  otpSent: false,
};

export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async ({ email, isSignup }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/send/login-signup-otp`, {
        email,
        isSignup, 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

export const signup = createAsyncThunk(
  "/auth/signup",
  async (signupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/signup`, signupRequest);
      localStorage.setItem("jwt", response.data.jwt);
      if (signupRequest.navigate) signupRequest.navigate("/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

export const signin = createAsyncThunk(
  "/auth/signin",
  async (signinRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/signin`, signinRequest);
      localStorage.setItem("jwt", response.data.jwt);
      if (response.data.role === "ROLE_ADMIN") {
        signinRequest.navigate("/admin");
      } else {
        signinRequest.navigate("/");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.jwt = null;
      state.role = null;
      state.otpSent = false;
      state.error = null; // ← added
      localStorage.removeItem("jwt");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(sendLoginSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSent = false; // ← added: reset if user retries with new email
      })
      .addCase(sendLoginSignupOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendLoginSignupOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpSent = false; // ← added: make sure OTP field stays hidden on failure
      })

      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.otpSent = false; // ← added: reset after successful signup
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // "Wrong OTP" etc shown in Snackbar
      })

      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.otpSent = false; // ← added: reset after successful login
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // "Wrong OTP" etc shown in Snackbar
      });
  },
});

export const { logout } = authSlice.actions;

export const performLogout = () => async (dispatch) => {
  dispatch(logout());
  dispatch(resetUserState());
  dispatch(resetSellerAuthState());
  localStorage.removeItem("jwt");
};

export default authSlice.reducer;
