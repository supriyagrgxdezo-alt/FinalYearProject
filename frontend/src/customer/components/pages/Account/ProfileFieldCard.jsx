import { Divider, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";

const ProfileCard = ({
  keys,
  value,
  onSave,
  editable = true,
  saving = false,
}) => {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value || "");

  const handleSave = async () => {
    if (!input.trim()) return;
    await onSave?.(input);
    setEditing(false);
  };

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  const handleCancel = () => {
    setInput(value || "");
    setEditing(false);
  };

  return (
    <div className="p-5 flex items-center bg-slate-50 rounded-lg">
      <p className="w-20 lg:w-36 pr-5 text-gray-500 text-sm">{keys}</p>
      <Divider orientation="vertical" flexItem />
      {editing ? (
        <div className="flex items-center gap-2 pl-4 lg:pl-10 flex-1">
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            size="small"
            autoFocus
            variant="outlined"
            sx={{ flex: 1, maxWidth: 280 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <IconButton
            size="small"
            onClick={handleSave}
            disabled={saving}
            sx={{ color: saving ? "#9ca3af" : "#16a34a" }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleCancel}
            sx={{ color: "#dc2626" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-1 pl-4 lg:pl-10">
          <p className="font-semibold lg:text-lg">
            {value || (
              <span className="text-gray-400 font-normal text-sm">
                Not provided
              </span>
            )}
          </p>
          {editable && (
            <IconButton
              size="small"
              onClick={() => {
                setInput(value || "");
                setEditing(true);
              }}
            >
              <EditIcon fontSize="small" sx={{ color: "#6366f1" }} />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
