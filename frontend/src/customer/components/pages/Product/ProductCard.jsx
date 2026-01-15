import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../../Redux Toolkit/features/customer/wishlistSlice";

const ProductCard = ({ item }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((store) => store.wishlist);

  const jwt = localStorage.getItem("jwt");

  const isWishlisted = wishlist?.products?.some(
    (p) => (p._id || p)?.toString() === item._id?.toString(),
  );

  useEffect(() => {
    let interval;
    if (isHovered && item.images?.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % item.images.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isHovered, item.images]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!jwt) return alert("Please login to use wishlist.");
    if (isWishlisted) {
      dispatch(removeFromWishlist({ jwt, productId: item._id }));
    } else {
      dispatch(addToWishlist({ jwt, productId: item._id }));
    }
  };

  const handleNavigate = () => {
    navigate(`/product-details/${item.category}/${item.title}/${item._id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group w-[250px] cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-105 mt-5 relative"
    >
      {/* Wishlist icon overlay */}
      <div className="absolute top-2 right-2 z-10">
        <IconButton
          onClick={handleWishlistClick}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "white" },
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon fontSize="small" color="error" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>
      </div>

      <div
        className="relative h-80 overflow-hidden rounded-md cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        {item.inStock === false && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        {item.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={item.title}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ${
              item.inStock === false ? "opacity-50" : ""
            }`}
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
            }}
          />
        ))}
      </div>

      <div className="pt-3 space-y-1">
        <h2 className="font-semibold text-lg">{item.title}</h2>
        <p className="text-gray-500 text-sm">
          {item?.seller?.businessDetails?.businessName || "Crystal Thread"}
        </p>
        <div className="flex gap-3 items-center leading-none">
          <span className="text-green-600 font-semibold">
            NRs {item.sellingPrice}
          </span>
          {item.discountPercent > 0 && (
            <>
              <span className="line-through text-gray-400 text-sm">
                NRs {item.mrpPrice}
              </span>
              <span className="text-green-500 font-semibold text-sm">
                {item.discountPercent}% off
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
