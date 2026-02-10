import React from "react";
import { Route, Routes } from "react-router";
import SellerTable from "../admin/Seller/SellerTable";
import Coupon from "../admin/Coupon/Coupon";
import CouponForm from "../admin/Coupon/CouponForm";
import GridTable from "../admin/HomePage/GridTable";
import ClothesTable from "../admin/HomePage/ClothesTable";
import ShopByCategory from "../admin/HomePage/ShopByCategory";
import Deal from "../admin/Deal/Deal";
import AdminStats from "../admin/Dashboard/Adminstats";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminStats />} />
      <Route path="/sellers" element={<SellerTable />} />
      <Route path="/coupon" element={<Coupon />} />
      <Route path="/add-coupon" element={<CouponForm />} />
      <Route path="/home-grid" element={<GridTable />} />
      <Route path="/clothes-category" element={<ClothesTable />} />
      <Route path="/shop-by-category" element={<ShopByCategory />} />
      <Route path="/deals" element={<Deal />} />
    </Routes>
  );
};

export default AdminRoutes;
