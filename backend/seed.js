const mongoose = require('mongoose');
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

        // Find or create default vendor
        let vendor = await User.findOne({ email: 'vendor@example.com' });
        if (!vendor) {
            vendor = await User.create({
                name: 'Jane Vendor',
                email: 'vendor@example.com',
                password: 'Password123!',
                role: 'vendor'
            });
            console.log('Created default vendor:', vendor.email);
        }

        // Read sample products
        const productsFilePath = path.join(__dirname, 'products.json');
        const rawData = fs.readFileSync(productsFilePath, 'utf8');
        const sampleProducts = JSON.parse(rawData);

        // Prepare products for MongoDB
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

        // Clear existing products and insert new ones
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
