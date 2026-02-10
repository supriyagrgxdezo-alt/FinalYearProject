import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function SellerProtectedRoute({ children }) {
  const { profile, loading } = useSelector((store) => store.seller);

  if (loading) return <div>Loading...</div>;

  if (!profile) return <Navigate to="/seller/login" />;

  const status = profile.accountStatus;


  if (status === "PENDING_VERIFICATION") {
    return <h2>Your account is under review. Please wait for approval.</h2>;
  }

  if (status === "SUSPENDED") {
    return <h2>Your account is suspended. Contact support.</h2>;
  }

  if (status === "BANNED") {
    return <h2>Your account is permanently banned.</h2>;
  }

  if (status === "CLOSED" || status === "DEACTIVATED") {
    return <h2>Your account is closed. You cannot access the dashboard.</h2>;
  }


  return children;
}
