const express = require('express');
const productController = require('../controller/ProductController.js');
const router = express.Router();

router.get('/search', productController.searchProduct);
router.get('/', productController.getAllProducts);
router.get('/:productId/similar', productController.getSimilarProducts);
router.get('/:productId', productController.getProductById);
router.patch("/:productId/stock", productController.updateStockStatus);

module.exports = router;