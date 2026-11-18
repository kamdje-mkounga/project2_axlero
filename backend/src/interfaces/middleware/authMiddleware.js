const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/env');

/**
 * JWT Authentication Middleware
 * Validates the Bearer token in Authorization header
 */
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
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Distinguishes between Admin, Vendor, and Customer roles.
 * Supports multiple allowed roles: requireRoles('admin', 'vendor') or requireRoles(['admin', 'vendor'])
 * Admins inherently inherit elevated operational permissions.
 */
const requireRoles = (...roles) => {
    const allowedRoles = roles.flat().map((r) => r.toLowerCase().trim());

    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'Access denied. Authentication required.' });
        }

        const userRole = req.user.role.toLowerCase().trim();

        // Admin has overarching access, or user's role must match one of the allowed roles
        // 'consumer' is mapped as alias to 'customer'
        const isAuthorized =
            userRole === 'admin' ||
            allowedRoles.includes(userRole) ||
            (userRole === 'consumer' && allowedRoles.includes('customer')) ||
            (userRole === 'customer' && allowedRoles.includes('consumer'));

        if (!isAuthorized) {
            return res.status(403).json({ 
                error: `Access forbidden. Requires one of roles: [${allowedRoles.join(', ')}].` 
            });
        }

        next();
    };
};

// Alias for backward compatibility with single-role routes
const requireRole = (role) => requireRoles(role);

module.exports = { verifyToken, requireRole, requireRoles };
