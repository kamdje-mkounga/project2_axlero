const ProductModel = require('../../infrastructure/database/ProductModel');
const ProductEntity = require('../../domain/entities/Product');

class ProductService {
    async getAllProducts(query = {}) {
        const filter = {};
        if (query.category && query.category !== 'All') {
            filter.category = query.category;
        }
        if (query.search) {
            filter.name = { $regex: query.search, $options: 'i' };
        }
        if (query.vendorId) {
            filter.vendorId = query.vendorId;
        }
        return await ProductModel.find(filter).populate('vendorId', 'name email role');
    }

    async getProductById(id) {
        const product = await ProductModel.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async createProduct(productData) {
        const productEntity = new ProductEntity(productData);
        productEntity.validate();

        const product = new ProductModel({
            name: productEntity.name,
            category: productEntity.category,
            price: productEntity.price,
            stock: productEntity.stock,
            status: productEntity.status,
            rating: productEntity.rating,
            description: productEntity.description,
            image: productEntity.image,
            vendorId: productEntity.vendorId
        });

        return await product.save();
    }

    async updateProduct(id, updateData) {
        if (updateData.stock !== undefined) {
            updateData.status = updateData.stock > 0 ? 'In Stock' : 'Out of Stock';
        }
        const product = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) throw new Error('Product not found');
        return product;
    }

    async deleteProduct(id) {
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) throw new Error('Product not found');
        return { message: 'Product deleted successfully' };
    }
}

module.exports = new ProductService();
