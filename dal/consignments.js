const {
    Consignment
} = require("../models");

// Retrieve all consignments along with the user information.
// This would be exposed to admins
async function getAllConsignments() {
    try {
        let consignments = await Consignment.collection().fetch({
            withRelated: ["user", "products"]
        });
        return consignments;
    } catch (err) {
        throw err
    }
}

// Retrieve consignments for a user
async function getConsignmentsByUser(userId) {
    let q = Consignment.collection()
    q.where('user_id', '=', userId)
    try {
        let consignments = await q.fetch({
            require: false,
            withRelated: ["products"]
        });
        return consignments;
    } catch (err) {
        throw err
    }
}

// Create consignment for a user
async function createConsignment(consignmentData) {

    try {
        const consignment = new Consignment();

        consignment.set('user_id', orderData.user_id);
        consignment.set('product_id', orderData.payment_reference)
        consignment.set('payment_method', orderData.payment_method)
        order.set('payment_amount', orderData.payment_amount)
        order.set('status', "New")
        order.set('comment', orderData.comment)
        order.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
        order.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await order.save();

        const orderId = order.get("id")

        // handle items in order
        if (orderData.items) {
            await order.products().attach(orderData.items);
        }

        const shipment = new OrderShipment();
        shipment.set('order_id', orderId)
        shipment.set('shipping_address', orderData.shipping_address)
        shipment.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
        shipment.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await shipment.save();

        return orderId;
    } catch(err) {
        throw err
    }
}

module.exports = {
    createConsignment,
    getConsignmentsByUser,
    getAllConsignments
}