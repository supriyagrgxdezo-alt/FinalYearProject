const bcrypt = require("bcrypt");
const Seller = require("../model/Seller");
const User = require("../model/User");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../util/generateOtp");
const sendVerificationEmail = require("../util/sendEmail");
const Cart = require("../model/cart");
const jwtProvider = require("../util/jwtProvider");
const userService = require("./userService");

class AuthService {
  async sendLoginOTP(email) {
    console.log("Service sending OTP to:", email);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error(
        "No account found with this email. Please sign up first.",
      );
    }

    const existingVerificationCode = await VerificationCode.findOne({ email });
    if (existingVerificationCode) {
      await VerificationCode.deleteOne({ email });
    }

    const otp = generateOTP();
    const verificationCode = new VerificationCode({ otp, email });
    await verificationCode.save();

    const subject = "Crystal thread login/signup OTP";
    const body = `Your OTP is ${otp}. Please enter OTP to complete your login process.`;
    await sendVerificationEmail(email, subject, body);

    return { message: "OTP sent" };
  }

  async sendSignupOTP(email) {
    console.log("Service sending Signup OTP to:", email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Account already exists with this email. Please login.");
    }

    const existingVerificationCode = await VerificationCode.findOne({ email });
    if (existingVerificationCode) {
      await VerificationCode.deleteOne({ email });
    }

    const otp = generateOTP();
    const verificationCode = new VerificationCode({ otp, email });
    await verificationCode.save();

    const subject = "Crystal thread signup OTP";
    const body = `Your OTP is ${otp}. Please enter OTP to complete your registration.`;
    await sendVerificationEmail(email, subject, body);

    return { message: "OTP sent" };
  }

  async createUser(req) {
    const { email, fullName, otp } = req;

    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exists with email");
    }

    const verificationCode = await VerificationCode.findOne({ email });

    if (!verificationCode || verificationCode.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    user = new User({ email, fullName });
    await user.save();

    const cart = new Cart({ user: user._id });
    await cart.save();

    // Clean up verification code after successful signup
    await VerificationCode.deleteOne({ email }); // ← added cleanup

    return jwtProvider.createJwt({ email });
  }

  async signin(req) {
    const { email, otp } = req;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found with this email");
    }

    const verificationCode = await VerificationCode.findOne({ email });

    if (!verificationCode || verificationCode.otp !== otp) {
      throw new Error("Invalid OTP. Please try again.");
    }

    await VerificationCode.deleteOne({ email });

    return {
      message: "Login successful",
      jwt: jwtProvider.createJwt({ email }),
      role: user.role,
    };
  }
}

module.exports = new AuthService();
