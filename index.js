const express = require("express");

// read from .env file
require('dotenv').config();

// create an instance of express app
let app = express();

// import the routes
const landingRoutes = require('./routes/landing');

async function main() {
    app.use('/', landingRoutes);
}

main();

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server has started");
});