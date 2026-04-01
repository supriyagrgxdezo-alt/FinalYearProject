const Coupon = require("../model/Coupon");
const Cart = require("../model/cart");

class CouponService {
  async createCoupon(data) {
    const coupon = new Coupon(data);
    return await coupon.save();
  }

  async getAllCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  async deleteCoupon(id) {
    return await Coupon.findByIdAndDelete(id);
  }

  async applyCoupon(code, orderValue, userId, apply) {
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) throw new Error("Invalid or inactive coupon");
    if (orderValue < coupon.minimumOrderValue) {
      throw new Error(`Minimum order value is Rs ${coupon.minimumOrderValue}`);
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    // ← calculate fresh from actual cart items
    const CartItem = require("../model/CartItem");
    const cartItems = await CartItem.find({ cart: cart._id });
    const freshTotal = cartItems.reduce(
      (sum, item) => sum + (item.sellingPrice || 0),
      0,
    );

    if (apply) {
      const discount = Math.floor(
        (freshTotal * coupon.discountPercentage) / 100,
      );
      cart.couponCode = code;
      cart.couponPrice = discount;
      cart.totalSellingPrice = freshTotal - discount;
    } else {
      cart.couponCode = null;
      cart.couponPrice = 0;
      cart.totalSellingPrice = freshTotal;
    }

    return await cart.save();
  }
}

module.exports = new CouponService();
