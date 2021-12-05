const {
    Consignment
} = require("../models");

const productDataLayer = require("./products");

// List of valid consignment statuses
function getStatusList() {
    return [
        "New",
        "Initial Evaluation",
        "Official Evaluation",
        "Shipment",
        "Listed",
        "Rejected",
        "Cancelled",
        "Refund"
    ]
}

// Retrieve all consignments along with the user information.
// This would be exposed to admins
async function getAllConsignments() {
    try {
        let consignments = await Consignment.collection().fetch({
            withRelated: ["user", "product", "product.category", "product.designer"]
        });
        return consignments;
    } catch (err) {
        throw err
    }
}

// Retrieve a consignment by id
async function getConsignmentById(consignmentId) {
    try {
        let consignment = await Consignment.where({
            'id': consignmentId
        }).fetch({
            require: false,
            withRelated: ["user", "product", "product.category", "product.designer"]
        });
        return consignment;
    } catch(err) {
        throw err;
    }
    
}

// Retrieve consignments for a user
async function getConsignmentsByUser(userId) {
    let q = Consignment.collection()
    q.where('user_id', '=', userId);
    try {
        let consignments = await q.fetch({
            require: false,
            withRelated: ["products"]
        });
        return consignments;
    } catch (err) {
        throw err;
    }
}

// Create consignment for a user
async function createConsignment(userId, consignmentData) {

    try {
        const productData = {
            designer_id: consignmentData.designer_id,
            category_id: consignmentData.category_id,
            name: consignmentData.name, 
            condition: consignmentData.condition,
            condition_description: consignmentData.condition_description,
            selling_price: consignmentData.selling_price,
            specifications: consignmentData.specifications,
            quantity: 1,
            active: false,
            authenticity: false,
            product_gallery_1: consignmentData.product_gallery_1,
            product_gallery_2: consignmentData.product_gallery_2,
            product_gallery_3: consignmentData.product_gallery_3,
            product_gallery_4: consignmentData.product_gallery_4,
            product_gallery_5: consignmentData.product_gallery_5,
            product_gallery_6: consignmentData.product_gallery_6,
            product_gallery_7: consignmentData.product_gallery_7,
            product_gallery_8: consignmentData.product_gallery_8,
        }

        let newProductId = await productDataLayer.createProduct(productData)

        const consignment = new Consignment();
        consignment.set('user_id', userId);
        consignment.set('product_id', newProductId);
        consignment.set('status', "New");
        consignment.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
        consignment.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await consignment.save();
        const consignmentId = consignment.get("id");
        return consignmentId;
    } catch(err) {
        throw err;
    }
}

// Update consignment
async function updateConsignment(consignmentId, consignmentData) {
    try {
        const consignment = await getConsignmentById(consignmentId);

        if (consignment) {
            consignment.set('status', consignmentData.status);
            consignment.set('comment', consignmentData.comment);
            consignment.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
            await consignment.save();
        } else {
            return false;
        }
    } catch(err) {
        throw err;
    }
}

module.exports = {
    createConsignment,
    getAllConsignments,
    getConsignmentById,
    getConsignmentsByUser,
    getStatusList,
    updateConsignment
}