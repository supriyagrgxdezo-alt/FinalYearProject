const sellerService = require("../service/sellerService");
const jwtProvider = require("../util/jwtProvider");

const sellerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let email;
    try {
      email = jwtProvider.getEmailFromjwt(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const seller = await sellerService.getSellerByEmail(email);

    if (!seller) {
      return res.status(401).json({ message: "Seller not found" });
    }

    if (seller.accountStatus !== "ACTIVE") {
      return res.status(403).json({
        message: `Your account is ${seller.accountStatus
          .toLowerCase()
          .replace("_", " ")}. Please contact support.`,
      });
    }

    req.seller = seller;
    next();
  } catch (error) {
    console.error("Seller middleware error:", error);
    res.status(500).json({ message: "Internal server error in middleware" });
  }
};

module.exports = sellerMiddleware;
