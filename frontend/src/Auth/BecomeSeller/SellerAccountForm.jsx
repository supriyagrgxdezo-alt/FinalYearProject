import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import BecomeSellerStep1 from "./BecomeSellerStep1";
import BecomeSellerStep2 from "./BecomeSellerStep2";
import BecomeSellerStep3 from "./BecomeSellerStep3";
import BecomeSellerStep4 from "./BecomeSellerStep4";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { createSeller } from "../../Redux Toolkit/features/seller/sellerAuthentication";
import { useNavigate } from "react-router";

const steps = [
  " Mobile ",
  "Pickup Address",
  "Bank Details",
  "Business Details",
];

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
      pickupAddress: {
        name: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        locality: "",
      },
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
      },
      sellerName: "",
      email: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessMobile: "",
        logo: "",
        banner: "",
        businessAddress: "",
      },
      password: "",
    },
    
    onSubmit: (values) => {
      console.log(values);
      dispatch(createSeller(values)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          alert("Account created successfully! Please login.");
          navigate("/seller/login"); // ← redirect to login
        } else {
          alert("Failed to create account: " + result.payload);
        }
      });
    },

    onSubmit: (values) => {
      console.log(values);

      dispatch(createSeller(values));
    },
  });

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel> {label} </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className="mt-20 space-y-10">
        {activeStep === 0 ? (
          <BecomeSellerStep1 formik={formik} />
        ) : activeStep === 1 ? (
          <BecomeSellerStep2 formik={formik} />
        ) : activeStep === 2 ? (
          <BecomeSellerStep3 formik={formik} />
        ) : activeStep === 3 ? (
          <BecomeSellerStep4 formik={formik} />
        ) : null}
      </div>
      <div className="flex items-center justify-between mt-5">
        <Button
          variant="contained"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={
            activeStep == steps.length - 1
              ? formik.handleSubmit
              : () => setActiveStep(activeStep + 1)
          }
        >
          {activeStep === steps.length - 1 ? "Create Account" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default SellerAccountForm;
