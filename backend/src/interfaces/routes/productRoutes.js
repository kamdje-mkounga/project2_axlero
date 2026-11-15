const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', (req, res) => productController.getProducts(req, res));
router.get('/:id', (req, res) => productController.getProduct(req, res));

// Protected Vendor routes (Requires JWT + Vendor Role)
router.post('/', verifyToken, requireRole('vendor'), (req, res) => productController.create(req, res));
router.put('/:id', verifyToken, requireRole('vendor'), (req, res) => productController.update(req, res));
router.delete('/:id', verifyToken, requireRole('vendor'), (req, res) => productController.remove(req, res));

module.exports = router;