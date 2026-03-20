import Radio from "@mui/material/Radio";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React from "react";

const Addresscard = ({
  value,
  selectedValue,
  handleChange,
  item,
  onDelete,
}) => {
  return (
    <div
      onClick={() => handleChange({ target: { value } })}
      className={`p-4 border-2 rounded-xl flex items-start gap-3 cursor-pointer transition-all duration-200 ${
        selectedValue === value
          ? "border-green-500 bg-green-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <Radio
        checked={selectedValue === value}
        value={value}
        onChange={handleChange}
        name="radio-buttons"
        size="small"
        sx={{
          padding: 0,
          mt: "2px",
          color: "#d1d5db",
          "&.Mui-checked": { color: "#22c55e" },
        }}
      />
      <div className="flex-1 min-w-0 space-y-1">
        <h1 className="font-semibold text-gray-800 text-sm">{item?.name}</h1>
        <p className="text-gray-600 text-xs leading-relaxed">
          {[
            item?.address,
            item?.locality,
            item?.city,
            item?.state,
            item?.pincode,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
        <p className="text-gray-500 text-xs">
          <strong>Mobile:</strong> {item?.mobile}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item?._id);
        }}
        className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-1"
        title="Remove address"
      >
        <DeleteOutlineIcon fontSize="small" />
      </button>
    </div>
  );
};

export default Addresscard;
