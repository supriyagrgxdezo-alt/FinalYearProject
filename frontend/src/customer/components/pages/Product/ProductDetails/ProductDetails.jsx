import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import Divider from "@mui/material/Divider";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WalletIcon from "@mui/icons-material/Wallet";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SimilarProduct from "./SimilarProduct";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../Redux Toolkit/store";
import {
  fetchProductById,
  fetchSimilarProducts,
} from "../../../../../Redux Toolkit/features/customer/productSlice";
import { useNavigate, useParams } from "react-router";
import { addItemToCart } from "../../../../../Redux Toolkit/features/customer/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../../../../../Redux Toolkit/features/customer/wishlistSlice";

const MAX_QUANTITY = 20;
const MIN_QUANTITY = 1;

const ProductDetails = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [outOfStockMsg, setOutOfStockMsg] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", color: "" });

  const dispatch = useAppDispatch();
  const product = useAppSelector((store) => store.product);
  const { wishlist } = useAppSelector((store) => store.wishlist);
  const { productId } = useParams();
  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
      dispatch(fetchSimilarProducts(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (jwt) dispatch(fetchWishlist(jwt));
  }, [jwt, dispatch]);

  useEffect(() => {
    setQuantity(1);
    setCurrentImage(0);
  }, [productId]);

  const showToast = (message, color = "green") => {
    setToast({ show: true, message, color });
    setTimeout(() => setToast({ show: false, message: "", color: "" }), 3000);
  };

  const isWishlisted = wishlist?.products?.some(
    (p) => (p._id || p) === productId,
  );

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < MIN_QUANTITY) return MIN_QUANTITY;
      if (next > MAX_QUANTITY) return MAX_QUANTITY;
      return next;
    });
  };

  const handleQuantityInput = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    if (val < MIN_QUANTITY) setQuantity(MIN_QUANTITY);
    else if (val > MAX_QUANTITY) setQuantity(MAX_QUANTITY);
    else setQuantity(val);
  };

  const handleAddCartItem = () => {
    if (!jwt) return alert("Please login to add items to cart.");
    if (currentProduct?.inStock === false) {
      setOutOfStockMsg(true);
      setTimeout(() => setOutOfStockMsg(false), 3000);
      return;
    }
    const request = { size: "M", productId: product.product?._id, quantity };
    dispatch(addItemToCart({ jwt, request }))
      .unwrap()
      .then(() => showToast("✓ Added to cart!"))
      .catch(() => showToast("Failed to add to cart.", "red"));
  };

  const handleWishlistToggle = () => {
    if (!jwt) return alert("Please login to use wishlist.");
    if (isWishlisted) {
      dispatch(removeFromWishlist({ jwt, productId }))
        .unwrap()
        .then(() => showToast("Removed from wishlist.", "gray"));
    } else {
      dispatch(addToWishlist({ jwt, productId }))
        .unwrap()
        .then(() => showToast("Added to wishlist!", "pink"));
    }
  };

  const currentProduct = product.product;

  return (
    <div className="min-h-screen px-5 lg:px-20 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Section */}
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-col gap-3">
            {currentProduct?.images?.map((item, index) => (
              <img
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`lg:w-full w-12 cursor-pointer rounded-md border-2 transition-all ${
                  currentImage === index
                    ? "border-emerald-500"
                    : "border-transparent"
                }`}
                src={item}
                alt={`thumb-${index}`}
              />
            ))}
          </div>
          <div className="w-full lg:w-[85%]">
            <img
              src={currentProduct?.images?.[currentImage]}
              className="w-full rounded-md object-cover"
              alt={currentProduct?.title}
            />
          </div>
        </section>

        {/* Details Section */}
        <section>
          <h1 className="font-bold text-lg text-emerald-600">
            {currentProduct?.seller?.businessDetails?.businessName ||
              "Crystal Thread"}
          </h1>
          <p className="text-gray-500 font-semibold">{currentProduct?.title}</p>

          <div className="flex justify-between items-center py-2 border border-gray-200 w-44 px-3 mt-5">
            <div className="flex gap-1 items-center">
              <span>4</span>
              <StarIcon color="primary" />
            </div>
            <Divider orientation="vertical" flexItem />
            <span>478 Ratings</span>
          </div>

          <div className="space-y-2 pt-5">
            <div className="flex gap-3 items-center">
              <span className="text-green-600 font-semibold text-xl">
                Rs {currentProduct?.sellingPrice}
              </span>
              {currentProduct?.discountPercent > 0 && (
                <>
                  <span className="line-through text-gray-400">
                    Rs {currentProduct?.mrpPrice}
                  </span>
                  <span className="text-green-500 font-semibold">
                    {currentProduct?.discountPercent}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Inclusive of all taxes. Free Shipping above Rs 1500.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4">
              <VerifiedUserIcon color="primary" />
              <p>Authentic &amp; Quality Assured</p>
            </div>
            <div className="flex items-center gap-4">
              <WorkspacePremiumIcon color="primary" />
              <p>100% Money back guarantee</p>
            </div>
            <div className="flex items-center gap-4">
              <LocalShippingIcon color="primary" />
              <p>Free Shipping &amp; Returns</p>
            </div>
            <div className="flex items-center gap-4">
              <WalletIcon color="primary" />
              <p>Pay on delivery might be available</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-7 space-y-2">
            <h1 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
              Quantity{" "}
              <span className="text-gray-400 font-normal">
                (Max: {MAX_QUANTITY})
              </span>
            </h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleQuantityChange(-1)}
                variant="outlined"
                size="small"
                disabled={quantity <= MIN_QUANTITY}
              >
                <RemoveIcon fontSize="small" />
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityInput}
                min={MIN_QUANTITY}
                max={MAX_QUANTITY}
                className="w-14 text-center border border-gray-300 rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:border-emerald-500"
              />
              <Button
                onClick={() => handleQuantityChange(1)}
                variant="outlined"
                size="small"
                disabled={quantity >= MAX_QUANTITY}
              >
                <AddIcon fontSize="small" />
              </Button>
            </div>
            {quantity >= MAX_QUANTITY && (
              <p className="text-xs text-amber-600">
                Maximum quantity reached (20).
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col gap-3">
            {!jwt && (
              <p className="text-sm text-amber-600 font-medium text-center">
                Please{" "}
                <span
                  className="underline cursor-pointer text-indigo-600"
                  onClick={() => navigate("/login")}
                >
                  login
                </span>{" "}
                to add items to cart or wishlist.
              </p>
            )}

            <div className="flex items-center gap-5">
              <div className="flex flex-col gap-1 w-full">
                <Button
                  startIcon={<AddShoppingCartIcon />}
                  variant="outlined"
                  fullWidth
                  sx={{ py: "1rem" }}
                  onClick={handleAddCartItem}
                >
                  {currentProduct?.inStock === false
                    ? "Out of Stock"
                    : "Add to Bag"}
                </Button>
                {outOfStockMsg && (
                  <p className="text-red-600 text-sm font-medium text-center">
                    Sorry, this product is currently out of stock.
                  </p>
                )}
              </div>

              <Button
                startIcon={
                  isWishlisted ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                variant="outlined"
                fullWidth
                sx={{
                  py: "1rem",
                  color: isWishlisted ? "error.main" : "inherit",
                  borderColor: isWishlisted ? "error.main" : "inherit",
                }}
                onClick={handleWishlistToggle}
                disabled={!jwt}
              >
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-gray-600 leading-relaxed">
              {currentProduct?.description}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-20">
        <h1 className="text-lg font-bold">Similar Products</h1>
        <div className="pt-5">
          <SimilarProduct currentProductId={productId} />
        </div>
      </section>

      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 
          rounded-full shadow-lg text-white font-medium text-sm transition-all
          ${
            toast.color === "green"
              ? "bg-green-500"
              : toast.color === "pink"
                ? "bg-pink-500"
                : toast.color === "gray"
                  ? "bg-gray-500"
                  : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
