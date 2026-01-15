const User = require("../model/User"); 

const getUserProfileByJwt = async (req, res) => {
  try {
    const user = await req.user;
    return res.status(200).json(user);
  } catch (err) {
    handleErrors(err, res);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    console.log("USER FROM MIDDLEWARE:", req.user); 
    console.log("BODY RECEIVED:", req.body); 

    const userId = req.user._id;
    const updates = req.body;

    const allowed = ["fullName", "mobile", "profilePicture"];
    const filtered = Object.keys(updates)
      .filter((key) => allowed.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

    console.log("FILTERED UPDATE:", Object.keys(filtered)); 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filtered },
      { new: true },
    );

    console.log("UPDATED USER:", updatedUser); 
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("UPDATE ERROR:", error); 
    res.status(500).json({ message: error.message || "Update failed" });
  }
};

const handleErrors = (err, res) => {
  if (err instanceof Error) {
    return res.status(404).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = {
  getUserProfileByJwt,
  updateUserProfile, 
};
