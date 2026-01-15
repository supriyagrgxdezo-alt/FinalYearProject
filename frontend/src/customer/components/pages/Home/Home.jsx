import React from "react";
import ClothesCategory from "./ClothesCategory/ClothesCategory";
import Grid from "./Grid/Grid";
import DealCard from "./Deal/DealCard";
import Deal from "./Deal/Deal";
import HomeCategory from "./HomeCategory/HomeCategory";
import Button from "@mui/material/Button";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router";

const Home = () => {
   const navigate = useNavigate();
  return (
    <div className="space-y-10">
      <h1 className="text-xl font-bold mb-4 text-center">Shop Our Clothes</h1>
      <ClothesCategory />
      <section>
        <Grid />
      </section>

      <section className="pt-10">
        <h1 className="text-3xl font-black text-center pb-5">Today's Deal</h1>
        <Deal />
      </section>

      <section className="pt-10">
        <h1 className="text-3xl font-black text-center pb-5">
          Shop by category
        </h1>
        <HomeCategory />
      </section>

      <section className="lg:px-20 relative h-105 flex items-center justify-center">
        <img
          src="/images/becomesellerposter.jpg"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute text-center font-semibold space-y-3 text-black">
          <h1 className="text-3xl lg:text-5xl">Want to sell your products?</h1>

          <p className="text-xl md:text-3xl">
            With
            <strong className="logo text-4xl md:text-6xl pl-2">
              Crystal Thread
            </strong>
          </p>

          <div className="pt-6 flex justify-center">
            <Button
              onClick={() => navigate("/become-seller")}
              startIcon={<StorefrontIcon />}
              variant="contained"
            >
              Become Seller
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
