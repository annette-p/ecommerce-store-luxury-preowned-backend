## Local Development Environment Setup

### Pre-requisites

* Create a `.env` file in the same directory as `index.js` with the below-contents.

```
PORT=4000
DB_DRIVER=mysql
DB_NAME=<preferred_new_database_name>
DB_USERNAME=<preferred_new_db_username>
DB_PASSWORD=<preferred_db_password>
```

* Run the command to create the new MySQL database and user account

```
./db-setup.sh
```
