const express = require("express");
const router = express.Router();

// import the Product model
const {
    Product
} = require('../../models');

router.get('/', async (req, res) => {
    // fetch all the products (ie, SELECT * from products)

    await Product.collection().fetch({
        withRelated: ["category", "designer", "insurance"]
    }).then(products => {
        res.send(products.toJSON()); // convert collection to JSON
    }).catch(err => {
        console.error("[Exception -> Products GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve products due to unexpected error.`
        })
        return;
    });
    
})

router.get('/:product_id', async (req, res) => {
    // fetch a product by primary key "id"
    const productId = req.params.product_id
    await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ["category", "designer", "insurance"]
    }).then(product => {
        res.status(200).send(product.toJSON()); // convert collection to JSON
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve product due to unexpected error.`
        })
        return;
    });
})

router.put('/:product_id/update', async (req, res) => {
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Product ID ${req.params.product_id}. Product update failed. `
        })
        return;
    });

    if (product !== undefined) {

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

        await product.save().then(() => {
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

router.delete('/:product_id/delete', async (req, res) => {
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

router.post('/create', async (req, res) => {
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

    await product.save().then(() => {
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