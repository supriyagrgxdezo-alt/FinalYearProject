const express = require("express");
const router = express.Router();
const {
  createAddress,
  getUserAddresses,
  deleteAddress,
} = require("../controller/addressController"); 
const authenticate = require("../middlewares/authMiddleware"); 

router.post("/", authenticate, createAddress);
router.get("/user", authenticate, getUserAddresses);
router.delete("/:id", authenticate, deleteAddress);

module.exports = router;
