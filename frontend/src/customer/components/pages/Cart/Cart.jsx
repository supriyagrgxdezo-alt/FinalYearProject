import React, { useEffect, useState } from "react";
import CartItemCard from "./CartItemCard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Pricingcard from "./Pricingcard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { fetchCart } from "../../../../Redux Toolkit/features/customer/cartSlice";
import {
  applyCoupon,
  clearCoupon,
} from "../../../../Redux Toolkit/features/Admin/CouponSlice";
import { sumCartItemSellingPrice } from "../../../../util/sumCartItemPrice";
import { useNavigate } from "react-router";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((store) => store.cart);
  const {
    coupon,
    error: couponError,
    loading: couponLoading,
  } = useAppSelector((store) => store.adminCoupon);

  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    dispatch(fetchCart(localStorage.getItem("jwt")));
  }, [dispatch]);

  const cartItems = cart.cart?.cartItems || [];
  const orderTotal = sumCartItemSellingPrice(cartItems) + 79;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    dispatch(
      applyCoupon({
        jwt: localStorage.getItem("jwt"),
        code: couponCode.trim().toUpperCase(),
        orderTotal,
      }),
    );
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    dispatch(clearCoupon());
  };

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <CartItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Right Panel */}
          <div className="col-span-1 text-sm space-y-3">
            {/* Coupon Section */}
            <div className="border border-gray-300 rounded-md px-5 py-3 space-y-3">
              <div className="flex gap-3 text-sm items-center">
                <LocalOfferIcon color="primary" sx={{ fontSize: "17px" }} />
                <span>Apply Coupons</span>
              </div>

              <div className="flex justify-between items-start gap-2">
                <TextField
                  placeholder="Coupon code"
                  size="small"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  error={!!couponError}
                  helperText={couponError || ""}
                  disabled={!!coupon}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !!coupon}
                  sx={{ mt: "4px" }}
                >
                  {couponLoading ? "Applying..." : "Apply"}
                </Button>
              </div>

              {coupon && (
                <div className="flex justify-between items-center">
                  <p className="text-green-600 text-xs">
                    Coupon applied! You save Rs {coupon.couponPrice}
                  </p>
                  <Button
                    size="small"
                    color="error"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Pricing + Buy Now */}
            <section className="border rounded-md border-gray-300">
              <Pricingcard />
              <div className="p-5">
                <Button
                  onClick={() => navigate("/checkout/address")}
                  fullWidth
                  variant="contained"
                  sx={{ py: "11px" }}
                >
                  BUY NOW
                </Button>
              </div>
            </section>

            {/* Wishlist */}
            <div className="border border-gray-300 rounded-md px-5 py-4 flex justify-between items-center cursor-pointer">
              <span>Add From Wishlist</span>
              <FavoriteBorderIcon color="primary" />
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-2xl text-center font-semibold">Cart is Empty</h1>
      )}
    </div>
  );
};

export default Cart;
