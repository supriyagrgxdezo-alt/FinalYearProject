import { Alert, Button, Snackbar, TextField, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux Toolkit/store";
import {
  sendLoginSignupOtp,
  signin,
} from "../Redux Toolkit/features/Auth/AuthSlice";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Listen to auth state changes and show messages
  useEffect(() => {
    if (auth.error) {
      setSnackbar({
        open: true,
        message: auth.error, // "Wrong OTP", "User not found", etc from backend
        severity: "error",
      });
    }
  }, [auth.error]);

  useEffect(() => {
    if (auth.otpSent) {
      setSnackbar({
        open: true,
        message: "OTP sent to your email successfully!",
        severity: "success",
      });
    }
  }, [auth.otpSent]);

  const formik = useFormik({
    initialValues: { email: "", otp: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      otp: Yup.string().when([], {
        is: () => auth.otpSent,
        then: (schema) => schema.required("OTP is required"),
        otherwise: (schema) => schema,
      }),
    }),
    onSubmit: (values) => {
      dispatch(signin({ ...values, navigate }));
    },
  });

  const handleSendOtp = () => {
    formik.setFieldTouched("email", true);
    if (!formik.values.email || formik.errors.email) {
      formik.setFieldError("email", "Email is required to receive OTP");
      return;
    }
    dispatch(
      sendLoginSignupOtp({ email: formik.values.email, isSignup: false }),
    ); 
  };
  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="white"
    >
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
      <form>
        <Box mb={2}>
          <TextField
            fullWidth
            name="email"
            label="E-mail"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Box>

        {auth.otpSent && (
          <Box mb={2}>
            <TextField
              fullWidth
              name="otp"
              label="OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
            />
          </Box>
        )}

        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            type="button"
            onClick={auth.otpSent ? formik.handleSubmit : handleSendOtp}
          >
            {auth.otpSent ? "Login" : "Send OTP"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
