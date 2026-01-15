import React, { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ProductCard from "./ProductCard";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { getAllProducts } from "../../../../Redux Toolkit/features/customer/productSlice";
import { fetchWishlist } from "../../../../Redux Toolkit/features/customer/wishlistSlice";

const Products = () => {
  const [sort, setSort] = useState("price_low");
  const [page, setPage] = useState(1);
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const { products, totalPages, loading } = useAppSelector((store) => store.product);
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");

  const color = searchParams.get("color") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    dispatch(
      getAllProducts({
        categoryId,
        sort,
        color,
        minPrice,
        maxPrice,
        pageNumber: page - 1,
        pageSize: 8,
      })
    );
  }, [categoryId, sort, color, minPrice, maxPrice, page, dispatch]);

  useEffect(() => {
    if (jwt) dispatch(fetchWishlist(jwt));
  }, [jwt, dispatch]);

  // Human-readable category title
  const categoryTitle = categoryId
    ? categoryId.replace(/_/g, " ").replace(/-/g, " ")
    : "All Products";

  return (
    <div className="mt-10">
      <div>
        <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase">
          {categoryTitle}
        </h1>
      </div>

      <div className="lg:flex">
        {/* Filter Sidebar */}
        <section className="hidden lg:block w-[20%] min-h-screen border-r border-gray-200">
          <FilterSection />
        </section>

        {/* Products Grid */}
        <section className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-10">
            <p className="text-gray-500 text-sm">
              {loading ? "Loading..." : `${products?.length || 0} products`}
            </p>
            <FormControl size="small">
              <InputLabel>Sort</InputLabel>
              <Select
                value={sort}
                label="Sort"
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="price_low">Price: Low → High</MenuItem>
                <MenuItem value="price_high">Price: High → Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5 min-h-[400px]">
            {loading ? (
              <div className="col-span-4 flex justify-center items-center py-20">
                <CircularProgress />
              </div>
            ) : products?.length > 0 ? (
              products.map((item) => <ProductCard key={item._id} item={item} />)
            ) : (
              <div className="col-span-4 text-center py-20">
                <p className="text-gray-400 text-lg">No products found.</p>
                <p className="text-gray-300 text-sm mt-2">
                  Try a different category or clear filters.
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pb-10">
              <Pagination
                count={totalPages || 1}
                page={page}
                onChange={(e, val) => setPage(val)}
                color="primary"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
