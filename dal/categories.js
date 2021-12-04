const e = require("express");
const {
    Category
} = require("../models");

// Retrieve all product categories
async function getAllCategories() {
    try {
        let categories = await Category.collection().fetch();
        return categories;
    } catch(err) {
        throw err;
    }
}

// Retrieve a product category by its id
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

// Create product category
async function createCategory(categoryData) {
    try {
        const category = new Category();
        category.set('name', categoryData.name);
        category.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
        category.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
        await category.save()
        let newCategoryId = category.get("id");
        return newCategoryId;
    } catch(err) {
        throw err;
    }
}

// Update product category
async function updateCategory(categoryId, categoryData) {
    try {
        const category = await Category.where({
            'id': categoryId
        }).fetch({
            require: false
        });

        if (category) {
            category.set('name', categoryData.name);
            category.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
            await category.save()

            return true;
        } else {
            return false;
        }
    } catch(err) {
        throw err;
    }
}

// Delete product category
async function deleteCategory(categoryId) {
    const category = await Category.where({
        'id': categoryId
    }).fetch({
        require: false
    })

    if (category) {
        await category.destroy();
        return true;
    } else {
        return false;
    }
}

module.exports = {
    createCategory,
    deleteCategory,
    getAllCategories, 
    getCategoryById,
    updateCategory
}