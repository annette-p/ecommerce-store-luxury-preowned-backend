const express = require("express");
const router = express.Router();

const cartServiceLayer = require("../../services/cart")
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT,
    checkIsCustomerJWT,
    parseJWT
} = require('../../middlewares/authentication');


// Retrieve all carts with user info (by admins)
router.get('/', [ checkIfAuthenticatedJWT, checkIsAdminJWT ], async (_req, res) => {
    await cartServiceLayer.getAllShoppingCarts().then( carts => {
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

// Create cart, with optional list of items
router.post('/create', [parseJWT], async (req, res) => {
    let userId = req.user ? req.user.id : undefined
    let cartData = req.body;
    await cartServiceLayer.createCart(userId, cartData)
    .then( cartId => {
        res.status(201).send({
            "success": true,
            "cart_id": cartId
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new cart due to unexpected error.`
        })
    });
})

// get a specific cart by id 
router.get('/:cart_id', [parseJWT], async (req, res) => {
    let cartId = req.params.cart_id;
    await cartServiceLayer.getCartById(cartId).then( cart => {
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
router.put('/:cart_id/own', [checkIfAuthenticatedJWT], async (req, res) => {
    const cartId = req.params.cart_id
    const userId = req.user.id
    try {
        await cartServiceLayer.assignCartOwner(cartId, userId)
        res.status(200).send({
            "success": true,
            "message": `Cart id ${cartId} ownership updated successfully`
        })
    } catch(_err) {
        res.status(500).send({
            "success": false,
            "message": `Unable to update ownership of Cart id ${cartId} due to unexpected error.`
        })
    };
})


// Update a specific cart by its ID 
router.put('/:cart_id/update', [parseJWT], async (req, res) => {
    const cartId = req.params.cart_id
    const cartData = req.body
    try {
        await cartServiceLayer.updateCart(cartId, cartData)
        res.status(200).send({
            "success": true,
            "message": `Cart id ${cartId} updated successfully`
        })
    } catch(_err) {
        res.status(500).send({
            "success": false,
            "message": `Unable to update Cart id ${cartId} due to unexpected error.`
        })
    };
})

// Update a specific cart by its ID 
router.put('/:cart_id/update/:product_id', [parseJWT], async (req, res) => {
    const cartId = req.params.cart_id
    const productId = req.params.product_id
    const newQuantity = req.body.quantity

    try {
        await cartServiceLayer.updateQuantityOfCartItem(cartId, productId, newQuantity)
        res.status(200).send({
            "success": true,
            "message": `Quantity of product id ${productId} in cart id ${cartId} updated successfully`
        })
    } catch(_err) {
        res.status(500).send({
            "success": false,
            "message": `Unable to update Cart id ${cartId} due to unexpected error.`
        })
    }
})

module.exports = router;