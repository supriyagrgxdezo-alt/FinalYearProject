import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const steps = [
  { name: "Order Placed", value: "PLACED" },
  { name: "Packed", value: "CONFIRMED" },
  { name: "Shipped", value: "SHIPPED" },
  { name: "Arriving", value: "ARRIVING" },
  { name: "Arrived", value: "DELIVERED" },
];

const cancelSteps = [
  { name: "Order Placed", value: "PLACED" },
  { name: "Order Cancelled", value: "CANCELLED" },
];

const stepOrder = ["PLACED", "CONFIRMED", "SHIPPED", "ARRIVING", "DELIVERED"];

const OrderStepper = ({ orderStatus, orderDate }) => {
  const isCancelled = orderStatus === "CANCELLED";
  const statusStep = isCancelled ? cancelSteps : steps;

  const currentStepIndex = stepOrder.indexOf(orderStatus);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getDescription = (value) => {
    switch (value) {
      case "PLACED":
        return orderDate ? `on ${formatDate(orderDate)}` : "";
      case "CONFIRMED":
        return "Item packed in dispatch warehouse";
      case "SHIPPED":
        return "On the way to you";
      case "ARRIVING":
        return "Out for delivery";
      case "DELIVERED":
        return "Order delivered";
      case "CANCELLED":
        return orderDate ? `on ${formatDate(orderDate)}` : "";
      default:
        return "";
    }
  };

  const isStepCompleted = (stepValue) => {
    if (isCancelled) return stepValue === "PLACED";
    const stepIndex = stepOrder.indexOf(stepValue);
    return stepIndex < currentStepIndex;
  };

  const isStepActive = (stepValue) => stepValue === orderStatus;

  return (
    <Box className="mx-auto my-10">
      {statusStep.map((step, index) => (
        <div key={index} className="flex px-4">
          <div className="flex flex-col items-center">
            <Box
              className={`w-8 h-8 rounded-full flex items-center justify-center
              ${
                isStepCompleted(step.value) || isStepActive(step.value)
                  ? "bg-gray-200 text-teal-500"
                  : "bg-gray-300 text-gray-400"
              }`}
            >
              {isStepCompleted(step.value) || isStepActive(step.value) ? (
                <CheckCircleIcon
                  sx={{
                    color:
                      isStepActive(step.value) && isCancelled ? "red" : "teal",
                  }}
                />
              ) : (
                <FiberManualRecordIcon sx={{ fontSize: 12 }} />
              )}
            </Box>

            {index < statusStep.length - 1 && (
              <div
                className={`h-20 w-[2px] ${
                  isStepCompleted(step.value) ? "bg-emerald-300" : "bg-gray-300"
                }`}
              />
            )}
          </div>

          <div className="ml-2 w-full">
            <div
              className={`w-full ${
                isStepActive(step.value)
                  ? `p-2 text-white font-medium rounded-md -translate-y-3 ${
                      isCancelled ? "bg-red-500" : "bg-teal-500"
                    }`
                  : ""
              }`}
            >
              <p
                className={
                  !isStepActive(step.value) && !isStepCompleted(step.value)
                    ? "text-gray-400"
                    : ""
                }
              >
                {step.name}
              </p>
              <p
                className={`text-xs ${isStepActive(step.value) ? "text-gray-200" : "text-gray-500"}`}
              >
                {getDescription(step.value)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Box>
  );
};

export default OrderStepper;
