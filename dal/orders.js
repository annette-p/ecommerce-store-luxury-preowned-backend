const {
    Order,
    OrderShipment
} = require("../models");

// Retrieve all orders
async function getAllOrders() {
    try {
        let orders = await Order.collection().fetch({
            withRelated: ["user", "products"]
        });
        return orders;
    } catch (err) {
        throw err
    }
}

// Retrieve a specific order by id
async function getOrderById(orderId) {
    try {
        let order = await Order.where({
            'id': orderId
        }).fetch({
            require: false,
            withRelated: ["user", "products"]
        });
        return order;
    } catch (err) {
        throw err
    }
}

// Retrieve orders for a user
async function getOrdersByUser(userId) {
    try {
        let orders = await Order.where({
            'user_id': userId
        }).fetch({
            require: false,
            withRelated: ["products"]
        });
        return orders;
    } catch (err) {
        throw err
    }
}

// Create order for a user
async function createOrder(orderData) {

    try {
        const order = new Order();

        order.set('user_id', orderData.user_id);
        order.set('payment_reference', orderData.payment_reference)
        order.set('payment_method', orderData.payment_method)
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

// Update a given order id
async function updateOrderById(orderId, newNewData) {
    await getOrderById(orderId)
    .then( async (order) => {
        order.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        cart.set("status", newNewData.status);
        cart.set("comment", newNewData.comment);

        await order.save().then(async () => {
            //
        }).catch(err => {
            throw err;
        });
    })
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    updateOrderById
}