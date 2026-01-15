const Address = require("../model/Address");

const createAddress = async (req, res) => {
  try {
    console.log("Creating address for user:", req.user._id);
    console.log("Request body:", req.body);
    const address = new Address({
      name: req.body.name,
      mobile: req.body.mobile,
      address: req.body.address,
      locality: req.body.locality,
      city: req.body.city,
      pincode: req.body.pinCode,
      state: req.body.state,
      user: req.user._id,
    });
    const saved = await address.save();
    console.log("Saved address:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.log("Error saving address:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getUserAddresses = async (req, res) => {
  try {
    console.log("Fetching addresses for user:", req.user._id);
    const addresses = await Address.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("Found addresses:", addresses);
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ensure user can only delete their own
    });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createAddress, getUserAddresses, deleteAddress };
