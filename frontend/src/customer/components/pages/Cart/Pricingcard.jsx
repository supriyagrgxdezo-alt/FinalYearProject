import Divider from "@mui/material/Divider";
import React from "react";
import { useAppSelector } from "../../../../Redux Toolkit/store";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../../util/sumCartItemPrice";

const Pricingcard = () => {
  const cart = useAppSelector((store) => store.cart);
  const { coupon } = useAppSelector((store) => store.adminCoupon);

  const cartItems = cart.cart?.cartItems || [];
  const mrpTotal = sumCartItemMrpPrice(cartItems);
  const sellingTotal = sumCartItemSellingPrice(cartItems);
  const productDiscount = mrpTotal - sellingTotal;
  const couponDiscount = coupon?.couponPrice || 0;
  const finalTotal = sellingTotal + 79 - couponDiscount;

  return (
    <div>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>Rs {mrpTotal}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span className="text-green-600">- Rs {productDiscount}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Coupon Discount</span>
            <span>- Rs {couponDiscount}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>Rs 79</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Platform fee</span>
          <span>Free</span>
        </div>
      </div>

      <Divider />

      <div className="font-medium px-5 py-2 flex justify-between items-center">
        <span>Total</span>
        <span>Rs {finalTotal}</span>
      </div>
    </div>
  );
};

export default Pricingcard;
