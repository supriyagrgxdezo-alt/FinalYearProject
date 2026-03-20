const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const paymentController = require("../controller/paymentController");
const orderController = require("../controller/orderController");
const router = express.Router();

router.post(
  "/initiate",
  authMiddleware,
  paymentController.initiateKhaltiPayment,
);

router.post("/verify", authMiddleware, paymentController.verifyPayment);

router.post("/cod/:orderId", authMiddleware, orderController.confirmCOD);

router.get("/esewa/success", paymentController.esewaSuccess);
router.get("/esewa/failure", paymentController.esewaFailure);

router.post("/esewa/verify", authMiddleware, paymentController.verifyEsewaPayment);

router.get("/status/:orderId", paymentController.getPaymentStatus);

module.exports = router;
