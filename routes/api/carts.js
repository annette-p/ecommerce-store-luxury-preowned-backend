const express = require("express");
const router = express.Router();

const cartDataLayer = require("../../dal/carts");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT,
    checkIsCustomerJWT
} = require('../../middlewares/authentication')

// Retrieve cart for authenticated customers
router.get('/', [ checkIfAuthenticatedJWT, checkIsCustomerJWT ], async (req, res) => {
    let userId = req.user.id;
    await cartDataLayer.getCartByUser(userId).then( cart => {
        res.status(200).send({
            "success": true,
            "data": cart
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve carts due to unexpected error.`
        })
        return;
    });
})

// Retrieve all carts (by admins)
router.get('/all', [ checkIfAuthenticatedJWT, checkIsAdminJWT ], async (_req, res) => {
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

// get a specific cart by id (by admins)
router.get('/:cart_id', [ checkIfAuthenticatedJWT, checkIsAdminJWT ], async (req, res) => {
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

// // Update a specific cart by its ID 
// router.put('/:cart_id/update', checkIfAuthenticatedJWT, async (req, res) => {

//     await cartDataLayer.updateCartById(req.params.cart_id, req.body)
//     .then( () => {
//         res.status(200).send({
//             "success": true,
//             "message": `Cart id ${req.params.cart_id} updated successfully`
//         })
//     }).catch(_err => {
//         res.status(500).send({
//             "success": false,
//             "message": `Unable to update Cart id ${req.params.cart_id} due to unexpected error.`
//         })
//     });
// })

// Delete a specific cart by its ID
// router.delete('/:cart_id/delete', checkIfAuthenticatedJWT, async (req, res) => {

//     await cartDataLayer.deleteCartById(req.params.cart_id)
//     .then( () => {
//         res.status(200).send({
//             "success": true,
//             "message": `Cart id ${req.params.cart_id} deleted successfully`
//         })
//     }).catch(_err => {
//         console.log(_err)
//         res.status(500).send({
//             "success": false,
//             "message": `Unable to delete Cart id ${req.params.cart_id} due to unexpected error.`
//         })
//     });
// })

// Create cart for the authenticated user
router.post('/create', [ checkIfAuthenticatedJWT, checkIsCustomerJWT ], async (req, res) => {
    let userId = req.user.id;
    let cartData = req.body;
    await cartDataLayer.createCart(userId, cartData)
    .then( (newCartId) => {
        res.status(201).send({
            "success": true,
            "message": "New cart created successfully",
            "cart_id": newCartId
        })
    }).catch(_err => {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to create new cart due to unexpected error.`
        })
    });
})

router.put('/update', [ checkIfAuthenticatedJWT, checkIsCustomerJWT ], async (req, res) => {
    let userId = req.user.id;
    let cartData = req.body;
    await cartDataLayer.updateCartByUser(userId, cartData)
    .then( () => {
        res.status(200).send({
            "success": true,
            "message": `Cart updated successfully`
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to update cart due to unexpected error.`
        })
    });
})

module.exports = router;