import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import {
  fetchSellers,
  updateSellerAccountStatus,
} from "../../Redux Toolkit/features/seller/sellerSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

const accountStatuses = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANNED", title: "Banned" },
  { status: "CLOSED", title: "Closed" },
];

const getStatusMessage = (sellerName, status) => {
  const messages = {
    ACTIVE: `${sellerName} has been activated successfully.`,
    SUSPENDED: `${sellerName} has been suspended successfully.`,
    BANNED: `${sellerName} has been banned successfully.`,
    DEACTIVATED: `${sellerName} has been deactivated successfully.`,
    CLOSED: `${sellerName}'s account has been closed successfully.`,
    PENDING_VERIFICATION: `${sellerName} has been moved to Pending Verification.`,
  };
  return messages[status] || `${sellerName}'s status has been updated.`;
};

const getSnackbarSeverity = (status) => {
  if (status === "ACTIVE") return "success";
  if (status === "PENDING_VERIFICATION") return "info";
  if (status === "SUSPENDED" || status === "DEACTIVATED") return "warning";
  if (status === "BANNED" || status === "CLOSED") return "error";
  return "success";
};

export default function SellerTable() {
  const dispatch = useAppDispatch();
  const { sellers = [] } = useAppSelector((store) => store.seller);
  const [status, setStatus] = useState(accountStatuses[0].status);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleStatusChange = async (sellerId, newStatus, sellerName) => {
    await dispatch(
      updateSellerAccountStatus({ id: sellerId, status: newStatus }),
    );
    setSnackbar({
      open: true,
      message: getStatusMessage(sellerName, newStatus),
      severity: getSnackbarSeverity(newStatus),
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    dispatch(fetchSellers(status));
  }, [status]);

  return (
    <>
      <div className="pb-5 w-60">
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={handleChange}>
            {accountStatuses.map((s) => (
              <MenuItem key={s.status} value={s.status}>
                {s.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Mobile</StyledTableCell>
              <StyledTableCell align="right">Business Name</StyledTableCell>
              <StyledTableCell align="right">Account Status</StyledTableCell>
              <StyledTableCell align="right">Change Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.map((item) => (
              <StyledTableRow key={item._id}>
                <StyledTableCell component="th" scope="row">
                  {item.sellerName}
                </StyledTableCell>
                <StyledTableCell align="right">{item.email}</StyledTableCell>
                <StyledTableCell align="right">{item.mobile}</StyledTableCell>
                <StyledTableCell align="right">
                  {item.businessDetails?.businessName}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {item.accountStatus}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Select
                    size="small"
                    value={item.accountStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        item._id,
                        e.target.value,
                        item.sellerName,
                      )
                    }
                  >
                    {accountStatuses.map((s) => (
                      <MenuItem key={s.status} value={s.status}>
                        {s.title}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
