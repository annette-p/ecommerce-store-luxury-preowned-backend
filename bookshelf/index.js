// read from .env file
require('dotenv').config();

// Setting up the database connection
// knex.js --> A batteries-included, multi-dialect (PostgreSQL, MySQL, etc) query builder for Node.js
// bookshelf.js --> Bookshelf is a JavaScript ORM for Node.js, built on the Knex SQL query builder. It is designed to work with PostgreSQL, MySQL, and SQLite3.
// 
// NOTE: the database name, username and password need to match the information in "database.json".
const knex = require('knex')({
    client: process.env.DB_DRIVER,
    connection: {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
})

const bookshelf = require('bookshelf')(knex)

// Use 'bookshelf-eloquent' plugin for Bookshelf.js
// ref: https://www.npmjs.com/package/bookshelf-eloquent
bookshelf.plugin(require('bookshelf-eloquent'));

module.exports = bookshelf;