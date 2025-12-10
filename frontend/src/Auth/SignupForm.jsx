import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux Toolkit/store";
import {
  sendLoginSignupOtp,
  signup,
} from "../Redux Toolkit/features/Auth/AuthSlice";
import { useNavigate } from "react-router";
import * as Yup from "yup";

const SignupForm = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (auth.error) {
      setSnackbar({
        open: true,
        message: auth.error,
        severity: "error",
      });
    }
  }, [auth.error]);

  useEffect(() => {
    if (auth.otpSent) {
      setSnackbar({
        open: true,
        message: "OTP sent! Please check your email.",
        severity: "success",
      });
    }
  }, [auth.otpSent]);

  const formik = useFormik({
    initialValues: { email: "", otp: "", fullName: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required to receive OTP"),
      fullName: Yup.string().when([], {
        is: () => auth.otpSent,
        then: (schema) => schema.required("Full name is required"),
        otherwise: (schema) => schema,
      }),
      otp: Yup.string().when([], {
        is: () => auth.otpSent,
        then: (schema) => schema.required("OTP is required"),
        otherwise: (schema) => schema,
      }),
    }),
    onSubmit: (values) => {
      if (!auth.otpSent) {
        dispatch(sendLoginSignupOtp({ email: values.email, isSignup: true })); // ← add isSignup: true
      } else {
        dispatch(signup({ ...values, navigate }));
      }
    },
  });

  return (
    <div>
      <h1 className="text-2xl text-center font-bold pb-5">Signup</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <TextField
            fullWidth
            name="email"
            label="E-mail"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </div>

        {auth.otpSent && (
          <>
            <div>
              <TextField
                fullWidth
                name="fullName"
                label="Full Name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
            </div>

            <div>
              <TextField
                fullWidth
                name="otp"
                label="OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
              />
            </div>
          </>
        )}

        <div>
          <Button
            fullWidth
            sx={{ py: "12px" }}
            type="submit"
            variant="contained"
          >
            {auth.otpSent ? "Create Account" : "Send OTP"}
          </Button>
        </div>

        {auth.loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}
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
    </div>
  );
};

export default SignupForm;
