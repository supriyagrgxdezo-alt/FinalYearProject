const express = require("express");
const router = express.Router();

const sellerController = require("../controller/sellerController");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware");

console.log("Seller Routes Loaded");

router.post("/send/login-otp", sellerController.sendLoginOtp);

router.post("/verify/login-otp", sellerController.verifyLoginOtp);

router.get("/profile", sellerMiddleware,sellerController.getSellerProfile);
router.put("/profile", sellerMiddleware, sellerController.updateSeller);
router.post("/", sellerController.createSeller);
router.get("/", sellerController.getAllSellers);
router.patch("/", sellerMiddleware,sellerController.updateSeller);
router.delete("/:id", sellerController.deleteSeller);

module.exports = router;
