const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { mongoUri } = require('./src/config/env');
const Product = require('./src/infrastructure/database/ProductModel');
const User = require('./src/infrastructure/database/UserModel');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected.');

        // 1. Seed or Update Default Admin
        const adminPassword = await bcrypt.hash('Admin123!', 10);
        let admin = await User.findOneAndUpdate(
            { email: 'admin@axlero.com' },
            {
                name: 'Super Admin',
                email: 'admin@axlero.com',
                password: adminPassword,
                role: 'admin'
            },
            { upsert: true, new: true }
        );
        console.log('✅ Admin initialized:', admin.email, `(${admin.role})`);

        // 2. Seed or Update Default Vendor
        const vendorPassword = await bcrypt.hash('Password123!', 10);
        let vendor = await User.findOneAndUpdate(
            { email: 'vendor@example.com' },
            {
                name: 'Jane Vendor',
                email: 'vendor@example.com',
                password: vendorPassword,
                role: 'vendor'
            },
            { upsert: true, new: true }
        );
        console.log('✅ Vendor initialized:', vendor.email, `(${vendor.role})`);

        // 3. Seed or Update Default Customer
        const customerPassword = await bcrypt.hash('Customer123!', 10);
        let customer = await User.findOneAndUpdate(
            { email: 'customer@example.com' },
            {
                name: 'Alice Customer',
                email: 'customer@example.com',
                password: customerPassword,
                role: 'customer'
            },
            { upsert: true, new: true }
        );
        console.log('✅ Customer initialized:', customer.email, `(${customer.role})`);

        // 4. Seed Products
        const productsFilePath = path.join(__dirname, 'products.json');
        const rawData = fs.readFileSync(productsFilePath, 'utf8');
        const sampleProducts = JSON.parse(rawData);

        const productsToInsert = sampleProducts.map((p) => ({
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            status: p.stock > 0 ? (p.status || 'In Stock') : 'Out of Stock',
            rating: p.rating || 4.5,
            description: p.description,
            image: p.image,
            vendorId: vendor._id
        }));

        await Product.deleteMany({});
        console.log('Cleared existing products.');

        const inserted = await Product.insertMany(productsToInsert);
        console.log(`\n🎉 Successfully seeded ${inserted.length} products into MongoDB!\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
