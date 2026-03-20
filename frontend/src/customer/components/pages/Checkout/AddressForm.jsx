import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../../../Redux Toolkit/store";
import { addAddress } from "../../../../Redux Toolkit/features/customer/addressSlice";
import { createOrder } from "../../../../Redux Toolkit/features/customer/orderSlice";
import { useNavigate } from "react-router";

const AddressForm = ({ paymentGateway, mode = "checkout", onSaved }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submitEsewaForm = (esewaData) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = esewaData.payment_url;
    const fields = {
      amount: esewaData.amount,
      tax_amount: esewaData.tax_amount,
      total_amount: esewaData.total_amount,
      transaction_uuid: esewaData.transaction_uuid,
      product_code: esewaData.product_code,
      product_service_charge: esewaData.product_service_charge,
      product_delivery_charge: esewaData.product_delivery_charge,
      success_url: esewaData.success_url,
      failure_url: esewaData.failure_url,
      signed_field_names: esewaData.signed_field_names,
      signature: esewaData.signature,
    };
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      locality: "",
    },
    onSubmit: async (values) => {
      const jwt = localStorage.getItem("jwt");
      if (mode === "save") {
        try {
          await dispatch(addAddress({ jwt, address: values })).unwrap();
          formik.resetForm();
          onSaved?.();
        } catch (err) {
          alert("Failed to save address: " + err);
        }
        return;
      }
      try {
        const result = await dispatch(
          createOrder({ address: values, jwt, paymentGateway }),
        ).unwrap();
        if (paymentGateway === "KHALTI") {
          if (result.khaltiLink) window.location.href = result.khaltiLink;
          else alert("No Khalti payment link received.");
        } else if (paymentGateway === "ESEWA") {
          if (result.esewaData) submitEsewaForm(result.esewaData);
          else alert("No eSewa payment data received.");
        } else {
          alert("Order placed! Pay on delivery.");
          navigate("/account/orders");
        }
      } catch (error) {
        alert(
          "Failed to create order: " +
            (error?.message || JSON.stringify(error)),
        );
      }
    },
  });

  const getButtonLabel = () => {
    if (formik.isSubmitting) return "Processing...";
    if (mode === "save") return "Save Address";
    if (paymentGateway === "KHALTI") return "Proceed to Khalti Payment";
    if (paymentGateway === "ESEWA") return "Proceed to eSewa Payment";
    return "Place COD Order";
  };

  return (
    <Box sx={{ width: "100%" }}>
      {mode === "save" && (
        <p className="text-lg font-bold text-center pb-5">Add New Address</p>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="mobile"
              label="Mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="pinCode"
              label="Pin Code"
              value={formik.values.pinCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
              helperText={formik.touched.pinCode && formik.errors.pinCode}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="address"
              label="Address (house no, building, street)"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="locality"
              label="Locality"
              value={formik.values.locality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.locality && Boolean(formik.errors.locality)}
              helperText={formik.touched.locality && formik.errors.locality}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              sx={{
                py: "14px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
              }}
              type="submit"
              variant="contained"
              fullWidth
              disabled={formik.isSubmitting}
            >
              {getButtonLabel()}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;
