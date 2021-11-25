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
        console.log(carts)
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

// get a specific cart by id
router.get('/:cart_id', async (req, res) => {
    await cartDataLayer.getCartById(req.params.cart_id).then( cart => {
        if (cart) {
            res.send({
                "success": true,
                "data": cart
            })
        } else {
            res.status(404).send({
                "success": false,
                "message": `Cart id ${req.params.cart_id} does not exists.`
            })
        }
        
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve cart id ${req.params.cart_id} due to unexpected error.`
        })
        return;
    });
})

// Update a specific cart by its ID 
router.put('/:cart_id/update', checkIfAuthenticatedJWT, async (req, res) => {

    await cartDataLayer.updateCartById(req.params.cart_id, req.body)
    .then( () => {
        res.status(200).send({
            "success": true,
            "message": `Cart id ${req.params.cart_id} updated successfully`
        })
    }).catch(_err => {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to update Cart id ${req.params.cart_id} due to unexpected error.`
        })
    });
})

// Delete a specific cart by its ID
router.delete('/:cart_id/delete', checkIfAuthenticatedJWT, async (req, res) => {

    await cartDataLayer.deleteCartById(req.params.cart_id)
    .then( () => {
        res.status(200).send({
            "success": true,
            "message": `Cart id ${req.params.cart_id} deleted successfully`
        })
    }).catch(_err => {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to delete Cart id ${req.params.cart_id} due to unexpected error.`
        })
    });
})

router.post('/create', checkIfAuthenticatedJWT, async (req, res) => {
    await cartDataLayer.createCart(req.body)
    .then( (newCartId) => {
        res.status(201).send({
            "success": true,
            "message": "New cart created successfully",
            "cart_id": newCartId
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new cart due to unexpected error.`
        })
    });
})

module.exports = router;