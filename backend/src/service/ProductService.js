const Category = require("../model/Category.js");
const Product = require("../model/Product.js");
const calculateDiscountPercentage = require("../util/CalculateDiscountPercentage.js");

class ProductService {
  async createProduct(req, seller) {
    try {
      const discountPercent = calculateDiscountPercentage(
        req.mrpPrice,
        req.sellingPrice,
      );

      const sellingPrice =
        req.sellingPrice ||
        req.mrpPrice - (req.mrpPrice * discountPercent) / 100;

      const category1 = await this.createOrGetCategory(req.category, 1);
      const category2 = await this.createOrGetCategory(
        req.category2,
        2,
        category1._id,
      );
      const category3 = await this.createOrGetCategory(
        req.category3,
        3,
        category2._id,
      );

      const product = new Product({
        title: req.title,
        description: req.description,
        images: req.images,
        sellingPrice,
        mrpPrice: req.mrpPrice,
        discountPercent,
        size: req.sizes,
        color: req.color,
        quantity: req.quantity,
        seller: seller._id,
        category: category3._id,
        numRatings: req.numRatings || 0,
      });

      return await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createOrGetCategory(categoryId, level, parentId = null) {
    let category = await Category.findOne({ categoryId });

    if (!category) {
      category = new Category({
        categoryId,
        level,
        parentCategory: parentId,
      });
      category = await category.save();
    }
    return category;
  }

  async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
      return "Product deleted..";
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(productId, updateProductData) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        updateProductData,
        { new: true },
      );
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findProductById(productId) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async searchProduct(query) {
    console.log("Search query received:", query); // ← add this
    try {
      const products = await Product.find({ title: new RegExp(query, "i") });
      console.log("Products found:", products.length); // ← and this
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductBySeller(sellerId) {
    console.log("Seller ID at backend:", sellerId);

    return await Product.find({ seller: sellerId });
  }

  async getAllProducts(req) {
    const filterQuery = {};

    const categoryParam = req.category || req.categoryId;
    if (categoryParam) {
      const category = await Category.findOne({ categoryId: categoryParam });

      if (!category) {
        // Try finding by level-1 category and return all sub-category products
        const allCategories = await Category.find({
          categoryId: new RegExp("^" + categoryParam, "i"),
        });
        if (allCategories.length === 0) {
          return { content: [], totalpages: 0, totalElement: 0 };
        }
        filterQuery.category = { $in: allCategories.map((c) => c._id) };
      } else {
        // If level-1 category (men/women/kids/shoes), find all sub-categories
        if (category.level === 1) {
          const level2 = await Category.find({ parentCategory: category._id });
          const level2Ids = level2.map((c) => c._id);
          const level3 = await Category.find({
            parentCategory: { $in: level2Ids },
          });
          const allIds = [
            ...level2Ids,
            ...level3.map((c) => c._id),
            category._id,
          ];
          filterQuery.category = { $in: allIds };
        } else if (category.level === 2) {
          const level3 = await Category.find({ parentCategory: category._id });
          filterQuery.category = {
            $in: [category._id, ...level3.map((c) => c._id)],
          };
        } else {
          filterQuery.category = category._id;
        }
      }
    }

    if (req.color) {
      filterQuery.color = req.color;
    }

    if (req.minPrice || req.maxPrice) {
      filterQuery.sellingPrice = {};
      if (req.minPrice) filterQuery.sellingPrice.$gte = Number(req.minPrice);
      if (req.maxPrice) filterQuery.sellingPrice.$lte = Number(req.maxPrice);
    }

    if (req.minDiscount) {
      filterQuery.discountPercent = { $gte: req.minDiscount };
    }

    if (req.size) {
      filterQuery.size = req.size;
    }
    let sortQuery = {};
    if (req.sort === "price_low") {
      sortQuery.sellingPrice = 1;
    } else if (req.sort == "price_high") {
      sortQuery.sellingPrice = -1;
    }

    const pageSize = parseInt(req.pageSize) || 10;
    const pageNumber = parseInt(req.pageNumber) || 0;

    const products = await Product.find(filterQuery)
      .populate("seller", "businessDetails businessName email")
      .sort(sortQuery)
      .skip(pageNumber * pageSize)
      .limit(pageSize);

    const totalElement = await Product.countDocuments(filterQuery);

    const totalpages = Math.ceil(totalElement / pageSize); //if 73 products 73/10 => 7.3 => 8 => 3 products will be shown in 8th page

    const res = {
      content: products,
      totalpages: totalpages,
      totalElement: totalElement,
    };

    return res;
  }

  async getSimilarProducts(productId) {
    const product = await Product.findById(productId).populate("category");
    if (!product) throw new Error("Product not found");

    // Find products in same category, excluding current product
    const similar = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .populate("seller", "businessDetails")
      .limit(6);

    // If not enough, also try parent category
    if (similar.length < 4 && product.category.parentCategory) {
      const siblingCategories = await require("../model/Category.js").find({
        parentCategory: product.category.parentCategory,
        _id: { $ne: product.category._id },
      });
      const siblingIds = siblingCategories.map((c) => c._id);
      const extra = await Product.find({
        category: { $in: siblingIds },
        _id: { $ne: product._id },
      })
        .populate("seller", "businessDetails")
        .limit(6 - similar.length);
      similar.push(...extra);
    }

    return similar;
  }
}

module.exports = new ProductService();
