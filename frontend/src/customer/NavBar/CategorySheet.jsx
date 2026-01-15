import { Box } from "@mui/material";
import React from "react";
import { womenLevelTwo } from "../../data/Category/level two/womenLevelTwo";
import { menLevelTwo } from "../../data/Category/level two/menLevelTwo";
import { kidsLevelTwo } from "../../data/Category/level two/kidsLevelTwo";
import { shoesLevelTwo } from "../../data/Category/level two/shoesLevelTwo";
import { menLevelThree } from "../../data/Category/level three/menLevelThree";
import { womenLevelThree } from "../../data/Category/level three/womenLevelThree";
import { kidsLevelThree } from "../../data/Category/level three/kidsLevelThree";
import { shoesLevelThree } from "../../data/Category/level three/shoesLevelThree";
import { useNavigate } from "react-router";

const categoryTwo = {
  men: menLevelTwo,
  women: womenLevelTwo,
  kids: kidsLevelTwo,
  shoes: shoesLevelTwo,
};

const categoryThree = {
  men: menLevelThree,
  women: womenLevelThree,
  kids: kidsLevelThree,
  shoes: shoesLevelThree,
};

const CategorySheet = ({ selectedCategory, setShowSheet }) => {
  const navigate = useNavigate();

  const childCategory = (category, parentCategoryId) => {
    return category?.filter(
      (child) => child.parentCategoryId === parentCategoryId
    );
  };

  /**
   * Navigate to products page.
   * - Clicking a level-3 item (e.g. T-Shirts) navigates to /products/men_topwear_tshirts
   * - Clicking a level-2 header navigates to /products/men-topwear
   * Both IDs match Category.categoryId in the DB so filtering works correctly.
   */
  const handleCategoryClick = (categoryId) => {
    if (setShowSheet) setShowSheet(false);
    navigate(`/products/${categoryId}`);
  };

  return (
    <Box className="bg-white shadow-lg lg:h-125 overflow-auto z-50">
      <div className="flex text-sm flex-wrap">
        {categoryTwo[selectedCategory]?.map((item, index) => (
          <div
            className={`p-8 lg:w-[20%] ${
              index % 2 === 0 ? "bg-slate-50" : "bg-white"
            }`}
            key={item.categoryId}
          >
            {/* Level-2 category header — clickable */}
            <p
              onClick={() => handleCategoryClick(item.categoryId)}
              className="text-[#00927c] font-semibold cursor-pointer hover:underline"
            >
              {item.name}
            </p>

            <ul className="mt-3 space-y-2 text-gray-500">
              {childCategory(
                categoryThree[selectedCategory],
                item.categoryId
              )?.map((child) => (
                <li
                  onClick={() => handleCategoryClick(child.categoryId)}
                  key={child.categoryId}
                  className="cursor-pointer hover:text-[#00927c] transition-colors"
                >
                  {child.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default CategorySheet;
