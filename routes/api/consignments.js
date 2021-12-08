const express = require("express");
const router = express.Router();

const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT,
    checkIsCustomerJWT,
    parseJWT
} = require('../../middlewares/authentication');

const consignmentDataLayer = require("../../dal/consignments");

router.get('/', [ checkIfAuthenticatedJWT ], async(req, res) => {
    let consignments;
    try {
        if (req.user.role === "Admin") {
            // Admins can retrieve all consignments
            consignments = await consignmentDataLayer.getAllConsignments();
        } else {
            // Customers can only retrieve their orders
            consignments = await consignmentDataLayer.getConsignmentsByUser(req.user.id)
        }
        res.status(200).send({
            "success": true,
            "data": consignments
        })
    } catch(_err) {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve orders due to unexpected error.`
        })
    }
})

// Retrieve list of valid consignments statuses
router.get('/statuses', async (req, res) => {
    res.status(200).send({
        "success": true,
        "data": await consignmentDataLayer.getStatusList()
    })
})

// Retrieve a consignment
router.get('/:consignment_id', [ checkIfAuthenticatedJWT ], async (req, res) => {
    const consignmentId = req.params.consignment_id;
    try {
        const consignment = await consignmentDataLayer.getConsignmentById(consignmentId);
        res.status(200).send({
            "success": true,
            "data": consignment
        })
    } catch(_err) {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve orders due to unexpected error.`
        })
    }
})

router.post('/create', [ checkIfAuthenticatedJWT, checkIsCustomerJWT ], async(req, res) => {
    const userId = req.user.id;
    const consignmentData = {
        designer_id: req.body.designer_id,
        category_id: req.body.category_id,
        name: req.body.name, 
        condition: req.body.condition,
        condition_description: req.body.condition_description,
        selling_price: req.body.selling_price,
        specifications: req.body.specifications,
        product_gallery_1: req.body.product_gallery_1,
        product_gallery_2: req.body.product_gallery_2,
        product_gallery_3: req.body.product_gallery_3,
        product_gallery_4: req.body.product_gallery_4,
        product_gallery_5: req.body.product_gallery_5,
        product_gallery_6: req.body.product_gallery_6,
        product_gallery_7: req.body.product_gallery_7,
        product_gallery_8: req.body.product_gallery_8,
    }

    try {
        const newConsignmentId = await consignmentDataLayer.createConsignment(userId, consignmentData);
        res.status(201).send({
            "success": true,
            "message": "New consignment created successfully",
            "consignment_id": newConsignmentId
        });
    } catch(_err) {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to create new consignment due to unexpected error.`
        });
    }
})

router.put('/:consignment_id/update', [ checkIfAuthenticatedJWT, checkIsAdminJWT ], async(req, res) => {
    const consignmentId = req.params.consignment_id
    const consignmentData = {
        status: req.body.status,
        comment: req.body.comment,
    }

    try {
        await consignmentDataLayer.updateConsignment(consignmentId, consignmentData);
        res.status(200).send({
            "success": true,
            "message": `Consignment ID ${consignmentId} successfully`
        });
    } catch(_err) {
        res.status(500).send({
            "success": false,
            "message": `Unable to update consignment id ${consignmentId} due to unexpected error.`
        });
    }
})

module.exports = router;