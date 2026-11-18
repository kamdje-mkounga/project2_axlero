const authService = require('../../application/services/AuthService');

class AuthController {
    // ==========================================
    // REGISTER CONTROLLER
    // ==========================================
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Please provide name, email, and password.' });
            }

            const result = await authService.register({ name, email, password, role });
            return res.status(201).json({
                message: 'Account created successfully!',
                token: result.token,
                user: result.user
            });
        } catch (err) {
            const status = err.message.includes('already registered') || err.message.includes('required') || err.message.includes('Invalid') ? 400 : 500;
            return res.status(status).json({ error: err.message });
        }
    }

    // ==========================================
    // LOGIN CONTROLLER
    // ==========================================
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Please provide both email and password.' });
            }

            const result = await authService.login({ email, password });
            return res.status(200).json({
                message: 'Logged in successfully!',
                token: result.token,
                user: result.user
            });
        } catch (err) {
            const status = err.message.includes('Invalid email or password') || err.message.includes('Please provide') ? 400 : 500;
            return res.status(status).json({ error: err.message });
        }
    }

    // ==========================================
    // GET USERS (ADMIN ONLY)
    // ==========================================
    async getUsers(req, res) {
        try {
            const users = await authService.getAllUsers();
            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AuthController();
