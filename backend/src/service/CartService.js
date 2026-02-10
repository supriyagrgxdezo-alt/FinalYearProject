const Cart = require("../model/cart");
const CartItem = require("../model/CartItem");
const calculateDiscountPercentage = require("../util/CalculateDiscountPercentage.js");

class CartService {
  async findUserCart(user) {
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = new Cart({ user: user._id, cartItems: [] });
      await cart.save();
    }

    // ← populate FIRST before calculating
    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    cart.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;

    // ← now cartItems have actual data
    cartItems.forEach((cartItem) => {
      totalPrice += cartItem.mrpPrice || 0;
      totalDiscountedPrice += cartItem.sellingPrice || 0;
    });

    cart.totalMrpPrice = totalPrice;
    cart.totalSellingPrice = totalDiscountedPrice;
    cart.totalItem = cartItems.length;
    cart.discount = calculateDiscountPercentage(
      totalPrice,
      totalDiscountedPrice,
    );

    return cart;
  }

  async addCartItem(user, product, size, quantity) {
    const cart = await this.findUserCart(user);

    const mrpPrice = product.mrpPrice || 0;

    const sellingPricePerUnit =
      product.sellingPrice ||
      product.mrpPrice - (product.mrpPrice * product.discountPercent) / 100;

    let isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      size: size,
    }).populate("product");

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        quantity,
        userId: user._id,
        sellingPrice: quantity * sellingPricePerUnit,
        mrpPrice: quantity * mrpPrice,
        size,
        cart: cart._id,
      });
      return await cartItem.save();
    }
    return isPresent;
  }
}

module.exports = new CartService();
