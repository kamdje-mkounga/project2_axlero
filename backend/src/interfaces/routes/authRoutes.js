const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { verifyToken, requireRoles } = require('../middleware/authMiddleware');

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/users', verifyToken, requireRoles('admin'), (req, res) => authController.getUsers(req, res));

module.exports = router;