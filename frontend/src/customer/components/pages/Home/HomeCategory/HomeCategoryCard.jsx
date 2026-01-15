import React from "react";
import { useNavigate } from "react-router";

const HomeCategoryCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${item.categoryId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex gap-3 flex-col justify-center items-center group cursor-pointer"
    >
      <div className="custom-border w-37.5 lg:w-62.25 h-37.5 lg:h-62.25 rounded-full bg-indigo-300">
        <img
          className="group-hover:scale-95 transition-transform duration-700 object-cover object-top h-full w-full rounded-full"
          src={item.image}
          alt={item.name}
        />
      </div>
      <h1 className="font-medium">{item.name}</h1>
    </div>
  );
};

export default HomeCategoryCard;
