const express = require("express");
const router = express.Router();

router.get('/', (_req, res) => {
    res.send("Welcome")
})

module.exports = router;