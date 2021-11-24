const {
    Category,
    Designer,
    Product
} = require("../models");

async function getAllProducts() {
    try {
        let products = await Product.collection().fetch({
            withRelated: ["category", "designer", "insurance", "tags"]
        });
        return products;
    } catch(err) {
        throw err
    }
}

async function getProductById(productId) {
    try {
        let product = await Product.where({
            'id': productId
        }).fetch({
            require: false,
            withRelated: ["category", "designer", "insurance", "tags"]
        });
        return product;
    } catch(err) {
        throw err;
    }
    
}

async function getAllCategories() {
    try {
        let categories = await Category.collection().fetch();
        return categories;
    } catch(err) {
        throw err;
    }
}

async function getCategoryById(categoryId) {
    try {
        let category = await Category.where({
            'id': categoryId
        }).fetch({
            require: false
        });
        return category;
    } catch(err) {
        throw err;
    }
}

async function getAllDesigners() {
    try {
        let designers = await Designer.collection().fetch();
        return designers;
    } catch(err) {
        throw err;
    }
}

async function getDesignerById(designerId) {
    try {
        let designer = await Designer.where({
            'id': designerId
        }).fetch({
            require: false
        });
        return designer;
    } catch(err) {
        throw err;
    }
}


module.exports = {
    getAllCategories, getCategoryById,
    getAllDesigners, getDesignerById,
    getAllProducts, getProductById
}