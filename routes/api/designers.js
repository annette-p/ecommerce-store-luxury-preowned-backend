const express = require("express");
const router = express.Router();

// import the Designer model
const {
    Designer
} = require('../../models');

router.get('/', async (req, res) => {
    // fetch all the designers (i.e., SELECT * FROM designers)

    await Designer.collection().fetch().then(designers => {
        res.status(200).send(designers.toJSON());
    }).catch(err => {
        console.error("[Exception -> Designers GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve designers due to unexpected error.`
        })
        return;
    });
})

router.post('/create', async (req, res) => {
    const designer = new Designer();
    designer.set('name', req.body.name);
    await designer.save().then(() => {
        res.status(201).send({
            "success": true,
            "message": "New designer created successfully",
            "user_id": designer.get("id")
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new designer due to unexpected error.`
        })
    });;
})

module.exports = router;