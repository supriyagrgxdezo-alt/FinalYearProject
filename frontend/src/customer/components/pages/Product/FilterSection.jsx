import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { useState } from "react";
import { green } from "@mui/material/colors";
import { colors } from "../../../../data/filters/color";
import { price } from "../../../../data/filters/price";
import { useSearchParams } from "react-router";

const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedColor = searchParams.get("color") || "";
  const selectedPrice = searchParams.get("priceRange") || "";

  const handleColorChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("color", e.target.value);
    setSearchParams(params);
  };

  const handlePriceChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("priceRange", e.target.value);

    const selected = price.find((p) => p.name === e.target.value);
    if (selected) {
      params.set("minPrice", selected.min);
      if (selected.max !== null) {
        params.set("maxPrice", selected.max);
      } else {
        params.delete("maxPrice");
      }
    }
    setSearchParams(params);
  };

  const handleClearAll = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-5 bg-white">
      <div className="flex items-center justify-between h-10 px-9 lg:border-r">
        <p className="text-lg font-semibold">Filters</p>
        <Button onClick={handleClearAll} variant="outlined" size="small">
          Clear all
        </Button>
      </div>
      <Divider />
      <div className="px-9 space-y-6 mt-5">
        {/* Color */}
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: green[600] }}
            >
              Color
            </FormLabel>
            <RadioGroup value={selectedColor} onChange={handleColorChange}>
              {colors.slice(0, expendColor ? colors.length : 5).map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Button onClick={() => setExpendColor(!expendColor)}>
            {expendColor ? "Hide" : `+ ${colors.length - 5} more`}
          </Button>
          <Divider />
        </section>

        {/* Price */}
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: green[600] }}
            >
              Price
            </FormLabel>
            <RadioGroup value={selectedPrice} onChange={handlePriceChange}>
              {price.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Divider />
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
