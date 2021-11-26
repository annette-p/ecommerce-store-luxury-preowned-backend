const express = require("express");
const router = express.Router();

const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')

// import the Tag model
const {
    Tag
} = require('../../models');

router.get('/', async (req, res) => {
    // fetch all the tags (i.e., SELECT * FROM tags)

    await Tag.collection().fetch().then(tags => {
        res.status(200).send({
            "success": true,
            "data": tags.toJSON()
        });
    }).catch(err => {
        console.error("[Exception -> Tags GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve tags due to unexpected error.`
        })
        return;
    });
})

router.get('/:tag_id', async (req, res) => {
    // fetch a tag by primary key "id"
    const tagId = req.params.tag_id
    await Tag.where({
        'id': tagId
    }).fetch({
        require: true
    }).then(tag => {
        res.status(200).send({
            "success": true,
            "data": tags.toJSON()
        }); // convert collection to JSON
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve tag due to unexpected error.`
        })
        return;
    });
})

router.put('/:tag_id/update', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const tag = await Tag.where({
        'id': req.params.tag_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Tag ID ${req.params.tag_id}. Tag update failed. `
        })
        return;
    });

    if (tag !== undefined) {

        tag.set('name', req.body.name);

        await tag.save().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Tag ID ${req.params.tag_id} updated successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to update Tag ID ${req.params.tag_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:tag_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const tag = await Tag.where({
        'id': req.params.tag_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Tag ID ${req.params.tag_id}. Tag deletion failed. `
        })
        return;
    });

    if (tag !== undefined) {
        await tag.destroy().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Tag ID ${req.params.tag_id} deleted successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to delete Tag ID ${req.params.tag_id} due to unexpected error.`
            })
        });
    }

})

router.post('/create', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const tag = new Tag();
    tag.set('name', req.body.name);
    await tag.save().then(() => {
        res.status(201).send({
            "success": true,
            "message": "New tag created successfully",
            "tag_id": tag.get("id")
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new tag due to unexpected error.`
        })
    });;
})

module.exports = router;