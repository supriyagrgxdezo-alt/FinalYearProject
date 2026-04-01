import React, { useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { api } from "../../config/api";

const statCards = (stats) => [
  {
    label: "Total Revenue",
    value: `Rs ${stats.totalRevenue?.toLocaleString() || 0}`,
    icon: <CurrencyRupeeIcon fontSize="large" />,
    bg: "bg-green-50",
    iconColor: "text-green-600",
    border: "border-green-200",
  },
  {
    label: "Total Orders",
    value: stats.totalOrders || 0,
    icon: <ShoppingBagIcon fontSize="large" />,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-blue-200",
  },
  {
    label: "Total Customers",
    value: stats.totalCustomers || 0,
    icon: <PeopleIcon fontSize="large" />,
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    border: "border-purple-200",
  },
  {
    label: "Total Sellers",
    value: stats.totalSellers || 0,
    icon: <StorefrontIcon fontSize="large" />,
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
    border: "border-orange-200",
  },
  {
    label: "Total Products",
    value: stats.totalProducts || 0,
    icon: <InventoryIcon fontSize="large" />,
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
    border: "border-pink-200",
  },
];

const AdminStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards(stats).map((card) => (
        <div
          key={card.label}
          className={`${card.bg} ${card.border} border rounded-xl p-4 flex flex-col gap-2`}
        >
          <div className={`${card.iconColor}`}>{card.icon}</div>
          <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          <p className="text-sm text-gray-500">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
