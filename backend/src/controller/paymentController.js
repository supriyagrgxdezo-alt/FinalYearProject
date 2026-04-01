const axios = require("axios");
const crypto = require("crypto");
const PaymentService = require("../service/PaymentService");
const PaymentStatus = require("../domain/PaymentStatus");
const TransactionService = require("../service/TransactionService");
const OrderService = require("../service/OrderService");
const SellerReportService = require("../service/SellerReportService");
const sendVerificationEmail = require("../util/sendEmail");
const Order = require("../model/Order");

class PaymentController {
  constructor() {
    this.initiateKhaltiPayment = this.initiateKhaltiPayment.bind(this);
    this.verifyPayment = this.verifyPayment.bind(this);
    this.verifyEsewaPayment = this.verifyEsewaPayment.bind(this);
    this.esewaSuccess = this.esewaSuccess.bind(this);
    this.esewaFailure = this.esewaFailure.bind(this);
  }

  async initiateKhaltiPayment(req, res) {
    const { amount, orderId, orderName, returnUrl } = req.body;
    if (!amount || !orderId || !orderName) {
      return res.status(400).json({
        success: false,
        message: "amount, orderId and orderName are required",
      });
    }
    try {
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        {
          return_url: returnUrl || "http://localhost:5173/payment/success",
          website_url: "http://localhost:5173",
          amount: amount,
          purchase_order_id: String(orderId),
          purchase_order_name: orderName,
        },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.response?.data || err.message,
      });
    }
  }

  async verifyPayment(req, res) {
    const { pidx, paymentOrderId } = req.body;
    if (!pidx) {
      return res.status(400).json({ success: false, message: "Missing pidx" });
    }
    try {
      const khaltiResponse = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/lookup/",
        { pidx },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      const khaltiData = khaltiResponse.data;
      if (khaltiData.status !== "Completed") {
        return res.status(400).json({
          success: false,
          message: "Payment not completed. Status: " + khaltiData.status,
        });
      }
      if (paymentOrderId) {
        const paymentOrder =
          await PaymentService.getPaymentOrderById(paymentOrderId);
        if (paymentOrder) {
          await paymentOrder.populate({
            path: "orders",
            populate: { path: "orderItems" },
          });
          paymentOrder.status = PaymentStatus.COMPLETED;
          paymentOrder.paymentLinkId = pidx;
          await paymentOrder.save();
          for (let ord of paymentOrder.orders) {
            const order = await OrderService.findOrderById(ord._id);
            order.paymentStatus = PaymentStatus.COMPLETED;
            await order.save();
            const transaction = await TransactionService.createTransaction(
              order._id,
            );
            await SellerReportService.updateReportForTransaction(transaction);
          }
          const userEmail = req.user?.email || "testuser@gmail.com";
          await sendVerificationEmail(
            userEmail,
            "Payment Successful",
            `<p>Your payment for Order(s) ${paymentOrder.orders.map((o) => o._id).join(", ")} of amount ${paymentOrder.amount / 100} NPR was successful.</p>`,
          );
          return res.status(200).json({
            success: true,
            message: "Payment verified and orders updated",
            khaltiData,
            paymentOrder,
          });
        }
      }
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        khaltiData,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.response?.data || error.message,
      });
    }
  }

  async verifyEsewaPayment(req, res) {
    const { esewaData, paymentOrderId } = req.body;
    if (!esewaData) {
      return res
        .status(400)
        .json({ success: false, message: "Missing eSewa data" });
    }
    try {
      const secret = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";
      const message = `transaction_code=${esewaData.transaction_code},status=${esewaData.status},total_amount=${esewaData.total_amount},transaction_uuid=${esewaData.transaction_uuid},product_code=${esewaData.product_code},signed_field_names=${esewaData.signed_field_names}`;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(message)
        .digest("base64");
      if (esewaData.signature !== expectedSignature) {
        console.warn("eSewa signature mismatch");
      }
      if (esewaData.status !== "COMPLETE") {
        return res.status(400).json({
          success: false,
          message: "eSewa payment not completed. Status: " + esewaData.status,
        });
      }
      if (paymentOrderId) {
        const paymentOrder =
          await PaymentService.getPaymentOrderById(paymentOrderId);
        if (paymentOrder) {
          await paymentOrder.populate({
            path: "orders",
            populate: { path: "orderItems" },
          });
          paymentOrder.status = PaymentStatus.COMPLETED;
          paymentOrder.paymentLinkId = esewaData.transaction_code;
          await paymentOrder.save();
          for (let ord of paymentOrder.orders) {
            const order = await OrderService.findOrderById(ord._id);
            order.paymentStatus = PaymentStatus.COMPLETED;
            await order.save();
            const transaction = await TransactionService.createTransaction(
              order._id,
            );
            await SellerReportService.updateReportForTransaction(transaction);
          }
          const userEmail = req.user?.email || "testuser@gmail.com";
          await sendVerificationEmail(
            userEmail,
            "Payment Successful - eSewa",
            `<p>Your eSewa payment for Order(s) ${paymentOrder.orders.map((o) => o._id).join(", ")} of Rs. ${paymentOrder.amount} was successful.</p>`,
          );
          return res.status(200).json({
            success: true,
            message: "eSewa payment verified and orders updated",
            transactionCode: esewaData.transaction_code,
            paymentOrder,
          });
        }
      }
      return res.status(200).json({
        success: true,
        message: "eSewa payment verified",
        transactionCode: esewaData.transaction_code,
      });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async esewaSuccess(req, res) {
    console.log("=== eSewa callback received ===");
    console.log("query:", req.query);

    // Add ngrok-skip-browser-warning header so redirect is not blocked
    res.setHeader("ngrok-skip-browser-warning", "true");

    try {
      const { data } = req.query;
      if (!data) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment/success?reason=no_data`,
        );
      }

      let esewaData;
      try {
        const urlDecoded = decodeURIComponent(data);
        esewaData = JSON.parse(
          Buffer.from(urlDecoded, "base64").toString("utf-8"),
        );
      } catch (e) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment/success?reason=decode_error`,
        );
      }

      console.log("eSewa success payload:", esewaData);

      const secret = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";
      const message = `transaction_code=${esewaData.transaction_code},status=${esewaData.status},total_amount=${esewaData.total_amount},transaction_uuid=${esewaData.transaction_uuid},product_code=${esewaData.product_code},signed_field_names=${esewaData.signed_field_names}`;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(message)
        .digest("base64");

      if (esewaData.signature !== expectedSignature) {
        console.error("eSewa signature mismatch");
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment/success?reason=signature_mismatch`,
        );
      }

      if (esewaData.status !== "COMPLETE") {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment/success?reason=incomplete`,
        );
      }

      const paymentOrderId = esewaData.transaction_uuid;
      const paymentOrder =
        await PaymentService.getPaymentOrderById(paymentOrderId);

      if (!paymentOrder) {
        console.error("Payment order not found:", paymentOrderId);
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment/success?reason=order_not_found`,
        );
      }

      if (paymentOrder.status === PaymentStatus.COMPLETED) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment/success?orderId=${paymentOrderId}&data=${encodeURIComponent(data)}`,
        );
      }

      await paymentOrder.populate({
        path: "orders",
        populate: { path: "orderItems" },
      });
      paymentOrder.status = PaymentStatus.COMPLETED;
      paymentOrder.paymentLinkId = esewaData.transaction_code;
      await paymentOrder.save();

      for (let ord of paymentOrder.orders) {
        const order = await OrderService.findOrderById(ord._id);
        order.paymentStatus = PaymentStatus.COMPLETED;
        await order.save();
        const transaction = await TransactionService.createTransaction(ord._id);
        await SellerReportService.updateReportForTransaction(transaction);
      }

      const userEmail = paymentOrder.user?.email || "testuser@gmail.com";
      await sendVerificationEmail(
        userEmail,
        "Payment Successful - eSewa",
        `<p>Your eSewa payment for Order(s) ${paymentOrder.orders.map((o) => o._id).join(", ")} of Rs. ${paymentOrder.amount} was successful.</p>`,
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?orderId=${paymentOrderId}&data=${encodeURIComponent(data)}`,
      );
    } catch (err) {
      console.error("esewaSuccess handler error:", err.message);
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?reason=server_error`,
      );
    }
  }

  async esewaFailure(req, res) {
    res.setHeader("ngrok-skip-browser-warning", "true");
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/failed?reason=user_cancelled`,
    );
  }

  async getPaymentStatus(req, res) {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
      if (order.paymentStatus === PaymentStatus.COMPLETED) {
        return res.json({ success: true, transactionId: order.transactionId });
      } else {
        return res.json({ success: false, message: "Payment not completed" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new PaymentController();
