require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/axlero_db',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};