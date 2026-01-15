const UserRoles = require("../domain/UserRole");
const VerificationCode = require("../model/VerificationCode");
const sellerService = require("../service/sellerService");
const jwtProvider = require("../util/jwtProvider");
const sendVerificationEmail = require("../util/sendEmail");
const generateOTP = require("../util/generateOtp");

class SellerController {
  async getSellerProfile(req, res) {
    try {
      const jwt = req.headers.authorization.split(" ")[1];
      const seller = await sellerService.getSellerProfile(jwt);
      res.status(200).json(seller);
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async createSeller(req, res) {
    try {
      const seller = await sellerService.createSeller(req.body);
      res.status(200).json({ message: "seller created successfully" });
    } catch (error) {
      console.log("error creating", error);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async getAllSellers(req, res) {
    try {
      const status = req.query.status;
      const seller = await sellerService.getAllSellers(status);
      res.status(200).json(seller);
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async updateSeller(req, res) {
    try {
      const existingSeller = req.seller;
      const seller = await sellerService.updateSeller(existingSeller, req.body);
      res.status(200).json(seller);
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async deleteSeller(req, res) {
    try {
      await sellerService.deleteSeller(req.params.id);
      res.status(200).json({ message: "seller deleted.." });
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async updateSellerAccountStatus(req, res) {
    try {
      const updatedSeller = await sellerService.updateSellerStatus(
        req.params.id,
        req.params.status,
      );
      res.status(200).json(updatedSeller);
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async sendLoginOtp(req, res) {
    try {
      const { email } = req.body;

      const seller = await sellerService.getSellerByEmail(email);
      if (!seller) {
        return res
          .status(404)
          .json({ message: "Seller not found with this email" });
      }

      const otp = generateOTP();
      await VerificationCode.deleteMany({ email });
      await VerificationCode.create({ email, otp });

      await sendVerificationEmail(
        email,
        "Seller Login OTP",
        `<h3>Your login OTP is: <strong>${otp}</strong></h3><p>Valid for 10 minutes.</p>`,
      );

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.log("sendLoginOtp error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async verifyLoginOtp(req, res) {
    try {
      const { otp, email } = req.body;
      const seller = await sellerService.getSellerByEmail(email);

      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      // block non-active sellers from logging in
      if (seller.accountStatus !== "ACTIVE") {
        return res.status(403).json({
          message: `Your account is ${seller.accountStatus
            .toLowerCase()
            .replace("_", " ")}. Please contact support.`,
        });
      }

      const verificationCode = await VerificationCode.findOne({ email });
      if (!verificationCode || verificationCode.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP!" });
      }

      const token = jwtProvider.createJwt({ email });

      return res.status(200).json({
        message: "Login Success",
        jwt: token,
        role: UserRoles.SELLER,
      });
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new SellerController();
