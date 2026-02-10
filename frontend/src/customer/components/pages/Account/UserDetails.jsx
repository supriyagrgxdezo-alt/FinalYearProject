import React, { useState, useRef } from "react";
import ProfileCard from "./ProfileFieldCard";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../Redux Toolkit/store";
import { Avatar, CircularProgress, Snackbar, Alert } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { fetchUserProfile, updateUserProfile } from "../../../../Redux Toolkit/features/customer/userSlice";

const UserDetails = () => {

  const { user, updateLoading } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef();


  const avatarSrc =
    user?.profilePicture ||
    user?.avatar ||
    "https://falgowski.com/wp-content/uploads/2023/03/pixabay.jpg";

const handleFieldSave = async (field, newValue) => {
  if (!newValue?.trim()) return;
  try {
    await dispatch(
      updateUserProfile({ jwt, data: { [field]: newValue.trim() } }),
    ).unwrap();
    await dispatch(fetchUserProfile(jwt)); 
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

  try {
    const compressed = await compressImage(file);
    await dispatch(
      updateUserProfile({ jwt, data: { profilePicture: compressed } }),
    ).unwrap();
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
          {user?.fullName || "—"}
        </p>
        <p className="text-sm text-gray-500">{user?.email || "—"}</p>
      </div>

      {/* Saving indicator */}
      {updateLoading && (
        <div className="flex items-center justify-center gap-2 mb-4 text-sm text-indigo-600">
          <CircularProgress size={14} sx={{ color: "#6366f1" }} />
          <span>Saving...</span>
        </div>
      )}

      {/* Fields */}
      <div className="space-y-3">
        <ProfileCard
          keys="Name"
          value={user?.fullName}
          onSave={(val) => handleFieldSave("fullName", val)}
          saving={updateLoading}
        />
        <ProfileCard
          keys="Email"
          value={user?.email}
          onSave={(val) => handleFieldSave("email", val)}
          editable={false}
        />
        <ProfileCard
          keys="Mobile"
          // ✅ checks all possible backend field names
          value={
            user?.mobile ||
            user?.phone ||
            user?.phoneNumber ||
            user?.mobileNumber
          }
          onSave={(val) => handleFieldSave("mobile", val)}
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

export default UserDetails;
