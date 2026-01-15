import React, { useEffect } from "react";
import { Card, Divider, CircularProgress } from "@mui/material";
import { fetchSellerReport } from "../../Redux Toolkit/features/seller/sellerSlice";
import { fetchSellerOrders } from "../../Redux Toolkit/features/seller/sellerOrderSlice";
import { fetchTransactionsBySeller } from "../../Redux Toolkit/features/seller/transactionSlice";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingIcon from "@mui/icons-material/Pending";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

const StatCard = ({ icon, title, value, subtitle, color }) => (
  <Card className="p-5 rounded-md space-y-2">
    <div className="flex items-center gap-2 text-gray-500">
      <span style={{ color }}>{icon}</span>
      <p className="text-sm">{title}</p>
    </div>
    <h1 className="font-bold text-2xl" style={{ color }}>
      {value}
    </h1>
    <Divider />
    <p className="text-xs text-gray-500">{subtitle}</p>
  </Card>
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { report, loading } = useAppSelector((store) => store.seller);
  const { orders = [] } = useAppSelector((store) => store.sellerOrder);
  const { transactions = [] } = useAppSelector((store) => store.transaction);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(fetchSellerReport(jwt));
    dispatch(fetchSellerOrders(jwt));
    dispatch(fetchTransactionsBySeller(jwt));
  }, []);

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "PENDING",
  ).length;
  const shippedOrders = orders.filter(
    (o) => o.orderStatus === "SHIPPED",
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "DELIVERED",
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.orderStatus === "CANCELLED",
  ).length;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Revenue */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
          Revenue
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<AccountBalanceWalletIcon />}
            title="Total Earnings"
            value={`Rs ${(report?.totalEarnings || 0).toLocaleString()}`}
            subtitle={`Net: Rs ${(report?.netEarnings || 0).toLocaleString()}`}
            color="#16a34a"
          />
          <StatCard
            icon={<TrendingUpIcon />}
            title="Total Sales"
            value={`Rs ${(report?.totalSales || 0) .toLocaleString()}`}
            subtitle={`${report?.totalOrders || 0} total orders`}
            color="#7c3aed"
          />
          <StatCard
            icon={<ShoppingBagIcon />}
            title="Total Transactions"
            value={report?.totalTransactions || 0}
            subtitle="Completed payments"
            color="#2563eb"
          />
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
          Orders
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<PendingIcon />}
            title="Pending"
            value={pendingOrders}
            subtitle="Awaiting processing"
            color="#f59e0b"
          />
          <StatCard
            icon={<LocalShippingIcon />}
            title="Shipped"
            value={shippedOrders}
            subtitle="On the way"
            color="#3b82f6"
          />
          <StatCard
            icon={<ShoppingBagIcon />}
            title="Delivered"
            value={deliveredOrders}
            subtitle="Successfully delivered"
            color="#16a34a"
          />
          <StatCard
            icon={<CancelIcon />}
            title="Cancelled"
            value={cancelledOrders}
            subtitle={`Refunds: Rs ${(report?.totalRefunds || 0) .toLocaleString()}`}
            color="#ef4444"
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
          Recent Transactions
        </h2>
        <Card className="rounded-md overflow-hidden">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((t, index) => (
              <div key={t._id}>
                <div className="flex justify-between items-center px-5 py-3">
                  <div>
                    <p className="font-medium text-sm">
                      {t.customer?.fullName || "Customer"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      Rs{" "}
                      {
                        (t.order?.totalSellingPrice || 0) 
                      .toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t.order?.orderStatus || "N/A"}
                    </p>
                  </div>
                </div>
                {index < recentTransactions.length - 1 && <Divider />}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-5 text-sm">
              No transactions yet
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
