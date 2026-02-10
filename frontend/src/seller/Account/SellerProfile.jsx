import React, { useRef, useState } from "react";
import { Avatar, CircularProgress, Snackbar, Alert } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ProfileCard from "../../customer/components/pages/Account/ProfileFieldCard";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  fetchSellerProfile,
  updateSellerProfile,
} from "../../Redux Toolkit/features/seller/sellerSlice";

const SellerProfile = () => {
  const { profile, loading } = useAppSelector((store) => store.seller);
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");
  const fileInputRef = useRef();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const avatarSrc =
    profile?.profilePicture ||
    "https://png.pngtree.com/png-clipart/20250111/original/pngtree-flat-design-female-avatar-icon-with-blue-shirt-simple-and-professional-png-image_19050517.png";

  const handleFieldSave = async (field, newValue) => {
    if (!newValue?.trim()) return;
    try {
      await dispatch(
        updateSellerProfile({ jwt, data: { [field]: newValue.trim() } }),
      ).unwrap();
      await dispatch(fetchSellerProfile(jwt));
      setSnackbar({
        open: true,
        message: "Profile updated!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err || "Update failed.",
        severity: "error",
      });
    }
  };

  const compressImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 300;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          }
        } else {
          if (height > MAX) {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = url;
    });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select a valid image.",
        severity: "error",
      });
      return;
    }
    try {
      const compressed = await compressImage(file);
      await dispatch(
        updateSellerProfile({ jwt, data: { profilePicture: compressed } }),
      ).unwrap();
      await dispatch(fetchSellerProfile(jwt));
      setSnackbar({
        open: true,
        message: "Profile picture updated!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err || "Picture update failed.",
        severity: "error",
      });
    }
    e.target.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar
            src={avatarSrc}
            sx={{ width: 96, height: 96, border: "3px solid #6366f1" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700
                       text-white rounded-full p-1.5 transition-colors"
            title="Change profile picture"
          >
            <PhotoCameraIcon sx={{ fontSize: 16 }} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <p className="mt-3 text-lg font-semibold text-gray-800">
          {profile?.sellerName || "—"}
        </p>
        <p className="text-sm text-gray-500">{profile?.email || "—"}</p>
      </div>

      {/* Saving indicator */}
      {loading && (
        <div className="flex items-center justify-center gap-2 mb-4 text-sm text-indigo-600">
          <CircularProgress size={14} sx={{ color: "#6366f1" }} />
          <span>Saving...</span>
        </div>
      )}

      {/* Fields */}
      <div className="space-y-3">
        <ProfileCard
          keys="Seller Name"
          value={profile?.sellerName}
          onSave={(val) => handleFieldSave("sellerName", val)}
          saving={loading}
        />
        <ProfileCard
          keys="Email"
          value={profile?.email}
          onSave={(val) => handleFieldSave("email", val)}
          editable={false}
        />
        <ProfileCard
          keys="Mobile"
          value={profile?.mobile}
          onSave={(val) => handleFieldSave("mobile", val)}
          saving={loading}
        />
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SellerProfile;
