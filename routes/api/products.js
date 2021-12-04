const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/products");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')

// import the Product model
const {
    Product
} = require('../../models');

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
        console.log(_err)
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
    const product = new Product();

    product.set('designer_id', req.body.designer_id);
    product.set('category_id', req.body.category_id);
    product.set('insurance_id', req.body.insurance_id);
    product.set('name', req.body.name);
    product.set('retail_price', req.body.retail_price);
    product.set('selling_price', req.body.selling_price);
    product.set('description', req.body.description);
    product.set('specifications', req.body.specifications);
    product.set('condition', req.body.condition);
    product.set('condition_description', req.body.condition_description);
    product.set('sku', req.body.sku);
    product.set('quantity', req.body.quantity);
    product.set('authenticity', req.body.authenticity);
    product.set('product_image_1', req.body.product_image_1);
    product.set('product_image_2', req.body.product_image_2);
    product.set('product_gallery_1', req.body.product_gallery_1);
    product.set('product_gallery_2', req.body.product_gallery_2);
    product.set('product_gallery_3', req.body.product_gallery_3);
    product.set('product_gallery_4', req.body.product_gallery_4);
    product.set('product_gallery_5', req.body.product_gallery_5);
    product.set('product_gallery_6', req.body.product_gallery_6);
    product.set('product_gallery_7', req.body.product_gallery_7);
    product.set('product_gallery_8', req.body.product_gallery_8);
    product.set('claim_date', req.body.claim_date);
    product.set('claim_amount', req.body.claim_amount);
    const isActive = false;
    if (req.body.active) {
        isActive = req.body.active;
    }
    product.set('active', isActive);
    product.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
    product.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

    await product.save().then(async () => {

        // handle tags
        if (req.body.tags) {
            await product.tags().attach(req.body.tags.split(","));
        }

        res.status(201).send({
            "success": true,
            "message": "New product created successfully",
            "product_id": product.get("id")
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new product due to unexpected error.`
        })
    });;
})

module.exports = router;