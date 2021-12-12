## Deployment to Heroku

### Pre-requisites

* Sign-up for a free [Heroku](https://heroku.com/) account.
  * Install Heroku CLI ([instructions](https://devcenter.heroku.com/articles/heroku-cli#download-and-install))
* Sign-up for a free [Stripe](https://stripe.com/) account.

### Create an Heroku Application

* Log in to Heroku

From the terminal, run the following command to login to Heroku.

```
heroku login -i
```

* Create Heroku Application

Once you have logged in, create a new Heroku app with the following commands at the terminal:

```
heroku create <app-name>
```

Replace `<app-name>` with a name of your choice. Do not use underscore. As the app name has to be unique, make sure the name you use is distinctive. You can use your initials as part of the app name, for instance.

### Setup Database

We need to use an external database, hosted on an external server. Heroku itself offers some database hosting services. We will use Postgres for this application.

In the terminal, type in:

```
heroku addons:create heroku-postgresql
```

Follow the steps below to obtain details of the newly created database:

* Open a web browser and go to [Heroku Dashboard](https://dashboard.heroku.com/apps)
* Click on the name of your app.
* Under <b>Settings | Config Vars</b>, click <b>Reveal Config Vars</b>.
* You should be able to see a `DATABASE_URL` setting. Copy the value to a text file for reference later.

The format of the `DATABASE_URL` is: `postgres://<db-username>:<db-password>@<db-hostname>:5432/<db-name>`.

* Ensure the following are in your local `.env` files:

```
DB_DRIVER=postgres
DB_NAME=<preferred_new_database_name>
DB_USERNAME=<preferred_new_db_username>
DB_PASSWORD=<preferred_db_password>
DB_HOST=<database_hostname>
```

* Install the required packages locally by running the below command:

```
npm install
```

* Create the `database.json` file by running the following command:

```
./db-setup.sh
```

* Create the required database tables and initial set of default data by running the following command:

```
./db-migrate.sh up
```

### Setup Environment Variables on Heroku

* Open a web browser and go to [Heroku Dashboard](https://dashboard.heroku.com/apps)
* Click on the name of your app.
* Under <b>Settings | Config Vars</b>, click <b>Reveal Config Vars</b>.
* Enter the list of environments variables required to be in `.env` file for local development - refer to [DEVELOPMENT.md](DEVELOPMENT.md).

### Deploy Application to Heroku

From the terminal, run the following command:

```
git push heroku main
```