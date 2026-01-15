import React from "react";
import ClothesCategoryCard from "./ClothesCategoryCard";
import { useAppSelector } from "../../../../../Redux Toolkit/store";

const clothes = [
  {
    section: "CLOTHES_CATEGORIES",
    name: "Jeans",
    image:
      "https://i5.walmartimages.com/seo/Jeans-for-Women-Trendy-Baggy-Boyfriend-Jeans-Y2k-Straight-Wide-Leg-Jeans-Casual-High-Waist-Jean-Pant-Four-Pockets-Jeans_f5e64841-eaec-4c9c-b11f-74a3a4d369b1.9448a5d826949740fae1e2c650277460.jpeg",
    categoryId: "jeans",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "T-shirt",
    image:
      "https://www.easy-clothes.com/cdn/shop/files/tshirt-iconic-gris-08.jpg?v=1716818191",
    categoryId: "tshirt",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Jackets",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/carhartt-lined-jacket-0258-69431d4807e1e.jpg?crop=0.553xw:0.829xh;0.0765xw,0.122xh&resize=640:*",
    categoryId: "jackets",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Shoes",
    image:
      "https://m.media-amazon.com/images/G/01/zappos/2026/nicole/HP-VISNAV-MERRELL-432x540._FMwebp_.jpg",
    categoryId: "shoes",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Hoodies",
    image:
      "https://i5.walmartimages.com/seo/black-hoodies-for-men-mens-autumn-and-winter-casual-loose-solid-hooded-sweater-top_54ffdedd-50b7-40ed-b544-a5090f9978d3.016bae9bd5bda976b748b11f072fd1b5.jpeg",
    categoryId: "hoodies",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Kurti",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/12/364983171/NY/OR/SZ/36471756/designer-siquacnce-bridal-anarkali-kurti-set.jpeg",
    categoryId: "kurti",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Party-wear",
    image:
      "https://houseoffett.com/cdn/shop/files/1copy2_92480830-83cb-4774-8dac-2717a2045b2b.jpg?v=1749817910",
    categoryId: "partywear",
  },
];

const ClothesCategory = () => {
  const homeCategories = useAppSelector(
    (store) => store.homeCategory.homeCategories,
  );

  return (
    <div className="flex flex-wrap justify-between py-5 lg:px-20 border-b border-gray-300">
      {homeCategories.CLOTHES_CATEGORIES.slice(0,7)?.map((item) => (
        <ClothesCategoryCard key={item.categoryId} item={item} />
      ))}
    </div>
  );
};

export default ClothesCategory;
