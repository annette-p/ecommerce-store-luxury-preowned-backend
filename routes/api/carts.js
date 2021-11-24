const express = require("express");
const router = express.Router();

const cartDataLayer = require("../../dal/carts");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')

// import the Category model
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

// [checkIfAuthenticatedJWT, checkIsAdminJWT] --> to add after
router.post('/create', async (req, res) => {
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