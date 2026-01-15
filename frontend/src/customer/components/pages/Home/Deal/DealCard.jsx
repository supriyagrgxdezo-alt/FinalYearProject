import React from "react";
import { useNavigate } from "react-router";

const DealCard = ({ deal }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/products/${deal.category}`)}
      className="w-full cursor-pointer"
    >
      <img
        className="border-x-[7px] border-t-[7px] border-black w-full h-48 object-cover object-top"
        src={deal.image}
        alt={deal.category}
      />
      <div className="border-4 border-black bg-black text-white p-2 text-center">
        <p className="text-2xl font-bold">{deal.discount}%</p>
        <p className="font-bold">Shop Now</p>
      </div>
    </div>
  );
};

export default DealCard;
