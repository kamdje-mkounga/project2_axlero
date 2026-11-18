/**
 * Pure Domain Entity: Product
 * Clean Architecture Enterprise Business Object (No ORM / Framework dependencies)
 */
class Product {
    constructor(paramsOrId, name, category, price, stock, description, image, vendorId, rating = 4.5) {
        if (typeof paramsOrId === 'object' && paramsOrId !== null) {
            const { id, name, category, price, stock = 0, rating = 4.5, description, image, vendorId, createdAt, updatedAt } = paramsOrId;
            this.id = id;
            this.name = name ? name.trim() : '';
            this.category = category;
            this.price = Number(price);
            this.stock = Number(stock);
            this.rating = Number(rating);
            this.status = this.stock > 0 ? 'In Stock' : 'Out of Stock';
            this.description = description;
            this.image = image;
            this.vendorId = vendorId;
            this.createdAt = createdAt || new Date();
            this.updatedAt = updatedAt || new Date();
        } else {
            this.id = paramsOrId;
            this.name = name ? name.trim() : '';
            this.category = category;
            this.price = Number(price);
            this.stock = Number(stock || 0);
            this.rating = Number(rating || 4.5);
            this.status = this.stock > 0 ? 'In Stock' : 'Out of Stock';
            this.description = description;
            this.image = image;
            this.vendorId = vendorId;
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    isAvailable() {
        return this.stock > 0;
    }

    updateStock(newStock) {
        this.stock = Math.max(0, Number(newStock));
        this.status = this.stock > 0 ? 'In Stock' : 'Out of Stock';
        this.updatedAt = new Date();
    }

    validate() {
        if (!this.name) throw new Error('Product name is required.');
        if (!this.category) throw new Error('Product category is required.');
        if (isNaN(this.price) || this.price < 0) throw new Error('Product price must be a non-negative number.');
        if (isNaN(this.stock) || this.stock < 0) throw new Error('Product stock must be a non-negative number.');
        if (!this.description) throw new Error('Product description is required.');
        if (!this.image) throw new Error('Product image is required.');
        return true;
    }
}

module.exports = Product;
