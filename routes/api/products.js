const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/products");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')


// Retrieve all products
router.get('/', async (_req, res) => {
    await productDataLayer.getAllProducts().then( products => {
        res.status(200).send({
            "success": true,
            "data": products
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve products due to unexpected error.`
        })
        return;
    });
})

// Retrieve a product by its ID
router.get('/:product_id', async (req, res) => {
    await productDataLayer.getProductById(req.params.product_id).then( product => {
        if (product) {
            res.send({
                "success": true,
                "data": product
            })
        } else {
            res.status(404).send({
                "success": false,
                "message": `Product id ${req.params.product_id} does not exists.`
            })
        }
        
    }).catch(_err => {
        console.log(`Unable to retrieve product id ${req.params.product_id}. `, _err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve product id ${req.params.product_id} due to unexpected error.`
        })
        return;
    });
})

// Update a given product
router.put('/:product_id/update', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const productId = req.params.product_id
    try {
        let success = await productDataLayer.updateProduct(productId, req.body);
        if (success) {
            res.status(200).send({
                "success": true,
                "message": `Product ID ${productId} updated successfully`
            })
        } else {
            res.status(200).send({
                "success": false,
                "message": `Unable to update non-existent Product ID ${productId}`
            })
        }
    } catch(_err) {
        console.log(`Unable to update Product ID ${productId}. `, _err)
        res.status(500).send({
            "success": false,
            "message": `Unable to update Product ID ${productId} due to unexpected error.`
        })
    }
})

// Delete a given product
router.delete('/:product_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const productId = req.params.product_id;
    try {
        let success = await productDataLayer.deleteProduct(productId);
        if (success) {
            res.status(200).send({
                "success": true,
                "message": `Product ID ${productId} deleted successfully`
            })
        } else {
            res.status(400).send({
                "success": false,
                "message": `Unable to delete non-existent Product ID ${productId}.`
            })
        }
    } catch(_err) {
        res.status(500).send({
            "success": false,
            "message": `Unable to delete Product ID ${productId} due to unexpected error.`
        })
    }
})

// Create a new product
router.post('/create', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    try {
        const newProductId = await productDataLayer.createProduct(req.body);
        res.status(201).send({
            "success": true,
            "message": "New product created successfully",
            "product_id": newProductId
        })
    } catch(_err) {
        console.log("Unable to create new product. ", _err)
        res.status(500).send({
            "success": false,
            "message": `Unable to create new product due to unexpected error.`
        })
    }
})

module.exports = router;