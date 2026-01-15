import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  updateProduct,
  deleteProduct,
} from "../../Redux Toolkit/features/seller/sellerProductSlice";
import { updateStockStatus } from "../../Redux Toolkit/features/customer/productSlice";

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

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleEditOpen = (item) => {
    setSelectedProduct(item);
    setFormData({
      title: item.title,
      description: item.description,
      mrpPrice: item.mrpPrice,
      sellingPrice: item.sellingPrice,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteOpen = (item) => {
    setSelectedProduct(item);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const mrp = parseFloat(formData.mrpPrice);
    const selling = parseFloat(formData.sellingPrice);
    const discountPercent =
      mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0;

    try {
      await dispatch(
        updateProduct({
          jwt,
          productId: selectedProduct._id,
          product: { ...formData, discountPercent },
        }),
      ).unwrap();
      setSnackbar({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });
      handleEditClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Update failed: " + err,
        severity: "error",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(
        deleteProduct({ jwt, productId: selectedProduct._id }),
      ).unwrap();
      setSnackbar({
        open: true,
        message: "Product deleted successfully!",
        severity: "success",
      });
      handleDeleteClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Delete failed: " + err,
        severity: "error",
      });
    }
  };

  const handleStockToggle = async (item) => {
    try {
      await dispatch(
        updateStockStatus({
          productId: item._id,
          inStock: !item.inStock,
        }),
      ).unwrap();
      setSnackbar({
        open: true,
        message: `Product marked as ${!item.inStock ? "In Stock" : "Out of Stock"}`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update stock",
        severity: "error",
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Images</StyledTableCell>
              <StyledTableCell align="right">Title</StyledTableCell>
              <StyledTableCell align="right">MRP</StyledTableCell>
              <StyledTableCell align="right">Selling Price</StyledTableCell>
              <StyledTableCell align="right">Stock Status</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellerProduct.products.map((item) => (
              <StyledTableRow key={item._id}>
                <StyledTableCell component="th" scope="row">
                  <div className="flex gap-1 flex-wrap">
                    {item.images?.map((img, index) => (
                      <img
                        key={index}
                        className="w-20 rounded"
                        src={img}
                        alt=""
                      />
                    ))}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">{item.title}</StyledTableCell>
                <StyledTableCell align="right">
                  N₨{item.mrpPrice}
                </StyledTableCell>
                <StyledTableCell align="right">
                  N₨{item.sellingPrice}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    color={item.inStock !== false ? "success" : "error"}
                    onClick={() => handleStockToggle(item)}
                  >
                    {item.inStock !== false ? "In Stock" : "Out of Stock"}
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditOpen(item)}
                  >
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOpen(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          <TextField
            label="Title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <div className="flex gap-3">
            <TextField
              label="MRP Price"
              name="mrpPrice"
              type="number"
              value={formData.mrpPrice || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Selling Price"
              name="sellingPrice"
              type="number"
              value={formData.sellingPrice || ""}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="flex gap-3">
            <TextField
              label="Color"
              name="color"
              value={formData.color || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Size"
              name="size"
              value={formData.size || ""}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity || ""}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedProduct?.title}</strong>? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
