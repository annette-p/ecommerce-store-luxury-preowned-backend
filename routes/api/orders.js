const express = require("express");
const router = express.Router();

const orderDataLayer = require("../../dal/orders");
const {
    checkIfAuthenticatedJWT,
} = require('../../middlewares/authentication');

// Retrieve all orders
router.get('/', [ checkIfAuthenticatedJWT ], async (req, res) => {
    let orders;
    try {
        if (req.user.role === "Admin") {
            // Admins can retrieve all orders
            // - pass optional search criteria as part of URL parameters (in req.query)
            orders = await orderDataLayer.getAllOrders(req.query);
        } else {
            // Customers can only retrieve their orders
            orders = await orderDataLayer.getOrdersByUser(req.user.id)
        }
        res.status(200).send({
            "success": true,
            "data": orders
        })
    } catch(err) {
        console.log(err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve orders due to unexpected error.`
        })
    }
})

// Retrieve list of valid order statuses
router.get('/statuses', async (req, res) => {
    res.status(200).send({
        "success": true,
        "data": await orderDataLayer.getStatusList()
    })
})

// Retrieve list of supported shipment/courier providers
router.get('/shipment-providers', async (req, res) => {
    res.status(200).send({
        "success": true,
        "data": await orderDataLayer.getShipmentProviderList()
    })
})

// Retrieve an order
router.get('/:order_id', [ checkIfAuthenticatedJWT ], async (req, res) => {
    const orderId = req.params.order_id;
    try {
        const order = await orderDataLayer.getOrderById(orderId);
        res.status(200).send({
            "success": true,
            "data": order
        })
    } catch(err) {
        console.log(err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve orders due to unexpected error.`
        })
    }
})

// Update an order
router.put('/:order_id/update', [ checkIfAuthenticatedJWT ], async (req, res) => {
    const orderId = req.params.order_id
    let newOrderData = {}
    if (req.body.status) { newOrderData.status = req.body.status; }
    if (req.body.comment) { newOrderData.comment = req.body.comment; }
    if (req.body.shipment_provider) { newOrderData.shipment_provider = req.body.shipment_provider; }
    if (req.body.tracking_number) { newOrderData.tracking_number = req.body.tracking_number; }

    try {
        await orderDataLayer.updateOrderById(orderId, newOrderData)
        res.status(200).send({
            "success": true,
            "message": `Order Id ${orderId} updated.`
        })
    } catch(err) {
        console.log(err)
        res.status(500).send({
            "success": false,
            "message": `Unable to update order id ${orderId} due to unexpected error.`
        })
    }
    
})

module.exports = router;