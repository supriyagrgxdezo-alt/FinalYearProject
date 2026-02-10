import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  cart: null,
  loading: false,
  error: "",
};

const API_URL = "/api/cart";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("fetch cart", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load cart",
      );
    }
  },
);

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ jwt, request }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/add`, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("add item to cart", response.data);
      return response.data; // full updated cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item",
      );
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",
  async ({ jwt, cartItemId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data; // updated cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete item",
      );
    }
  },
);

export const applyCoupon = createAsyncThunk(
  "/coupon/applyCoupon",
  async ({ jwt, code, orderTotal }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_URL}/apply`,
        { code, orderTotal },
        { headers: { Authorization: `Bearer ${jwt}` } },
      );
      return response.data; // { discountAmount, finalPrice, message }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid coupon code",
      );
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ jwt, cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_URL}/item/${cartItemId}`,
        {
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );
      console.log("update cart item", response.data);

      return response.data; // updated item or cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update item",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.coupon = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload; // { discountAmount, finalPrice }
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.coupon = null;
      });


    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        // push the new item into existing cartItems instead
        if (state.cart && state.cart.cartItems) {
          const exists = state.cart.cartItems.find(
            (item) => item._id === action.payload._id,
          );
          if (!exists) {
            state.cart.cartItems.push(action.payload);
          }
        } else {
          state.cart = { cartItems: [action.payload] };
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;

        const updatedItem = action.payload;

        if (!state.cart || !state.cart.cartItems) return;

        state.cart.cartItems = state.cart.cartItems.map((item) =>
          item._id === updatedItem._id ? updatedItem : item,
        );
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE ITEM
    builder
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart){
          state.cart.cartItems = state.cart.cartItems.filter(
            (item)=>item._id !== action.meta.arg.cartItemId
          );
        }
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// THIS WAS WRONG — now fixed!
export default cartSlice.reducer;
