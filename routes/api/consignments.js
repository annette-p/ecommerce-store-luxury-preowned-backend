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
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve orders due to unexpected error.`
        })
    }
})

// router.post('/create', [ checkIfAuthenticatedJWT ], async(req, res) => {})

module.exports = router;