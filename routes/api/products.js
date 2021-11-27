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

router.put('/:product_id/update', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['tags']
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Product ID ${req.params.product_id}. Product update failed. `
        })
        return;
    });

    if (product !== undefined) {

        if (req.body.name) { product.set('name', req.body.name); }
        if (req.body.designer_id) { product.set('designer_id', req.body.designer_id); }
        if (req.body.category_id) { product.set('category_id', req.body.category_id); }
        if (req.body.insurance_id) { product.set('insurance_id', req.body.insurance_id); }
        if (req.body.quantity) { product.set('quantity', req.body.quantity); }
        
        if (req.body.retail_price) { product.set('retail_price', req.body.retail_price); }
        if (req.body.selling_price) { product.set('selling_price', req.body.selling_price); }
        if (req.body.description) { product.set('description', req.body.description); }
        if (req.body.specifications) { product.set('specifications', req.body.specifications) };
        if (req.body.condition) { product.set('condition', req.body.condition); }
        if (req.body.condition_description) { product.set('condition_description', req.body.condition_description); }
        if (req.body.sku) { product.set('sku', req.body.sku); }
        if (req.body.authenticity) { product.set('authenticity', req.body.authenticity); }
        if (req.body.product_image_1) { product.set('product_image_1', req.body.product_image_1); }
        if (req.body.product_image_2) { product.set('product_image_2', req.body.product_image_2); }
        if (req.body.product_gallery_1) { product.set('product_gallery_1', req.body.product_gallery_1); }
        if (req.body.product_gallery_2) { product.set('product_gallery_2', req.body.product_gallery_2); }
        if (req.body.product_gallery_3) { product.set('product_gallery_3', req.body.product_gallery_3); }
        if (req.body.product_gallery_4) { product.set('product_gallery_4', req.body.product_gallery_4); }
        if (req.body.product_gallery_5) { product.set('product_gallery_5', req.body.product_gallery_5); }
        if (req.body.product_gallery_6) { product.set('product_gallery_6', req.body.product_gallery_6); }
        if (req.body.product_gallery_7) { product.set('product_gallery_7', req.body.product_gallery_7); }
        if (req.body.product_gallery_8) { product.set('product_gallery_8', req.body.product_gallery_8); }
        if (req.body.claim_date) { product.set('claim_date', req.body.claim_date); }
        if (req.body.claim_amount) { product.set('claim_amount', req.body.claim_amount); }

        product.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await product.save().then(async () => {

            // handle tags
            let tagIds = req.body.tags.split(",");
            let existinTagIds = await product.related("tags").pluck("id");

            // remove all the tags that are not selected anymore
            let tagsToRemove = existinTagIds.filter( id => tagIds.includes(id) === false);
            await product.tags().detach(tagsToRemove);

            // add in all the tags selected
            await product.tags().attach(tagIds);

            res.status(200).send({
                "success": true,
                "message": `Product ID ${req.params.product_id} updated successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to update Product ID ${req.params.product_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:product_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Product ID ${req.params.product_id}. Product deletion failed. `
        })
        return;
    });

    if (product !== undefined) {
        await product.destroy().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Product ID ${req.params.product_id} deleted successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to delete Product ID ${req.params.product_id} due to unexpected error.`
            })
        });
    }

})

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