const User = require('../../infrastructure/database/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../../config/env');

class AuthService {
    async register({ name, email, password, role }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('Email already in use.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role: role || 'consumer' });
        await user.save();

        return { id: user._id, name: user.name, email: user.email, role: user.role };
    }

    async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid email or password.');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid email or password.');

        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
        return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
    }
}

module.exports = new AuthService();