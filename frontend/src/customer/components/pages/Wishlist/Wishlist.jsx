import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { fetchWishlist, removeFromWishlist } from "../../../../Redux Toolkit/features/customer/wishlistSlice";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { addItemToCart } from "../../../../Redux Toolkit/features/customer/cartSlice";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useAppSelector((store) => store.wishlist);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) dispatch(fetchWishlist(jwt));
  }, [jwt, dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist({ jwt, productId }));
  };

  const handleAddToCart = (productId) => {
    if (!jwt) return alert("Please login first.");
    dispatch(addItemToCart({ jwt, request: { productId, size: "M", quantity: 1 } }));
  };

  const products = wishlist?.products || [];

  return (
    <div className="min-h-screen px-5 lg:px-20 pt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist ({products.length})</h1>

      {loading && <p className="text-gray-400">Loading wishlist...</p>}

      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Your wishlist is empty.</p>
          <Button
            variant="contained"
            className="mt-4"
            onClick={() => navigate("/products/men")}
          >
            Start Shopping
          </Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item._id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="h-56 overflow-hidden cursor-pointer"
              onClick={() =>
                navigate(`/product-details/${item.category}/${item.title}/${item._id}`)
              }
            >
              <img
                src={item.images?.[0]}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-3 space-y-1">
              <p className="font-medium text-sm text-gray-800 truncate">{item.title}</p>
              <div className="flex gap-2 items-center">
                <span className="text-green-600 font-semibold text-sm">
                  Rs {item.sellingPrice}
                </span>
                <span className="line-through text-gray-400 text-xs">
                  Rs {item.mrpPrice}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  startIcon={<AddShoppingCartIcon fontSize="small" />}
                  onClick={() => handleAddToCart(item._id)}
                >
                  Add to Cart
                </Button>
                <IconButton size="small" color="error" onClick={() => handleRemove(item._id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
