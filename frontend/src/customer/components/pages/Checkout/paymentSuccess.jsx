import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const esewaData = searchParams.get("data");
    const pidx = searchParams.get("pidx");
    const khaltiStatus = searchParams.get("status");

    if (esewaData) {
      try {
        // URL-decode first, then base64 decode
        const urlDecoded = decodeURIComponent(esewaData);
        const decoded = JSON.parse(atob(urlDecoded));
        console.log("✅ Decoded eSewa data:", decoded);

        const paymentOrderId = decoded.transaction_uuid;

        if (decoded.status !== "COMPLETE") {
          setStatus("failed");
          setMessage("eSewa payment not completed. Status: " + decoded.status);
          return;
        }

        axios
          .post(
            `${API_URL}/api/payment/esewa/verify`,
            { esewaData: decoded, paymentOrderId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            },
          )
          .then(({ data }) => {
            if (data.success) {
              setStatus("success");
              setMessage("Transaction ID: " + (decoded.transaction_code || "N/A"));
            } else {
              setStatus("failed");
              setMessage(data.message || "Verification failed");
            }
          })
          .catch((err) => {
            console.error("❌ Verify error:", err.response?.data || err.message);
            setStatus("failed");
            setMessage(err.response?.data?.error || err.message);
          });
      } catch (e) {
        console.error("❌ Decode failed:", e.message);
        setStatus("failed");
        setMessage("Failed to decode eSewa response: " + e.message);
      }
      return;
    }

    if (pidx) {
      if (khaltiStatus && khaltiStatus !== "Completed") {
        setStatus("failed");
        setMessage("Payment not completed. Status: " + khaltiStatus);
        return;
      }

      const paymentOrderId = searchParams.get("paymentOrderId");

      axios
        .post(
          `${API_URL}/api/payment/verify`,
          { pidx, paymentOrderId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          },
        )
        .then(({ data }) => {
          if (data.success) {
            setStatus("success");
            setMessage("Transaction ID: " + (data.khaltiData?.transaction_id || "N/A"));
          } else {
            setStatus("failed");
            setMessage(data.message || "Verification failed");
          }
        })
        .catch((err) => {
          setStatus("failed");
          setMessage(err.response?.data?.error?.detail || err.message);
        });
      return;
    }

    const orderId = searchParams.get("orderId");

    if (orderId) {
      axios
        .get(`${API_URL}/api/payment/status/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        })
        .then(({ data }) => {
          if (data.success) {
            setStatus("success");
            setMessage(`Transaction ID: ${data.transactionId}`);
          } else {
            setStatus("failed");
            setMessage(data.message || "Payment verification failed");
          }
        })
        .catch((err) => {
          setStatus("failed");
          setMessage(err.response?.data?.error || err.message);
        });
      return;
    }

    setStatus("failed");
    setMessage("No payment data found.");
  }, []);

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen gap-5 p-10">
      {status === "verifying" && (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6">Verifying payment...</Typography>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircleIcon sx={{ fontSize: 100, color: "green" }} />
          <Typography variant="h4" fontWeight="bold">
            Payment Successful!
          </Typography>
          <Typography color="text.secondary">{message}</Typography>
          <Button variant="contained" onClick={() => navigate("/account/orders")}>
            View My Orders
          </Button>
        </>
      )}
      {status === "failed" && (
        <>
          <ErrorIcon sx={{ fontSize: 100, color: "red" }} />
          <Typography variant="h4" fontWeight="bold">
            Payment Failed
          </Typography>
          <Typography color="text.secondary">{message}</Typography>
          <Button variant="contained" onClick={() => navigate("/cart")}>
            Back to Cart
          </Button>
        </>
      )}
    </Box>
  );
};

export default PaymentSuccess;
