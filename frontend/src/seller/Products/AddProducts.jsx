import React, { useState } from "react";
import { Formik, useFormik } from "formik";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../../data/filters/color";
import { mainCategory } from "../../data/Category/mainCategory";

import { kidsLevelTwo } from "../../data/Category/level two/kidsLevelTwo";
import { menLevelTwo } from "../../data/Category/level two/menLevelTwo";
import { womenLevelTwo } from "../../data/Category/level two/womenLevelTwo";
import { shoesLevelTwo } from "../../data/Category/level two/shoesLevelTwo";

import { kidsLevelThree } from "../../data/Category/level three/kidsLevelThree";
import { menLevelThree } from "../../data/Category/level three/menLevelThree";
import { womenLevelThree } from "../../data/Category/level three/womenLevelThree";
import { shoesLevelThree } from "../../data/Category/level three/shoesLevelThree";
import { uploadToCloudnary } from "../../util/uploadToCloudnary";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { createProduct } from "../../Redux Toolkit/features/seller/sellerProductSlice";

const sizes = [
  "FREE ",
  " XS ",
  " S ",
  " M ",
  " L ",
  " XL ",
  " XXL ",
  " 3XL ",
  " 4XL ",
  " 5XL ",
];
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

const AddProducts = () => {
  const [uploadImage, setUploadImage] = useState(false);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: 2,
      color: "",
      images: [],
      category: "",
      category2: "",
      category3: "",
      sizes: "",
    },
    onSubmit: (value) => {
      const jwt = localStorage.getItem("jwt");

      const mrp = parseFloat(value.mrpPrice);
      const selling = parseFloat(value.sellingPrice);
      const discountPercent =
        mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0;

      const request = { ...value, discountPercent };
      dispatch(createProduct({ jwt, request }));
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    setUploadImage(true);

    const image = await uploadToCloudnary(file);

    formik.setFieldValue("images", [...formik.values.images, image]);

    setUploadImage(false);

    console.log("handle image change");
  };
  const handleRemoveImage = () => {
    console.log("handle remove image");
  };

  const childCategory = (category, parentCategoryId) => {
    return category.filter(
      (child) => child.parentCategoryId == parentCategoryId,
    );
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center py-5">ADD PRODUCTS</h1>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid className="flex flex-col gap-5" size={{ xs: 12 }}>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <div className="flex flex-wrap gap-3">
              {/* Add Image Button */}
              <label htmlFor="fileInput" className="relative">
                <span
                  className="w-24 h-24 cursor-pointer flex items-center
        justify-center border rounded-md border-gray-400"
                >
                  <AddPhotoAlternateIcon className="text-gray-700" />
                </span>

                {uploadImage && (
                  <div
                    className="absolute inset-0 w-24 h-24 flex
          justify-center items-center"
                  >
                    <CircularProgress size={25} />
                  </div>
                )}
              </label>

              {/* Images */}
              {formik.values.images.map((item, index) => (
                <div className="relative" key={index}>
                  <img
                    src={item}
                    alt=""
                    className="w-24 h-24 object-cover rounded"
                  />

                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="mrp_Price"
              name="mrpPrice"
              label="MRP Price"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="selling_Price"
              name="sellingPrice"
              label="selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                id="color"
                labelId="color_label"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="color"
              >
                <MenuItem value="none">none </MenuItem>
                {colors.map((item, index) => (
                  <MenuItem key={index} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="size-label">Size</InputLabel>
              <Select
                id="size"
                labelId="size_label"
                name="sizes"
                value={formik.values.sizes}
                onChange={formik.handleChange}
                label="size"
              >
                <MenuItem value="none">none </MenuItem>
                {sizes.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                id="category"
                labelId="category_label"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                label="category"
              >
                <MenuItem value="none">none </MenuItem>
                {mainCategory.map((item, index) => (
                  <MenuItem key={index} value={item.categoryid}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="category2-label">Second Category</InputLabel>
              <Select
                id="category2"
                labelId="category2_label"
                name="category2"
                value={formik.values.category2}
                onChange={formik.handleChange}
                label="second category"
              >
                <MenuItem value="none">none </MenuItem>
                {formik.values.category &&
                  categoryTwo[formik.values.category]?.map((item, index) => (
                    <MenuItem key={index} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="category3-label">Third Category</InputLabel>
              <Select
                id="category3"
                labelId="category3_label"
                name="category3"
                value={formik.values.category3}
                onChange={formik.handleChange}
                label="third category"
              >
                <MenuItem value="none">none </MenuItem>
                {formik.values.category2 &&
                  childCategory(
                    categoryThree[formik.values.category],
                    formik.values.category2,
                  )?.map((item, index) => (
                    <MenuItem key={index} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              sx={{ p: "14px" }}
              fullWidth
              type="submit"
              variant="contained"
            >
              Add product
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddProducts;
