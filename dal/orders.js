const {
    Order,
    OrderShipment
} = require("../models");

// List of valid order statuses
function getStatusList() {
    return [
        "New",
        "Processing",
        "Shipment",
        "Completed",
        "Cancelled",
        "Refund"
    ]
}

// List of supported shipment/courier providers
function getShipmentProviderList() {
    return [
        "FedEx",
        "Lalamove",
        "NinjaVan",
        "SingPost"
    ]
}

// Retrieve all orders
async function getAllOrders() {
    try {
        let orders = await Order.collection().fetch({
            withRelated: ["user", "products", "orderShipment"]
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
            withRelated: ["user", "products", "orderShipment"]
        });
        return order;
    } catch (err) {
        throw err
    }
}

// Retrieve orders for a user
async function getOrdersByUser(userId) {
    let q = Order.collection()
    q.where('user_id', '=', userId)
    try {
        let orders = await q.fetch({
            require: false,
            withRelated: ["products", "orderShipment"]
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

// Update a given order id
async function updateOrderById(orderId, newOrderData) {
    try {
        const order = await getOrderById(orderId)
        order.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        order.set("status", newOrderData.status);
        order.set("comment", newOrderData.comment);
        await order.save()

        const orderShipment = await OrderShipment.where({
            'order_id': orderId
        }).fetch()
        orderShipment.set("shipment_provider", newOrderData.shipment_provider)
        orderShipment.set("tracking_number", newOrderData.tracking_number)
        orderShipment.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
        await orderShipment.save()
    } catch(err) {
        throw err;
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    getStatusList,
    getShipmentProviderList,
    updateOrderById
}