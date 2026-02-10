const WishlistService = require("../service/WishlistService");

class WishlistController {
  async getWishlist(req, res) {
    try {
      const wishlist = await WishlistService.getWishlist(req.user._id);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addToWishlist(req, res) {
    try {
      const { productId } = req.params;
      const wishlist = await WishlistService.addToWishlist(req.user._id, productId);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const { productId } = req.params;
      const wishlist = await WishlistService.removeFromWishlist(req.user._id, productId);
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new WishlistController();
