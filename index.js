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
  carts: require("./routes/api/carts"),
  categories: require("./routes/api/categories"),
  designers: require("./routes/api/designers"),
  insurances: require("./routes/api/insurances"),
  products: require("./routes/api/products"),
  tags: require("./routes/api/tags"),
  users: require("./routes/api/users")
}

async function main() {
  app.use("/", landingRoutes);

  // API routes
  // * express.json() -- to parse req.body as JSON, so all content inside req.body 
  //                     will be converted to JSON before reaching any route functions
  app.use("/carts", express.json(), api.carts);
  app.use("/categories", express.json(), api.categories);
  app.use("/designers", express.json(), api.designers);
  app.use("/insurances", express.json(), api.insurances);
  app.use("/products", express.json(), api.products);
  app.use("/tags", express.json(), api.tags);
  app.use("/users", express.json(), api.users);
}

main();

const port = process.env.APP_PORT || 4000
app.listen(port, () => {
  console.log("Server has started");
});