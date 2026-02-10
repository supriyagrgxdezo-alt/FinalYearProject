const express = require("express");
const router = express.Router();
const WishlistController = require("../controller/WishlistController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", WishlistController.getWishlist.bind(WishlistController));
router.post("/:productId", WishlistController.addToWishlist.bind(WishlistController));
router.delete("/:productId", WishlistController.removeFromWishlist.bind(WishlistController));

module.exports = router;
