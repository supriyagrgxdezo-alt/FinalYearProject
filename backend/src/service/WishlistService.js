const Wishlist = require("../model/Wishlist");
const Product = require("../model/Product");

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "products",
      populate: { path: "seller", select: "businessDetails" },
    });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    return wishlist;
  }

  async addToWishlist(userId, productId) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId.toString()
    );
    if (alreadyExists) {
      return await wishlist.populate({
        path: "products",
        populate: { path: "seller", select: "businessDetails" },
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();
    return await wishlist.populate({
      path: "products",
      populate: { path: "seller", select: "businessDetails" },
    });
  }

  async removeFromWishlist(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new Error("Wishlist not found");

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );
    await wishlist.save();
    return await wishlist.populate({
      path: "products",
      populate: { path: "seller", select: "businessDetails" },
    });
  }
}

module.exports = new WishlistService();
