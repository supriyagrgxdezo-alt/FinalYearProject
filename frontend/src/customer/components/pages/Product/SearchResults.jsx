import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../../../Redux Toolkit/features/customer/productSlice";
import ProductCard from "./ProductCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product?.searchProduct) ?? [];
  const loading = useSelector((state) => state.product?.loading);

  useEffect(() => {
    if (query) dispatch(searchProducts(query));
  }, [query]);

  console.log("render - products:", products, "loading:", loading);

  if (loading) return <div className="text-center py-20">Searching...</div>;

  return (
    <div className="px-5 lg:px-20 py-10">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        {products.length > 0
          ? `${products.length} results for "${query}"`
          : `No results found for "${query}"`}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} item={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
