/**
 * Pure Domain Entity: User
 * Clean Architecture Enterprise Business Object (No ORM / Framework dependencies)
 */
class User {
    constructor({ id, name, email, password, role = 'customer', createdAt, updatedAt } = {}) {
        this.id = id;
        this.name = name ? name.trim() : '';
        this.email = email ? email.toLowerCase().trim() : '';
        this.password = password;
        this.role = role;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    isAdmin() {
        return this.role === 'admin';
    }

    isVendor() {
        return this.role === 'vendor';
    }

    isCustomer() {
        return this.role === 'customer' || this.role === 'consumer';
    }

    validate() {
        if (!this.name) throw new Error('User name is required.');
        if (!this.email) throw new Error('User email is required.');
        if (!this.email.includes('@')) throw new Error('Invalid email format.');
        if (!this.password) throw new Error('User password is required.');
        const validRoles = ['admin', 'vendor', 'customer', 'consumer'];
        if (!validRoles.includes(this.role)) {
            throw new Error(`Invalid user role: ${this.role}. Must be one of ${validRoles.join(', ')}.`);
        }
        return true;
    }
}

module.exports = User;
