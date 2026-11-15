class Product {
    constructor(id, name, category, price, stock, description, image, vendorId) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.status = stock > 0 ? 'In Stock' : 'Out of Stock';
        this.description = description;
        this.image = image;
        this.vendorId = vendorId;
    }
}
module.exports = Product;