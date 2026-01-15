import { Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentIcon from "@mui/icons-material/Payment";
import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from '../../Redux Toolkit/store';
import { performLogout } from '../../Redux Toolkit/features/Auth/AuthSlice';


const menu = [
  {
    name: "Dashboard",
    path: "/seller",
    icon: <DashboardIcon className="text-primar-color" />,
    activeIcon: <DashboardIcon className="text-white" />,
  },
  {
    name: "Orders",
    path: "/seller/orders",
    icon: <ShoppingBagIcon className="text-primary-color" />,
    activeIcon: <ShoppingBagIcon className="text-white" />,
  },
  {
    name: "Products",
    path: "/seller/products",
    icon: <InventoryIcon className="text-primary-color" />,
    activeIcon: <InventoryIcon className="text-white" />,
  },
  {
    name: "Payment",
    path: "/seller/payment",
    icon: <PaymentIcon className="text-primary-color" />,
    activeIcon: <PaymentIcon className="text-white" />,
  },
  {
    name: "Add Product",
    path: "/seller/add-product",
    icon: <AddIcon className="text-primary-color" />,
    activeIcon: <AddIcon className="text-white" />,
  },
  {
    name: "Transaction",
    path: "/seller/transaction",
    icon: <ReceiptIcon className="text-primary-color" />,
    activeIcon: <ReceiptIcon className="text-white" />,
  },
];

const menu2 = [
  {
    name: "Account",
    path: "/seller/account",
    icon: <AccountBoxIcon className="text-primary-color" />,
    activeIcon: <AccountBoxIcon className="text-white" />,
  },
  {
    name: "Logout",
    path: "/",
    icon: <LogoutIcon className="text-primary-color" />,
    activeIcon: <LogoutIcon className="text-white" />,
  },
];

const SellerDrawerList = ({toggleDrawer}) => {
    const location=useLocation();
    const dispatch=useAppDispatch();

    const navigate = useNavigate();

    const handleLogout=()=>{
      dispatch(performLogout())
        console.log("handle logout")
    }

    const handleClick=(item)=>{
        if(item.name==="Logout"){
            handleLogout();
        }
        navigate(item.path);
        // if (toggleDrawer)toggleDrawer(false)();
    }
  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-[300px] border-r border-gray-200 py-5">
        <div className="space-y-2">
          {menu.map((item, index) => (
            <div
              onClick={() => handleClick(item)}
              key={item.path}
              className="pr-9 cursor-pointer"
            >
              <p
                className={`${location.pathname === item.path ? "bg-[rgb(82,137,215)] text-white" : ""} 
                flex items-center px-5 py-3
                    rounded-r-full`}
              >
                <ListItemIcon>
                  {location.pathname === item.path
                    ? item.activeIcon
                    : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
            <Divider/>
          {menu2.map((item, index) => (
            <div
              onClick={() => handleClick(item)}
              key={item.path}
              className="pr-9 cursor-pointer"
            >
              <p
                className={`${location.pathname === item.path ? "bg-[rgb(82,137,215)] text-white" : ""} 
                flex items-center px-5 py-3
                    rounded-r-full`}
              >
                <ListItemIcon>
                  {location.pathname === item.path
                    ? item.activeIcon
                    : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerDrawerList
