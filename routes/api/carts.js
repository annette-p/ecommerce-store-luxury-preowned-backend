const express = require("express");
const router = express.Router();

const cartDataLayer = require("../../dal/carts");
const {
    checkIfAuthenticatedJWT
} = require('../../middlewares/authentication')

// import the Cart model
const {
    Cart
} = require('../../models');

// Retrieve all carts
router.get('/', async (_req, res) => {
    await cartDataLayer.getAllCarts().then( carts => {
        res.status(200).send({
            "success": true,
            "data": carts
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve carts due to unexpected error.`
        })
        return;
    });
})

router.put('/:cart_id/update', checkIfAuthenticatedJWT, async (req, res) => {
    const cart = await Cart.where({
        'id': req.params.cart_id
    }).fetch({
        require: true,
        withRelated:["user", "products"]
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve cart id ${req.params.cart_id}. Cart update failed. `
        })
        return;
    });

    if (cart !== undefined) {

        cart.set('user_id', req.body.user_id);
        cart.set('date_created', new Date());

        await cart.save().then(async () => {

            let selectedItemsId = req.body.items.map(item => item.product_id);

            let existingItemIds = await cart.related("products").pluck("id");
            let itemsToRemove = existingItemIds.filter( id => selectedItemsId.includes(id) === false);
            await cart.products().detach(itemsToRemove);

            req.body.items.forEach( async (item) => {

                if (existingItemIds.includes(item.product_id)) {
                    cart.products().updatePivot({
                        "quantity": item.quantity
                    }, {
                        query: function(qb) {
                            qb.where({
                                "product_id": item.product_id
                            })
                        }
                    })
                } else {
                    cart.products().attach(item)
                }
                
            })

            res.status(200).send({
                "success": true,
                "message": `Cart id ${req.params.cart_id} updated successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to update Cart id ${req.params.cart_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:cart_id/delete', checkIfAuthenticatedJWT, async (req, res) => {
    const cart = await Cart.where({
        'id': req.params.cart_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Cart ID ${req.params.cart_id}. Cart deletion failed. `
        })
        return;
    });

    if (cart !== undefined) {
        await cart.destroy().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Cart ID ${req.params.cart_id} deleted successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to delete Product ID ${req.params.product_id} due to unexpected error.`
            })
        });
    }

})

router.post('/create', checkIfAuthenticatedJWT, async (req, res) => {
    const cart = new Cart();

    cart.set('user_id', req.body.user_id);
    cart.set('date_created', new Date());

    await cart.save().then(async () => {

        // handle tags
        if (req.body.items) {
            await cart.products().attach(req.body.items);
        }

        res.status(201).send({
            "success": true,
            "message": "New cart created successfully",
            "cart_id": cart.get("id")
        })
    }).catch(_err => {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to create new cart due to unexpected error.`
        })
    });
})

module.exports = router;