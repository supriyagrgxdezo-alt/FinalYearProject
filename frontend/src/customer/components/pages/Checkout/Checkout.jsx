import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  CircularProgress,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Addresscard from "./Addresscard";
import AddressForm from "./AddressForm";
import Pricingcard from "../Cart/Pricingcard";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { fetchCart } from "../../../../Redux Toolkit/features/customer/cartSlice";
import {
  fetchUserAddresses,
  deleteAddress,
} from "../../../../Redux Toolkit/features/customer/addressSlice"; // ← deleteAddress added
import { createOrder } from "../../../../Redux Toolkit/features/customer/orderSlice";
import { useNavigate } from "react-router";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 520 },
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const paymentGatewayList = [
  { name: "ESEWA", label: "eSewa" },
  { name: "COD", label: "Cash on Delivery" },
];

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((store) => store.cart);
  const { addresses, loading: addressLoading } = useAppSelector(
    (store) => store.address,
  );
  const cartItems = cart.cart?.cartItems || [];
  const jwt = localStorage.getItem("jwt");

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState("ESEWA");
  const [open, setOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (jwt) {
      dispatch(fetchCart(jwt));
      dispatch(fetchUserAddresses(jwt));
    }
  }, [dispatch]);

  const getCartItems = () =>
    cartItems.map((item) => ({
      id: item.product?._id || item.product,
      name: item.product?.name || "Product",
      price: item.sellingPrice,
      quantity: item.quantity,
    }));

  // ← delete handler
  const handleDeleteAddress = async (addressId) => {
    await dispatch(deleteAddress({ jwt, addressId }));
    setSelectedAddressIndex(0);
  };

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

  const handleProceed = async () => {
    const selectedAddress = addresses[selectedAddressIndex];
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }
    setIsPlacingOrder(true);
    try {
      const result = await dispatch(
        createOrder({ address: selectedAddress, jwt, paymentGateway }),
      ).unwrap();
      if (paymentGateway === "KHALTI") {
        if (result.khaltiLink) window.location.href = result.khaltiLink;
        else alert("No Khalti payment link received.");
      } else if (paymentGateway === "ESEWA") {
        if (result.esewaData) submitEsewaForm(result.esewaData);
        else alert("No eSewa payment data received.");
      } else {
        alert("Order placed successfully! Pay on delivery.");
        navigate("/account/orders");
      }
    } catch (error) {
      alert(
        "Failed to create order: " + (error?.message || JSON.stringify(error)),
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const getProceedLabel = () => {
    if (isPlacingOrder) return "Processing...";
    if (paymentGateway === "ESEWA") return "Proceed with eSewa";
    if (paymentGateway === "KHALTI") return "Proceed with Khalti";
    return "Place COD Order";
  };

  const hasAddresses = addresses.length > 0;
  const canProceed = hasAddresses && !isPlacingOrder;
  const proceedBtnSx = {
    px: 4,
    py: 1.4,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    bgcolor: "#16a34a",
    "&:hover": { bgcolor: "#15803d" },
    "&:disabled": { bgcolor: "#d1d5db", color: "#9ca3af" },
  };

  return (
    <Box className="min-h-screen bg-gray-50 pt-8 pb-16 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <Button
          variant="contained"
          disabled={!canProceed}
          onClick={handleProceed}
          startIcon={
            isPlacingOrder ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
          sx={proceedBtnSx}
        >
          {getProceedLabel()}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Delivery Address</h2>
              <Button
                onClick={() => setOpen(true)}
                startIcon={<AddIcon />}
                size="small"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  color: "#16a34a",
                  borderColor: "#16a34a",
                  borderRadius: "8px",
                  "&:hover": { borderColor: "#15803d", bgcolor: "#f0fdf4" },
                }}
              >
                Add New
              </Button>
            </div>
            <div className="p-6">
              {addressLoading ? (
                <div className="flex justify-center py-8">
                  <CircularProgress size={28} sx={{ color: "#16a34a" }} />
                </div>
              ) : hasAddresses ? (
                <div className="space-y-3">
                  {addresses.map((addr, index) => (
                    <Addresscard
                      key={addr._id || index}
                      item={addr}
                      value={index}
                      selectedValue={selectedAddressIndex}
                      handleChange={(e) =>
                        setSelectedAddressIndex(Number(e.target.value))
                      }
                      onDelete={handleDeleteAddress} // ← wired up
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-400 mb-5">
                    No saved addresses. Enter your delivery details below.
                  </p>
                  <AddressForm
                    mode="checkout"
                    paymentGateway={paymentGateway}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Payment Method</h2>
            <RadioGroup
              value={paymentGateway}
              onChange={(e) => setPaymentGateway(e.target.value)}
            >
              {paymentGatewayList.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#d1d5db",
                        "&.Mui-checked": { color: "#16a34a" },
                      }}
                    />
                  }
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  }
                />
              ))}
            </RadioGroup>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Order Summary</h2>
            </div>
            <Pricingcard cartItems={getCartItems()} />
          </div>

          {hasAddresses && (
            <Button
              variant="contained"
              fullWidth
              disabled={!canProceed}
              onClick={handleProceed}
              sx={{ ...proceedBtnSx, py: 1.8, fontSize: "1rem" }}
            >
              {getProceedLabel()}
            </Button>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <AddressForm
            mode="save"
            paymentGateway={paymentGateway}
            onSaved={() => {
              setOpen(false);
              dispatch(fetchUserAddresses(jwt));
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Checkout;
