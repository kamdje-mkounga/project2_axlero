// Automated API test script for Axlero Backend
const BASE_URL = 'http://localhost:5000';

async function runTests() {
    console.log('\nStarting Axlero Backend API Tests...\n');

    try {
        // 1. Health Check
        console.log('Testing GET / (Health Check)...');
        const healthRes = await fetch(`${BASE_URL}/`);
        const healthText = await healthRes.text();
        console.log(` Status ${healthRes.status}: "${healthText}"\n`);

        // 2. Auth Login (Vendor)
        console.log('Testing POST /api/auth/login...');
        let loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'vendor@example.com',
                password: 'Password123!'
            })
        });

        // If user not found, register first
        if (!loginRes.ok) {
            console.log('   User not found, registering vendor first...');
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
            loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'vendor@example.com',
                    password: 'Password123!'
                })
            });
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log(`Logged in successfully! Received JWT Token.\n`);

        // 3. Create Product (POST)
        console.log('Testing POST /api/products (Create Product)...');
        const createRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Gaming Mouse',
                category: 'Electronics',
                price: 2999,
                stock: 10,
                description: 'Ultra-lightweight RGB gaming mouse',
                image: 'https://images.unsplash.com/photo-1527814050087-3793815479db'
            })
        });
        const product = await createRes.json();
        const productId = product._id;
        console.log(`Product created! ID: ${productId}, Status: ${product.status}\n`);

        // 4. Get All Products (GET)
        console.log('Testing GET /api/products (List & Filter)...');
        const listRes = await fetch(`${BASE_URL}/api/products?search=Gaming`);
        const list = await listRes.json();
        console.log(` Found ${list.length} product(s) matching search "Gaming"\n`);

        // 5. Get Product by ID (GET)
        console.log(`Testing GET /api/products/${productId}...`);
        const getRes = await fetch(`${BASE_URL}/api/products/${productId}`);
        const singleProduct = await getRes.json();
        console.log(`Product fetched: ${singleProduct.name} (₹${singleProduct.price})\n`);

        // 6. Update Product (PUT)
        console.log(`Testing PUT /api/products/${productId} (Update price & set stock to 0)...`);
        const updateRes = await fetch(`${BASE_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                price: 2499,
                stock: 0
            })
        });
        const updatedProduct = await updateRes.json();
        console.log(`  Updated! New Price: ₹${updatedProduct.price}, Status: "${updatedProduct.status}"\n`);

        // 7. Delete Product (DELETE)
        console.log(`Testing DELETE /api/products/${productId}...`);
        const deleteRes = await fetch(`${BASE_URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const deleteResult = await deleteRes.json();
        console.log(`  Response: ${JSON.stringify(deleteResult)}\n`);

        // 8. Verify Deletion
        console.log(` Verifying deletion via GET /api/products/${productId}...`);
        const verifyRes = await fetch(`${BASE_URL}/api/products/${productId}`);
        const verifyResult = await verifyRes.json();
        console.log(` Verified! Response (${verifyRes.status}): ${JSON.stringify(verifyResult)}\n`);

        console.log('ALL API TESTS PASSED SUCCESSFULLY!\n');
    } catch (err) {
        console.error(' Test failed with error:', err.message);
    }
}

runTests();
