import { Alert, Button, Snackbar, TextField, Slide } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  sendLoginOtp,
  verifyLoginOtp,
} from "../../Redux Toolkit/features/seller/sellerAuthentication";
import { useNavigate } from "react-router";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const SellerLogin = () => {
  const { sellerAuth } = useAppSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (sellerAuth.error) {
      const message =
        typeof sellerAuth.error === "string"
          ? sellerAuth.error
          : sellerAuth.error?.message || "Something went wrong";

      setSnackbar({ open: true, message, severity: "error" });
    }
  }, [sellerAuth.error]);

  useEffect(() => {
    if (sellerAuth.otpSent) {
      setSnackbar({
        open: true,
        message: "OTP sent to your email!",
        severity: "success",
      });
    }
  }, [sellerAuth.otpSent]);

  const formik = useFormik({
    initialValues: { email: "", otp: "" },
    onSubmit: (values) => {
      dispatch(verifyLoginOtp({ ...values, navigate }));
    },
  });

  const handleSentOtp = () => {
    if (!formik.values.email) return;
    dispatch(sendLoginOtp({ email: formik.values.email }));
  };

  return (
    <div>
      <h1 className="text-2xl text-center font-bold pb-5">Seller Login</h1>
      <div className="space-y-5">
        <TextField
          fullWidth
          name="email"
          label="E-mail"
          value={formik.values.email}
          onChange={formik.handleChange}
        />

        {sellerAuth.otpSent && (
          <TextField
            fullWidth
            name="otp"
            label="OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
          />
        )}

        <Button
          onClick={sellerAuth.otpSent ? formik.handleSubmit : handleSentOtp}
          fullWidth
          sx={{ py: "12px" }}
          variant="contained"
          disabled={sellerAuth.loading}
        >
          {sellerAuth.loading
            ? "Please wait..."
            : sellerAuth.otpSent
              ? "Login"
              : "Send OTP"}
        </Button>
      </div>

      {/* ⭐ Improved Snackbar & Alert UI */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          icon={
            snackbar.severity === "error" ? (
              <span style={{ fontSize: "20px" }}>⚠️</span>
            ) : undefined
          }
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{
            width: "100%",
            backgroundColor:
              snackbar.severity === "error" ? "#ff4d4d" : undefined,
            color: snackbar.severity === "error" ? "white" : undefined,
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SellerLogin;
