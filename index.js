const express = require("express");
const cors = require('cors');

// read from .env file
require("dotenv").config();

// create an instance of express app
let app = express();

// use cors
app.use(cors());

// require the custom routes
const landingRoutes = require("./routes/landing");
const api = {
  products: require("./routes/api/products"),
  users: require("./routes/api/users")
}

async function main() {
  app.use("/", landingRoutes);

  // API routes
  // * express.json() -- to parse req.body as JSON, so all content inside req.body will be converted to JSON before reaching any route functions
  app.use("/products", express.json(), api.products);
  app.use("/users", express.json(), api.users);
}

main();

const port = process.env.APP_PORT || 4000
app.listen(port, () => {
  console.log("Server has started");
});