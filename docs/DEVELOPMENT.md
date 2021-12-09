## Local Development Environment Setup

### Pre-requisites

* Sign-up for a free [Stripe](https://stripe.com/) account.
  * setup 'Account Name' under [Account settings](https://dashboard.stripe.com/settings/account)
  * obtain your [API keys](https://stripe.com/docs/development/quickstart##api-keys)
  * setup [Stripe webhook](https://stripe.com/docs/webhooks) for `checkout.session.completed` event only.
* Setup a database. It can be MySQL or Postgresql.
* Create a `.env` file in the same directory as `index.js` with the below-contents.

```
PORT=4000

# Database - can be MYSQL or Postgresql
DB_DRIVER=mysql
DB_NAME=<preferred_new_database_name>
DB_USERNAME=<preferred_new_db_username>
DB_PASSWORD=<preferred_db_password>

# Stripe
STRIPE_PUBLISHABLE_KEY=******
STRIPE_SECRET_KEY=******
STRIPE_ENDPOINT_SECRET=******

# JWT
# - from https://randomkeygen.com/, use the 504-bit WPA Key as the value.
TOKEN_SECRET=xxx
REFRESH_TOKEN_SECRET=xxx
```

* Run the command to create the new MySQL database and user account

```
./db-setup.sh
```

* Install the required packages

```
npm install
npm install -g nodemon
```

### Start Application

* Execute the following command to start the application

```
nodemon
```
