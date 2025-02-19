const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/products");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')


// Retrieve all products
router.get('/', async (req, res) => {
    // pass optional search criteria as part of URL parameters (in req.query)
    await productDataLayer.getAllProducts(req.query).then( products => {
        res.status(200).send({
            "success": true,
            "data": products
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve products due to unexpected error.`
        })
        return;
    });
})

// Retrieve list of valid product conditions
router.get('/conditions', async (req, res) => {
    res.status(200).send({
        "success": true,
        "data": await productDataLayer.getProductConditionList()
    })
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
        
    }).catch(err => {
        console.log(`Unable to retrieve product id ${req.params.product_id}. `, err)
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
    } catch(err) {
        console.log(`Unable to update Product ID ${productId}. `, err)
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
                "message": `Unable to delete Product ID ${productId}.`
            })
        }
    } catch(err) {
        console.log(err)
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
    } catch(err) {
        console.log("Unable to create new product. ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to create new product due to unexpected error.`
        })
    }
})

module.exports = router;