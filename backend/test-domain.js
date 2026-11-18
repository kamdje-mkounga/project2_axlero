const assert = require('assert');
const UserEntity = require('./src/domain/entities/User');
const ProductEntity = require('./src/domain/entities/Product');
const { verifyToken, requireRoles } = require('./src/interfaces/middleware/authMiddleware');
const authService = require('./src/application/services/AuthService');

console.log('\n========================================');
console.log('🧪 Running Axlero Domain & RBAC Unit Tests');
console.log('========================================\n');

// 1. User Domain Entity Tests
console.log('1️⃣ Testing User Domain Entity...');
const adminUser = new UserEntity({ id: '1', name: 'Admin', email: 'admin@test.com', password: 'hash', role: 'admin' });
assert.strictEqual(adminUser.isAdmin(), true, 'adminUser.isAdmin() should be true');
assert.strictEqual(adminUser.isVendor(), false, 'adminUser.isVendor() should be false');
assert.strictEqual(adminUser.isCustomer(), false, 'adminUser.isCustomer() should be false');
assert.doesNotThrow(() => adminUser.validate(), 'adminUser validation should pass');

const vendorUser = new UserEntity({ id: '2', name: 'Vendor', email: 'vendor@test.com', password: 'hash', role: 'vendor' });
assert.strictEqual(vendorUser.isVendor(), true, 'vendorUser.isVendor() should be true');
assert.strictEqual(vendorUser.isAdmin(), false, 'vendorUser.isAdmin() should be false');
assert.doesNotThrow(() => vendorUser.validate(), 'vendorUser validation should pass');

const customerUser = new UserEntity({ id: '3', name: 'Customer', email: 'cust@test.com', password: 'hash', role: 'customer' });
assert.strictEqual(customerUser.isCustomer(), true, 'customerUser.isCustomer() should be true');
assert.strictEqual(customerUser.isVendor(), false, 'customerUser.isVendor() should be false');
assert.doesNotThrow(() => customerUser.validate(), 'customerUser validation should pass');

const invalidUser = new UserEntity({ id: '4', name: 'Bad', email: 'not-an-email', password: 'hash', role: 'invalid_role' });
assert.throws(() => invalidUser.validate(), /Invalid email format/, 'Should reject invalid email format');
console.log('   ✅ User Domain Entity passed.\n');

// 2. Product Domain Entity Tests
console.log('2️⃣ Testing Product Domain Entity...');
const prod = new ProductEntity({
    id: 'p1',
    name: 'Tactile Keyboard',
    category: 'Electronics',
    price: 3499,
    stock: 5,
    rating: 4.7,
    description: 'RGB keyboard',
    image: 'https://example.com/keyboard.jpg',
    vendorId: 'v1'
});
assert.strictEqual(prod.isAvailable(), true, 'Product should be available');
assert.strictEqual(prod.status, 'In Stock');
prod.updateStock(0);
assert.strictEqual(prod.isAvailable(), false, 'Product should be out of stock');
assert.strictEqual(prod.status, 'Out of Stock');
assert.doesNotThrow(() => prod.validate(), 'Product validation should pass');

const invalidProd = new ProductEntity({ name: '', price: -10 });
assert.throws(() => invalidProd.validate(), /Product name is required/, 'Should reject empty name');
console.log('   ✅ Product Domain Entity passed.\n');

// 3. RBAC & JWT Middleware Tests
console.log('3️⃣ Testing RBAC & JWT Middleware...');
function createMocks(token, user) {
    const req = {
        headers: token ? { authorization: 'Bearer ' + token } : {},
        user: user || null
    };
    let statusCode = 200;
    let jsonBody = null;
    const res = {
        status(code) { statusCode = code; return this; },
        json(data) { jsonBody = data; return this; }
    };
    let calledNext = false;
    const next = () => { calledNext = true; };
    return { req, res, next, getStatus: () => statusCode, getBody: () => jsonBody, isNextCalled: () => calledNext };
}

// Token Verification
const token = authService.generateToken({ id: 'u1', role: 'vendor' });
const mockValid = createMocks(token);
verifyToken(mockValid.req, mockValid.res, mockValid.next);
assert.strictEqual(mockValid.isNextCalled(), true, 'Valid token should call next()');
assert.strictEqual(mockValid.req.user.role, 'vendor');

const mockMissing = createMocks(null);
verifyToken(mockMissing.req, mockMissing.res, mockMissing.next);
assert.strictEqual(mockMissing.isNextCalled(), false, 'Missing token should not call next()');
assert.strictEqual(mockMissing.getStatus(), 401, 'Missing token should return 401');

// RBAC: Vendor route
const vendorGuard = requireRoles('vendor');

// Vendor accessing vendor route -> OK
const mockVendor = createMocks(null, { id: 'v1', role: 'vendor' });
vendorGuard(mockVendor.req, mockVendor.res, mockVendor.next);
assert.strictEqual(mockVendor.isNextCalled(), true, 'Vendor should access vendor route');

// Customer accessing vendor route -> Forbidden (403)
const mockCustomer = createMocks(null, { id: 'c1', role: 'customer' });
vendorGuard(mockCustomer.req, mockCustomer.res, mockCustomer.next);
assert.strictEqual(mockCustomer.isNextCalled(), false, 'Customer should be blocked from vendor route');
assert.strictEqual(mockCustomer.getStatus(), 403, 'Should return 403 Forbidden');

// Admin accessing vendor route -> Elevated Access (OK)
const mockAdmin = createMocks(null, { id: 'a1', role: 'admin' });
vendorGuard(mockAdmin.req, mockAdmin.res, mockAdmin.next);
assert.strictEqual(mockAdmin.isNextCalled(), true, 'Admin should have elevated access to vendor route');

console.log('   ✅ RBAC Middleware passed.\n');
console.log('========================================');
console.log('🎉 ALL UNIT TESTS PASSED SUCCESSFULLY!');
console.log('========================================\n');
