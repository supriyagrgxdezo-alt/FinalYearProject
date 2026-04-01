import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import store, { useAppSelector } from "../../Redux Toolkit/store";
import { performLogout } from "../../Redux Toolkit/features/Auth/AuthSlice";
import { useAppDispatch } from "../../Redux Toolkit/store";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon className="text-primary-color" />,
    activeIcon: <DashboardIcon className="text-white" />,
  },
  {
    name: "Sellers",
    path: "/admin/sellers",
    icon: <PeopleIcon className="text-primary-color" />,
    activeIcon: <PeopleIcon className="text-white" />,
  },
  {
    name: "Coupons",
    path: "/admin/coupon",
    icon: <IntegrationInstructionsIcon className="text-primary-color" />,
    activeIcon: <IntegrationInstructionsIcon className="text-white" />,
  },
  {
    name: "Add New Coupon",
    path: "/admin/add-coupon",
    icon: <AddIcon className="text-primary-color" />,
    activeIcon: <AddIcon className="text-white" />,
  },
  {
    name: "Home Page",
    path: "/admin/home-grid",
    icon: <HomeIcon className="text-primary-color" />,
    activeIcon: <HomeIcon className="text-white" />,
  },
  {
    name: "Clothes Category",
    path: "/admin/clothes-category",
    icon: <CheckroomIcon className="text-primary-color" />,
    activeIcon: <CheckroomIcon className="text-white" />,
  },
  {
    name: "Shop By Category",
    path: "/admin/shop-by-category",
    icon: <CategoryIcon className="text-primary-color" />,
    activeIcon: <CategoryIcon className="text-white" />,
  },
  {
    name: "Deals",
    path: "/admin/deals",
    icon: <LocalOfferIcon className="text-primary-color" />,
    activeIcon: <LocalOfferIcon className="text-white" />,
  },
];

const menu2 = [
  {
    name: "Logout",
    path: "/",
    icon: <LogoutIcon className="text-primary-color" />,
    activeIcon: <LogoutIcon className="text-white" />,
  },
];

const AdminDrawerList = ({ toggleDrawer }) => {
  const user = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/");
  };

  const handleClick = (item) => {
    if (item.name === "Logout") {
      handleLogout();
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-[300px] border-r border-gray-200 py-5">
        <div className="space-y-2">
          {menu.map((item) => (
            <div
              onClick={() => handleClick(item)}
              key={item.path}
              className="pr-9 cursor-pointer"
            >
              <p
                className={`${
                  location.pathname === item.path
                    ? "bg-[rgb(82,137,215)] text-white"
                    : ""
                } flex items-center px-5 py-3 rounded-r-full`}
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
          <Divider />
          <Divider />
          {menu2.map((item) => (
            <div
              onClick={() => handleClick(item)}
              key={item.path}
              className="pr-9 cursor-pointer"
            >
              <p
                className={`${
                  location.pathname === item.path
                    ? "bg-[rgb(82,137,215)] text-white"
                    : ""
                } flex items-center px-5 py-3 rounded-r-full`}
              >
                <ListItemIcon>
                  {location.pathname === item.path
                    ? item.activeIcon
                    : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
                <span className="text-sm font-medium">
                  {user.user?.fullName}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDrawerList;
