const express = require("express");
const router = express.Router();

const categoryDataLayer = require("../../dal/categories");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')


// Retrieve all product categories
router.get('/', async (req, res) => {
    await categoryDataLayer.getAllCategories().then( categories => {
        res.status(200).send({
            "success": true,
            "data": categories
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve categories due to unexpected error.`
        })
        return;
    });
})

// Retrieve a specific product category by id
router.get('/:category_id', async (req, res) => {
    await categoryDataLayer.getCategoryById(req.params.category_id).then( category => {
        if (category) {
            res.send({
                "success": true,
                "data": category
            });
        } else {
            res.status(404).send({
                "success": false,
                "message": `Category id ${req.params.category_id} does not exists.`
            });
        }
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve category id ${req.params.category_id} due to unexpected error.`
        })
        return;
    });
})

// Update a product category
router.put('/:category_id/update', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    let categoryId = req.params.category_id;
    try {
        const success = await categoryDataLayer.updateCategory(categoryId, req.body);
        if (success) {
            res.status(200).send({
                "success": true,
                "message": `Category ID ${categoryId} updated successfully`
            })
        } else {
            res.status(404).send({
                "success": false,
                "message": `Unable to retrieve Category ID ${categoryId}. Category update failed. `
            })
        }
    } catch(_err) {
        console.log(_err);
        res.status(500).send({
            "success": false,
            "message": `Unable to update Category ID ${categoryId} due to unexpected error.`
        })
    }
})

// Delete a product category
router.delete('/:category_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    let categoryId = req.params.category_id;
    try {
        const success = await categoryDataLayer.deleteCategory(categoryId);
        if (success) {
            res.status(200).send({
                "success": true,
                "message": `Category ID ${categoryId} deleted successfully`
            })
        } else {
            res.status(404).send({
                "success": false,
                "message": `Unable to retrieve Category ID ${categoryId}. Category deletion failed. `
            })
        }
    } catch(_err) {
        res.status(500).send({
            "success": false,
            "message": `Unable to delete Category ID ${categoryId} due to unexpected error.`
        })
    }
})


// Create new product category
router.post('/create', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    try {
        const newCategoryId = await categoryDataLayer.createCategory(req.body);
        res.status(201).send({
            "success": true,
            "message": "New category created successfully",
            "category_id": newCategoryId
        })
    } catch(err) {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new category due to unexpected error.`
        })
    }
})

module.exports = router;