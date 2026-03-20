import React from "react";
import { Divider, Button } from "@mui/material";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { performLogout } from "../../../../Redux Toolkit/features/Auth/AuthSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import Order from "./Order";
import OrderDetails from "./OrderDetails";
import UserDetails from "../Account/UserDetails";

const menu = [
  { name: "Orders", path: "/account/orders" },
  { name: "Profile", path: "/account" },
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.user) ?? {};

  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/");
  };

  return (
    <div className="px-5 lg:px-52 min-h-screen mt-10">
      <div>
        <h1 className="text-xl font-bold pb-5">
          {user?.fullName || "My Account"}
        </h1>
      </div>
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]">
        {/* Sidebar */}
        <div
          className="col-span-1 lg:border-r border-gray-200 lg:pr-5 py-5 h-full
          flex flex-row flex-wrap lg:flex-col gap-3 lg:justify-between"
        >
          {/* Top menu items */}
          <div className="flex flex-row flex-wrap lg:flex-col gap-3">
            {menu.map((item) => (
              <div
                onClick={() => navigate(item.path)}
                className={`px-5 py-3 rounded-md cursor-pointer transition-colors
                  ${
                    location.pathname === item.path
                      ? "bg-sky-400 text-white"
                      : "hover:bg-sky-300 hover:text-white"
                  }`}
                key={item.path}
              >
                <p>{item.name}</p>
              </div>
            ))}
          </div>

          {/* Logout at bottom */}
          <div className="hidden lg:block">
            <Divider className="mb-3" />
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 rounded-md cursor-pointer
                hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors"
            >
              <LogoutIcon fontSize="small" />
              <p>Logout</p>
            </div>
          </div>

          {/* Logout for mobile */}
          <div className="lg:hidden">
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 rounded-md cursor-pointer
                hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors"
            >
              <LogoutIcon fontSize="small" />
              <p>Logout</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2 lg:pl-5 py-5">
          <Routes>
            <Route path="/" element={<UserDetails />} />
            <Route path="/orders" element={<Order />} />
            <Route
              path="/orders/:orderId/item/:orderItemId"
              element={<OrderDetails />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
