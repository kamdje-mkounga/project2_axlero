const productService = require('../../application/services/ProductService');

class ProductController {
    async getProducts(req, res) {
        try {
            const products = await productService.getAllProducts(req.query);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProduct(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const productData = { ...req.body, vendorId: req.user.id };
            const product = await productService.createProduct(productData);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async remove(req, res) {
        try {
            const result = await productService.deleteProduct(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();