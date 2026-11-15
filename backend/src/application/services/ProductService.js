const Product = require('../../infrastructure/database/ProductModel');

class ProductService {
    async getAllProducts(query = {}) {
        const filter = {};
        if (query.category && query.category !== 'All') {
            filter.category = query.category;
        }
        if (query.search) {
            filter.name = { $regex: query.search, $options: 'i' };
        }
        return await Product.find(filter);
    }

    async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async createProduct(productData) {
        productData.status = productData.stock > 0 ? 'In Stock' : 'Out of Stock';
        const product = new Product(productData);
        return await product.save();
    }

    async updateProduct(id, updateData) {
        if (updateData.stock !== undefined) {
            updateData.status = updateData.stock > 0 ? 'In Stock' : 'Out of Stock';
        }
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) throw new Error('Product not found');
        return product;
    }

    async deleteProduct(id) {
        const product = await Product.findByIdAndDelete(id);
        if (!product) throw new Error('Product not found');
        return { message: 'Product deleted successfully' };
    }
}

module.exports = new ProductService();