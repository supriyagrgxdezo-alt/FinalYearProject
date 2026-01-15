export const homeCategories = [
  // ─── CLOTHES CATEGORIES ───────────────────────────────────────────────────
  {
    section: "CLOTHES_CATEGORIES",
    name: "Jeans",
    image:
      "https://i5.walmartimages.com/seo/Jeans-for-Women-Trendy-Baggy-Boyfriend-Jeans-Y2k-Straight-Wide-Leg-Jeans-Casual-High-Waist-Jean-Pant-Four-Pockets-Jeans_f5e64841-eaec-4c9c-b11f-74a3a4d369b1.9448a5d826949740fae1e2c650277460.jpeg",
    categoryId: "women_street_jeans",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "T-shirt",
    image:
      "https://www.easy-clothes.com/cdn/shop/files/tshirt-iconic-gris-08.jpg?v=1716818191",
    categoryId: "men_topwear_tshirts",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Jackets",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/carhartt-lined-jacket-0258-69431d4807e1e.jpg?crop=0.553xw:0.829xh;0.0765xw,0.122xh&resize=640:*",
    categoryId: "women_street_jackets",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Shoes",
    image:
      "https://m.media-amazon.com/images/G/01/zappos/2026/nicole/HP-VISNAV-MERRELL-432x540._FMwebp_.jpg",
    categoryId: "shoes_sneakers",
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Hoodies",
    image:
      "https://i5.walmartimages.com/seo/black-hoodies-for-men-mens-autumn-and-winter-casual-loose-solid-hooded-sweater-top_54ffdedd-50b7-40ed-b544-a5090f9978d3.016bae9bd5bda976b748b11f072fd1b5.jpeg",
    categoryId: "men-topwear", // ✅ exists in menLevelTwo
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Kurti",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/12/364983171/NY/OR/SZ/36471756/designer-siquacnce-bridal-anarkali-kurti-set.jpeg",
    categoryId: "women_traditional_kurtis", // ✅ exists in womenLevelThree
  },
  {
    section: "CLOTHES_CATEGORIES",
    name: "Party-wear",
    image:
      "https://houseoffett.com/cdn/shop/files/1copy2_92480830-83cb-4774-8dac-2717a2045b2b.jpg?v=1749817910",
    categoryId: "men-partyWear", // ✅ exists in menLevelTwo
  },

  // ─── GRID ─────────────────────────────────────────────────────────────────
  {
    categoryId: "women_sports_wear", // ✅ exists in womenLevelTwo
    section: "GRID",
    name: "Women Sports Wear",
    image: "/images/grid1.webp",
  },
  {
    categoryId: "women_street_wear", // ✅ exists in womenLevelTwo
    section: "GRID",
    name: "Women Short Skirt",
    image:
      "https://bohobeachhut.com/cdn/shop/products/boho-beach-hut-boho-dress-short-sleeve-dress-mini-dress-white-dress-hippie-dress-floral-dress-summer-dress-white-s-chic-white-summer-dress-34898052808899.jpg?v=1759851250&width=800",
  },
  {
    categoryId: "women_street_wear", // ✅ exists in womenLevelTwo
    section: "GRID",
    name: "Women Street Wear",
    image:
      "https://i.pinimg.com/736x/93/fb/ec/93fbeccaa318587a07b742be1c7c42bb.jpg",
  },
  {
    categoryId: "women_traditional_wear", // ✅ exists in womenLevelTwo
    section: "GRID",
    name: "Women Traditional Wear",
    image:
      "https://i.pinimg.com/736x/2e/af/01/2eaf01b89f186b2c54946807851f9d0d.jpg",
  },
  {
    section: "GRID",
    categoryId: "men-partyWear", // ✅ exists in menLevelTwo
    name: "Men Party Wear",
    image:
      "https://i.pinimg.com/736x/2e/af/01/2eaf01b89f186b2c54946807851f9d0d.jpg",
  },

  // ─── SHOP BY CATEGORIES ───────────────────────────────────────────────────
  {
    parentCategoryId: "Women",
    name: "Sports Wear",
    categoryId: "women_sports_wear", // ✅ exists in womenLevelTwo
    section: "SHOP_BY_CATEGORIES",
    image:
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/04/19/18/fitness-mainpic.jpg",
  },
  {
    parentCategoryId: "Women",
    name: "Night Wear",
    categoryId: "women_night_wear", // ✅ exists in womenLevelTwo
    section: "SHOP_BY_CATEGORIES",
    image: "http://localhost:5173/images/nightwear.jpg",
  },
  {
    parentCategoryId: "Kids",
    name: "Party Wear",
    categoryId: "kids_party_wear", // ✅ exists in kidsLevelTwo
    section: "SHOP_BY_CATEGORIES",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2025/2/491817532/MM/FC/US/88802417/new-product-500x500.jpeg",
  },
  {
    parentCategoryId: "Kids",
    name: "Casual Wear",
    categoryId: "kids_casual_wear", // ✅ exists in kidsLevelTwo
    section: "SHOP_BY_CATEGORIES",
    image:
      "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/4cc0b068a6b594a2904a315a815f8f07.jpg?imageView2/2/w/500/q/60/format/webp",
  },
  {
    parentCategoryId: "Shoes",
    name: "Running Shoes",
    categoryId: "shoes_running", // ✅ exists in shoesLevelTwo
    section: "SHOP_BY_CATEGORIES",
    image:
      "https://caliber-kd-shoes.s3.ap-south-1.amazonaws.com/uploads/2024/10/29121345/742-white-2.jpg",
  },
  {
    parentCategoryId: "Shoes",
    name: "Sandals",
    categoryId: "shoes_sandals_slippers", // ✅ exists in shoesLevelTwo
    section: "SHOP_BY_CATEGORIES",
    image:
      "https://img.drz.lazcdn.com/static/np/p/f4f31898cbccc4a6f8159815c56bd59f.jpg_720x720q80.jpg",
  },
  {
    parentCategoryId: "Men",
    name: "Party Wear",
    categoryId: "men-partyWear", // ✅ exists in menLevelTwo
    section: "SHOP_BY_CATEGORIES",
    image:
      "https://www.menswearr.com/cdn/shop/files/c97c09590448edb46836c170c0c2391c.webp",
  },

  // ─── DEAL CATEGORIES ──────────────────────────────────────────────────────
  // All categoryIds now match exactly what sellers use when adding products
  {
    section: "DEAL_CATEGORIES",
    name: "Women Traditional Wear",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/12/364983171/NY/OR/SZ/36471756/designer-siquacnce-bridal-anarkali-kurti-set.jpeg",
    categoryId: "women_traditional_wear", // ✅ womenLevelTwo
  },
  {
    section: "DEAL_CATEGORIES",
    name: "Men Party Wear",
    image:
      "https://www.menswearr.com/cdn/shop/files/c97c09590448edb46836c170c0c2391c.webp",
    categoryId: "men-partyWear", // ✅ menLevelTwo
  },
  {
    section: "DEAL_CATEGORIES",
    name: "Kids Casual Wear",
    image:
      "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/4cc0b068a6b594a2904a315a815f8f07.jpg?imageView2/2/w/500/q/60/format/webp",
    categoryId: "kids_casual_wear",
  },
  {
    section: "DEAL_CATEGORIES",
    name: "Women Street Wear",
    image:
      "https://i.pinimg.com/736x/93/fb/ec/93fbeccaa318587a07b742be1c7c42bb.jpg",
    categoryId: "women_street_wear",
  },
  {
    section: "DEAL_CATEGORIES",
    name: "Men Top Wear",
    image:
      "https://i5.walmartimages.com/seo/black-hoodies-for-men-mens-autumn-and-winter-casual-loose-solid-hooded-sweater-top_54ffdedd-50b7-40ed-b544-a5090f9978d3.016bae9bd5bda976b748b11f072fd1b5.jpeg",
    categoryId: "men-topwear",
  },
  {
    section: "DEAL_CATEGORIES",
    name: "Women Sports Wear",
    image:
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/04/19/18/fitness-mainpic.jpg",
    categoryId: "women_sports_wear",
  },
  {
    section: "DEAL_CATEGORIES",
    name: "Kids Party Wear",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2025/2/491817532/MM/FC/US/88802417/new-product-500x500.jpeg",
    categoryId: "kids_party_wear",
  },
  {
    section: "DEAL_CATEGORIES",
    name: "Women Night Wear",
    image: "http://localhost:5173/images/nightwear.jpg",
    categoryId: "women_night_wear",
  },
];
