import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Menu, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../Redux Toolkit/features/seller/sellerOrderSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const orderStatusList = [
  { color: "#FFA500", label: "PENDING" },
  { color: "#F5BCBA", label: "PLACED" },
  { color: "#F5BCBA", label: "CONFIRMED" },
  { color: "#1E90FF", label: "SHIPPED" },
  { color: "#32CD32", label: "DELIVERED" },
  { color: "#FF0000", label: "CANCELLED" },
];

const statusColors = {
  PENDING: "warning",
  PLACED: "default",
  CONFIRMED: "primary",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "error",
};

export default function OrderTable() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((store) => store.sellerOrder);

  // each row gets its own anchor — fix for shared menu bug
  const [anchorEls, setAnchorEls] = React.useState({});

  const handleClick = (event, orderId) => {
    setAnchorEls((prev) => ({ ...prev, [orderId]: event.currentTarget }));
  };

  const handleClose = (orderId) => {
    setAnchorEls((prev) => ({ ...prev, [orderId]: null }));
  };

  const handleUpdateOrder = async (orderId, status) => {
    console.log("update order", orderId, status);
    await dispatch(
      updateOrderStatus({
        orderId,
        orderStatus: status,
        jwt: localStorage.getItem("jwt"),
      }),
    );
    handleClose(orderId);
    // ← re-fetch orders so UI updates immediately
    dispatch(fetchSellerOrders(localStorage.getItem("jwt")));
  };

  useEffect(() => {
    dispatch(fetchSellerOrders(localStorage.getItem("jwt")));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order Id</StyledTableCell>
            <StyledTableCell>Products</StyledTableCell>
            <StyledTableCell align="right">Shipping Address</StyledTableCell>
            <StyledTableCell align="right">Order Status</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <StyledTableRow key={order._id}>
              <StyledTableCell component="th" scope="row">
                {order._id}
              </StyledTableCell>

              <StyledTableCell>
                <div className="flex gap-1 flex-wrap">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-5 flex-wrap">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col justify-between py-2">
                        <p>Title: {item.product.title}</p>
                        <p>Price: Rs {item.sellingPrice}</p>
                        <p>Color: {item.product.color}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </StyledTableCell>

              <StyledTableCell align="right">
                <p>
                  {order?.shippingAddress?.address || "N/A"},{" "}
                  {order?.shippingAddress?.locality || ""},{" "}
                  {order?.shippingAddress?.city || ""},{" "}
                  {order?.shippingAddress?.state || ""},{" "}
                  {order?.shippingAddress?.pincode || ""}
                </p>
              </StyledTableCell>

              <StyledTableCell align="right">
                {/* colored chip based on status */}
                <Chip
                  label={order.orderStatus}
                  color={statusColors[order.orderStatus] || "default"}
                  size="small"
                />
              </StyledTableCell>

              <StyledTableCell align="right">
                <Button
                  onClick={(e) => handleClick(e, order._id)}
                  color="primary"
                  size="small"
                  variant="outlined"
                >
                  Update Status
                </Button>
                {/* each row has its own Menu */}
                <Menu
                  anchorEl={anchorEls[order._id]}
                  open={Boolean(anchorEls[order._id])}
                  onClose={() => handleClose(order._id)}
                >
                  {orderStatusList.map((status) => (
                    <MenuItem
                      key={status.label}
                      onClick={() => handleUpdateOrder(order._id, status.label)}
                      sx={{ color: status.color }}
                    >
                      {status.label}
                    </MenuItem>
                  ))}
                </Menu>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
