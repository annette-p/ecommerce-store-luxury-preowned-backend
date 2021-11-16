const express = require("express");
// create a new router object, Router() will return a new router object
const router = express.Router(); 

// A router object can contain routes - Add a new route to the Express router
router.get('/', (req,res)=>{
    res.render("home/index")
})

module.exports = router; 