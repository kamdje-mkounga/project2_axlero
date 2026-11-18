const UserModel = require('../../infrastructure/database/UserModel');
const UserEntity = require('../../domain/entities/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../../config/env');

class AuthService {
    generateToken(user) {
        return jwt.sign(
            { id: user.id || user._id, role: user.role },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );
    }

    async register({ name, email, password, role }) {
        // Normalize role: default to customer if not specified
        const normalizedRole = role ? role.toLowerCase().trim() : 'customer';

        // Validate using pure domain entity
        const userEntity = new UserEntity({
            name,
            email,
            password,
            role: normalizedRole
        });
        userEntity.validate();

        // Check uniqueness in database
        const existingUser = await UserModel.findOne({ email: userEntity.email });
        if (existingUser) {
            throw new Error('Email is already registered.');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Persist via Mongoose model
        const userDoc = new UserModel({
            name: userEntity.name,
            email: userEntity.email,
            password: hashedPassword,
            role: userEntity.role
        });
        const savedUser = await userDoc.save();

        const token = this.generateToken(savedUser);

        return {
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        };
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error('Please provide both email and password.');
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userDoc = await UserModel.findOne({ email: normalizedEmail });
        if (!userDoc) {
            throw new Error('Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(password, userDoc.password);
        if (!isMatch) {
            throw new Error('Invalid email or password.');
        }

        const token = this.generateToken(userDoc);

        return {
            token,
            user: {
                id: userDoc._id,
                name: userDoc.name,
                email: userDoc.email,
                role: userDoc.role
            }
        };
    }

    async getAllUsers() {
        return await UserModel.find({}, '-password').sort({ createdAt: -1 });
    }
}

module.exports = new AuthService();
