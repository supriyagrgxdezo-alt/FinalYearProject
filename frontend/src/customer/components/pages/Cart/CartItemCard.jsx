import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useAppDispatch } from "../../../../Redux Toolkit/store";
import {
  deleteCartItem,
  updateCartItem,
} from "../../../../Redux Toolkit/features/customer/cartSlice";

const MAX_QTY = 20;
const MIN_QTY = 1;

const CartItemCard = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleUpdateCartItem = (newQty) => {
    if (newQty < MIN_QTY || newQty > MAX_QTY) return;
    dispatch(
      updateCartItem({
        jwt: localStorage.getItem("jwt"),
        cartItemId: item._id,
        quantity: newQty,
      })
    );
  };

  const handleRemove = () => {
    dispatch(
      deleteCartItem({
        jwt: localStorage.getItem("jwt"),
        cartItemId: item._id,
      })
    );
  };

  return (
    <div className="border border-gray-300 rounded-md relative">
      {/* Remove Button */}
      <div className="absolute top-2 right-2 z-10">
        <IconButton onClick={handleRemove} size="small" color="primary">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="p-5 flex gap-3">
        <div>
          <img
            className="w-24 rounded-md object-cover"
            src={item.product?.images?.[0]}
            alt={item.product?.title}
          />
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-base">
            {item.product?.seller?.businessDetails?.businessName || "Crystal Thread"}
          </h1>
          <p className="text-gray-600 font-medium text-sm">{item.product?.title}</p>
          <p className="text-gray-400 text-xs">
            <strong>Sold by:</strong>{" "}
            {item.product?.seller?.businessDetails?.businessName || "Crystal Thread"}
          </p>
          <p className="text-sm">
            <strong>7 Days replacement</strong> available
          </p>
          <p className="text-sm text-gray-500">
            <strong>Size:</strong> {item.size}
          </p>
        </div>
      </div>

      <Divider />

      <div className="px-5 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            disabled={item.quantity <= MIN_QTY}
            onClick={() => handleUpdateCartItem(item.quantity - 1)}
            size="small"
            variant="outlined"
          >
            <RemoveIcon fontSize="small" />
          </Button>

          <span className="px-3 font-semibold min-w-[2rem] text-center">
            {item.quantity}
          </span>

          <Button
            disabled={item.quantity >= MAX_QTY}
            onClick={() => handleUpdateCartItem(item.quantity + 1)}
            size="small"
            variant="outlined"
          >
            <AddIcon fontSize="small" />
          </Button>

          {item.quantity >= MAX_QTY && (
            <span className="text-xs text-amber-500 ml-2">Max limit reached</span>
          )}
        </div>

        <div className="text-right">
          <p className="text-gray-700 font-semibold">Rs {item.sellingPrice}</p>
          {item.quantity > 1 && (
            <p className="text-xs text-gray-400">
              Rs {Math.round(item.sellingPrice / item.quantity)} each
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
