const express = require ('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.get('/profile', authMiddleware, userController.getUserProfileByJwt);
router.put("/profile", authMiddleware, userController.updateUserProfile);

module.exports = router;