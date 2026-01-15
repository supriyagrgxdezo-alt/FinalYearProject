import React from "react";
import ProductCard from "../ProductCard";
import { useAppSelector } from "../../../../../Redux Toolkit/store";

const SimilarProduct = ({ currentProductId }) => {
  const { similarProducts, loading } = useAppSelector((store) => store.product);

  const filtered = similarProducts?.filter((p) => p._id !== currentProductId) || [];

  if (loading) {
    return (
      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-72 bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-6">No similar products found.</p>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 justify-between gap-2 gap-y-8">
      {filtered.slice(0, 6).map((item) => (
        <ProductCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default SimilarProduct;
