const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/env');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // { id, role }
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };