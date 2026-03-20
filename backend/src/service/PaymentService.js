const crypto = require("crypto");
const PaymentStatus = require("../domain/PaymentStatus");
const PaymentOrder = require("../model/PaymentOrder");

class PaymentService {
  async createOrder(user, cartItems, paymentMethod) {
    const amount = cartItems.reduce(
      (sum, item) => sum + (item.totalSellingPrice || item.price || 0),
      0,
    );
    const paymentOrder = new PaymentOrder({
      amount,
      user: user._id,
      orders: cartItems,
      paymentMethod,
      status: PaymentStatus.PENDING,
    });
    return await paymentOrder.save();
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await PaymentOrder.findById(orderId);
    if (!paymentOrder) throw new Error("Payment order not found");
    return paymentOrder;
  }

  async getPaymentOrderByPaymentLinkId(paymentLinkId) {
    const paymentOrder = await PaymentOrder.findOne({ paymentLinkId });
    if (!paymentOrder) throw new Error("Payment Order not found");
    return paymentOrder;
  }

  generateEsewaSignature(totalAmount, transactionUuid, productCode) {
    const secret = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";
    const data = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    return crypto.createHmac("sha256", secret).update(data).digest("base64");
  }

  async generateEsewaPaymentData(paymentOrder) {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    
    const BACKEND_URL =
      process.env.BACKEND_URL ||
      "https://conducibly-deteriorative-janee.ngrok-free.dev";

    const productCode = process.env.ESEWA_MERCHANT_ID || "EPAYTEST";
    const transactionUuid = paymentOrder._id.toString();
    const totalAmount = paymentOrder.amount;

    const signature = this.generateEsewaSignature(
      totalAmount,
      transactionUuid,
      productCode,
    );

    return {
      payment_url:
        process.env.ESEWA_PAYMENT_URL ||
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${BACKEND_URL}/api/payment/esewa/success`, // ✅ backend
      failure_url: `${BACKEND_URL}/api/payment/esewa/failure`, // ✅ backend (no query params needed)
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };
  }
}

module.exports = new PaymentService();
