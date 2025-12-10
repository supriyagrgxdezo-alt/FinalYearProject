const UserRoles = require("../domain/UserRole");
const AuthService = require("../service/AuthService");

class AuthController {

  async sendLoginOtp(req, res) {
    try {
      const { email, isSignup } = req.body; // ← frontend sends isSignup flag

      if (!email) return res.status(400).json({ message: "Email is required" });

      if (isSignup) {
        await AuthService.sendSignupOTP(email);
      } else {
        await AuthService.sendLoginOTP(email); // ← only registered users get OTP
      }

      res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const jwt = await AuthService.createUser(req.body);

      const authResponse = {
        jwt,
        message: "User created successfully",
        role: UserRoles.CUSTOMER,
      };

      res.status(200).json(authResponse);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async signin(req, res) {
    try {
      const authResponse = await AuthService.signin(req.body);

      res.status(200).json(authResponse);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
