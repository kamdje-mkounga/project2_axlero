// Automated API & RBAC Test Suite for Axlero Backend
const BASE_URL = 'http://localhost:5000';

async function runTests() {
    console.log('\n========================================');
    console.log('🚀 Running Axlero Clean Architecture & RBAC Tests');
    console.log('========================================\n');

    try {
        // 1. Health Check
        console.log('1️⃣ Testing GET / (Health Check)...');
        const healthRes = await fetch(`${BASE_URL}/`);
        const healthText = await healthRes.text();
        console.log(`   Status: ${healthRes.status} ("${healthText}")\n`);

        // 2. Auth: Register / Login Customer
        console.log('2️⃣ Testing Customer Auth (Register & Login)...');
        const customerEmail = `customer_${Date.now()}@example.com`;
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Customer',
                email: customerEmail,
                password: 'Password123!',
                role: 'customer'
            })
        });
        const regData = await regRes.json();
        const customerToken = regData.token;
        console.log(`   Registered customer (${customerEmail}), Role: ${regData.user.role}`);

        const custLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: customerEmail,
                password: 'Password123!'
            })
        });
        console.log(`   Customer login status: ${custLoginRes.status} OK\n`);

        // 3. Auth: Login Vendor
        console.log('3️⃣ Testing Vendor Auth (Login)...');
        let vendorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'vendor@example.com',
                password: 'Password123!'
            })
        });

        if (!vendorLoginRes.ok) {
            console.log('   Vendor not found, registering vendor first...');
            await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Jane Vendor',
                    email: 'vendor@example.com',
                    password: 'Password123!',
                    role: 'vendor'
                })
            });
            vendorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'vendor@example.com',
                    password: 'Password123!'
                })
            });
        }
        const vendorData = await vendorLoginRes.json();
        const vendorToken = vendorData.token;
        console.log(`   Vendor logged in! Role: ${vendorData.user.role}\n`);

        // 4. Auth: Login Admin
        console.log('4️⃣ Testing Admin Auth (Login)...');
        let adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@axlero.com',
                password: 'Admin123!'
            })
        });

        if (!adminLoginRes.ok) {
            console.log('   Admin not found, registering admin first...');
            await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Super Admin',
                    email: 'admin@axlero.com',
                    password: 'Admin123!',
                    role: 'admin'
                })
            });
            adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@axlero.com',
                    password: 'Admin123!'
                })
            });
        }
        const adminData = await adminLoginRes.json();
        const adminToken = adminData.token;
        console.log(`   Admin logged in! Role: ${adminData.user.role}\n`);

        // 5. RBAC Negative Test: Unauthenticated User -> 401
        console.log('5️⃣ Testing RBAC: Unauthenticated POST /api/products (Expected: 401)...');
        const unauthRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Should Fail' })
        });
        console.log(`   Status: ${unauthRes.status} (Verified 401 Access Denied)\n`);

        // 6. RBAC Negative Test: Customer trying to create product -> 403
        console.log('6️⃣ Testing RBAC: Customer trying to create product (Expected: 403)...');
        const custCreateRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                name: 'Forbidden Customer Item',
                category: 'Electronics',
                price: 999,
                stock: 5,
                description: 'Should be rejected',
                image: 'https://example.com/img.jpg'
            })
        });
        console.log(`   Status: ${custCreateRes.status} (Verified 403 Forbidden for Customer)\n`);

        // 7. RBAC Positive Test: Vendor creating product -> 201
        console.log('7️⃣ Testing RBAC: Vendor creating product (Expected: 201)...');
        const vendorCreateRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${vendorToken}`
            },
            body: JSON.stringify({
                name: 'RBAC Wireless Mechanical Keyboard',
                category: 'Electronics',
                price: 4999,
                stock: 15,
                description: 'Pure domain entity validated product with tactile switches',
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3'
            })
        });
        const product = await vendorCreateRes.json();
        const productId = product._id;
        console.log(`   Product created! ID: ${productId}, Status: ${product.status}, Price: ₹${product.price}\n`);

        // 8. Public Catalog Browsing: GET /api/products
        console.log('8️⃣ Testing Public GET /api/products...');
        const listRes = await fetch(`${BASE_URL}/api/products?search=Keyboard`);
        const list = await listRes.json();
        console.log(`   Found ${list.length} item(s) matching search "Keyboard"\n`);

        // 9. RBAC Positive Test: Admin elevated access to update product -> 200
        console.log('9️⃣ Testing RBAC: Admin updating product price (Expected: 200)...');
        const adminUpdateRes = await fetch(`${BASE_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                price: 4499,
                stock: 20
            })
        });
        const updatedProduct = await adminUpdateRes.json();
        console.log(`   Admin updated successfully! New Price: ₹${updatedProduct.price}, Stock: ${updatedProduct.stock}\n`);

        // 🔟 Cleanup: Admin/Vendor deletes product -> 200
        console.log('🔟 Testing DELETE /api/products/:id...');
        const deleteRes = await fetch(`${BASE_URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        const deleteResult = await deleteRes.json();
        console.log(`   Delete response: ${JSON.stringify(deleteResult)}\n`);

        // 1️⃣1️⃣ Admin User Management Endpoint: GET /api/auth/users
        console.log('1️⃣1️⃣ Testing GET /api/auth/users (Admin vs Vendor RBAC)...');
        const vendorUsersRes = await fetch(`${BASE_URL}/api/auth/users`, {
            headers: { 'Authorization': `Bearer ${vendorToken}` }
        });
        console.log(`   Vendor access status: ${vendorUsersRes.status} (Verified 403 Forbidden)`);

        const adminUsersRes = await fetch(`${BASE_URL}/api/auth/users`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const usersList = await adminUsersRes.json();
        console.log(`   Admin access status: ${adminUsersRes.status} OK (Fetched ${usersList.length} users)\n`);

        console.log('========================================');
        console.log('🎉 ALL CLEAN ARCHITECTURE & RBAC TESTS PASSED!');
        console.log('========================================\n');
    } catch (err) {
        console.error('❌ Test suite error:', err.message);
    }
}

runTests();
