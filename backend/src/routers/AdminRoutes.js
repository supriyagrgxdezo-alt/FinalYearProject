const express = require("express");
const sellerController = require("../controller/sellerController");
const router = express.Router();
const Order = require("../model/Order");
const User = require("../model/User");
const Seller = require("../model/Seller");
const Product = require("../model/Product");

router.patch(
  "/seller/:id/status/:status",
  sellerController.updateSellerAccountStatus,
);

router.get("/stats", async (req, res) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalSellers,
      totalProducts,
      revenueResult,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "ROLE_CUSTOMER" }),
      Seller.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "COMPLETED" } },
        { $group: { _id: null, total: { $sum: "$totalSellingPrice" } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    res.status(200).json({
      totalOrders,
      totalCustomers,
      totalSellers,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
