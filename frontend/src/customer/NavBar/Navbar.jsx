import {
  Box,
  Button,
  Badge,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { mainCategory } from "../../data/Category/mainCategory";
import CategorySheet from "./CategorySheet";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchWishlist } from "../../Redux Toolkit/features/customer/wishlistSlice";
import { fetchCart } from "../../Redux Toolkit/features/customer/cartSlice";

const Navbar = () => {
  const { user } = useAppSelector((store) => store.user) ?? {};
  const cart = useAppSelector((store) => store.cart.cart);
  const { wishlist } = useAppSelector((store) => store.wishlist);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  const cartState = useAppSelector((store) => store.cart);
  console.log("cartState:", cartState);

  // Dynamic avatar — falls back to default if user has no profilePicture
  const avatarSrc =
    user?.profilePicture ||
    "https://falgowski.com/wp-content/uploads/2023/03/pixabay.jpg";

  useEffect(() => {
    if (jwt) dispatch(fetchWishlist(jwt));
    dispatch(fetchCart(jwt));
  }, [jwt, dispatch]);

  const cartCount = cart?.cartItems?.length || 0;
  const wishlistCount = wishlist?.products?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
    if (e.key === "Escape") {
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleMainCategoryClick = (categoryId) => {
    setShowSheet(false);
    setMobileOpen(false);
    navigate(`/products/${categoryId}`);
  };

  const mobileDrawer = (
    <Box sx={{ width: 270 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          bgcolor: "#4f46e5",
        }}
      >
        <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>
          Crystal Thread
        </span>
        <IconButton onClick={() => setMobileOpen(false)} size="small">
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>

      {user?.fullName && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.5,
              bgcolor: "#eef2ff",
            }}
          >
            <Avatar src={avatarSrc} sx={{ width: 36, height: 36 }} />
            <Box>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{user.fullName}</p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>{user.email}</p>
            </Box>
          </Box>
          <Divider />
        </>
      )}

      <List disablePadding>
        {mainCategory.map((item) => (
          <ListItem key={item.categoryid} disablePadding>
            <ListItemButton
              onClick={() => handleMainCategoryClick(item.categoryid)}
              sx={{ py: 1.5, px: 3 }}
            >
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1, px: 2, py: 2 }}
      >
        {user?.fullName ? (
          <Button
            onClick={() => {
              navigate("/account");
              setMobileOpen(false);
            }}
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<AccountCircleIcon />}
          >
            My Account
          </Button>
        ) : (
          <Button
            onClick={() => {
              navigate("/login");
              setMobileOpen(false);
            }}
            variant="contained"
            fullWidth
            size="small"
            startIcon={<AccountCircleIcon />}
          >
            Login
          </Button>
        )}
        <Button
          onClick={() => {
            navigate("/become-seller");
            setMobileOpen(false);
          }}
          startIcon={<StorefrontIcon />}
          variant="outlined"
          fullWidth
          size="small"
        >
          Become Seller
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box className="sticky top-0 left-0 right-0 bg-indigo-100 shadow-md z-50">
      <div className="flex items-center justify-between px-3 sm:px-5 lg:px-20 h-[64px] lg:h-[70px] border-b border-gray-200">
        {/* Left */}
        <div className="flex items-center gap-2 lg:gap-9">
          {!isLarge && (
            <IconButton onClick={() => setMobileOpen(true)} size="small">
              <MenuIcon sx={{ fontSize: 27 }} />
            </IconButton>
          )}
          <h1
            onClick={() => navigate("/")}
            className="logo text-2xl md:text-2xl cursor-pointer font-bold text-indigo-700"
          >
            Crystal Thread
          </h1>
          {isLarge && (
            <ul className="flex items-center font-medium text-gray-800">
              {mainCategory.map((item) => (
                <li
                  key={item.categoryid}
                  onMouseEnter={() => {
                    setShowSheet(true);
                    setSelectedCategory(item.categoryid);
                  }}
                  onMouseLeave={() => setShowSheet(false)}
                  onClick={() => handleMainCategoryClick(item.categoryid)}
                  className="hover:text-[#00927c] cursor-pointer hover:border-b-2 h-[70px] px-4 border-[#00927c] flex items-center transition-colors"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          {showSearch ? (
            <div className="flex items-center bg-white rounded-full px-2 py-0.5 shadow-inner border border-gray-300">
              <InputBase
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                sx={{ width: { xs: 120, sm: 180, md: 200 }, fontSize: 13 }}
              />
              <IconButton size="small" onClick={handleSearch}>
                <SearchIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          ) : (
            <IconButton onClick={() => setShowSearch(true)} size="small">
              <SearchIcon sx={{ fontSize: 24 }} />
            </IconButton>
          )}

          <Box
            sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center" }}
          >
            {user?.fullName ? (
              <Button
                onClick={() => navigate("/account")}
                size="small"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                {/* Dynamic avatar from Redux */}
                <Avatar src={avatarSrc} sx={{ width: 26, height: 26 }} />
                <span style={{ fontSize: 14 }}>{user.fullName}</span>
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                size="small"
                startIcon={<AccountCircleIcon />}
              >
                Login
              </Button>
            )}
          </Box>

          <IconButton
            onClick={() => navigate("/account/wishlist")}
            size="small"
          >
            <Badge badgeContent={wishlistCount} color="error">
              {wishlistCount > 0 ? (
                <FavoriteIcon sx={{ fontSize: 24, color: "#e53e3e" }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              )}
            </Badge>
          </IconButton>

          <IconButton onClick={() => navigate("/cart")} size="small">
            <Badge badgeContent={cartCount} color="primary">
              <AddShoppingCartIcon sx={{ fontSize: 24 }} />
            </Badge>
          </IconButton>

          <Button
            onClick={() => navigate("/become-seller")}
            startIcon={<StorefrontIcon />}
            variant="outlined"
            size="small"
            sx={{ display: { xs: "none", lg: "flex" }, whiteSpace: "nowrap" }}
          >
            Become Seller
          </Button>
        </div>
      </div>

      {showSheet && isLarge && (
        <div
          onMouseLeave={() => setShowSheet(false)}
          onMouseEnter={() => setShowSheet(true)}
          className="categorySheet absolute top-[4.4rem] left-20 right-20"
        >
          <CategorySheet
            selectedCategory={selectedCategory}
            setShowSheet={setShowSheet}
          />
        </div>
      )}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        {mobileDrawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
