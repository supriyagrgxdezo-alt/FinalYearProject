import React from "react";
import { useNavigate } from "react-router";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Divider, IconButton } from "@mui/material";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="lg:px-20 px-5 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <h1 className="logo text-3xl text-white">Crystal Thread</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your one-stop destination for trendy and affordable fashion. Shop
            the latest styles for men, women, and kids.
          </p>
          <div className="flex gap-2">
            <IconButton sx={{ color: "#9ca3af" }} size="small">
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: "#9ca3af" }} size="small">
              <InstagramIcon />
            </IconButton>
            <IconButton sx={{ color: "#9ca3af" }} size="small">
              <TwitterIcon />
            </IconButton>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-lg">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "Products", path: "/products/all" },
              { label: "Cart", path: "/cart" },
              { label: "My Orders", path: "/account/orders" },
              { label: "Become a Seller", path: "/become-seller" },
            ].map((item) => (
              <li
                key={item.path}
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:text-white transition-colors"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>


        <div className="space-y-4">
          <h2 className="text-white font-semibold text-lg">Customer Support</h2>
          <ul className="space-y-2 text-sm">
            {[
              { label: "FAQ", path: "/faq" },
              { label: "Shipping Policy", path: "/shipping-policy" },
              { label: "Return & Refund Policy", path: "/return-policy" },
              { label: "Privacy Policy", path: "/privacy-policy" },
              { label: "Terms & Conditions", path: "/terms" },
            ].map((item) => (
              <li
                key={item.label}
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:text-white transition-colors"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-lg">Contact Us</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <LocationOnIcon fontSize="small" className="text-green-400" />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon fontSize="small" className="text-green-400" />
              <span>+977 9800000000</span>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon fontSize="small" className="text-green-400" />
              <span>support@crystalthread.com</span>
            </div>
            <div className="flex items-center gap-2">
              <StorefrontIcon fontSize="small" className="text-green-400" />
              <span
                onClick={() => navigate("/become-seller")}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Sell on Crystal Thread
              </span>
            </div>
          </div>
        </div>
      </div>

      <Divider sx={{ borderColor: "#374151" }} />

      <div className="px-5 lg:px-20 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
        <p>© 2026 Crystal Thread. All rights reserved.</p>
        <p>Made with ❤️ in Nepal</p>
      </div>
    </footer>
  );
};

export default Footer;
