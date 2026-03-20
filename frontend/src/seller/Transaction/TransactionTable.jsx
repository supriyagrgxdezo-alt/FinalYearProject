import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useEffect } from "react";
import { fetchTransactionsBySeller } from "../../Redux Toolkit/features/seller/transactionSlice";

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

const statusColors = {
  COMPLETED: "success",
  PENDING: "warning",
  FAILED: "error",
  PROCESSING: "info",
};

export default function TransactionTable() {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((store) => store.transaction);

  useEffect(() => {
    dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt")));
  }, []);

  // format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="transactions table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Customer</StyledTableCell>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell align="right">Order Status</StyledTableCell>
            <StyledTableCell align="right">Payment</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <StyledTableRow key={transaction._id}>
                {/* Date */}
                <StyledTableCell>
                  <p className="text-sm">{formatDate(transaction.date)}</p>
                </StyledTableCell>

                {/* Customer */}
                <StyledTableCell>
                  <p className="font-medium">
                    {transaction.customer?.fullName || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.customer?.email || ""}
                  </p>
                </StyledTableCell>

                {/* Order ID */}
                <StyledTableCell>
                  <p className="text-xs text-gray-600">
                    {transaction.order?._id || "N/A"}
                  </p>
                </StyledTableCell>

                {/* Order Status */}
                <StyledTableCell align="right">
                  <Chip
                    label={transaction.order?.orderStatus || "N/A"}
                    color={
                      statusColors[transaction.order?.orderStatus] || "default"
                    }
                    size="small"
                  />
                </StyledTableCell>

                {/* Payment Status */}
                <StyledTableCell align="right">
                  <Chip
                    label={transaction.order?.paymentStatus || "N/A"}
                    color={
                      statusColors[transaction.order?.paymentStatus] ||
                      "default"
                    }
                    size="small"
                  />
                </StyledTableCell>

                {/* Amount */}
                <StyledTableCell align="right">
                  <p className="font-semibold text-green-600">
                    Rs{" "}
                    {(
                      transaction.order?.totalSellingPrice || 0
                    ).toLocaleString()}
                  </p>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={6} align="center">
                <p className="text-gray-500 py-5">No transactions found</p>
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
