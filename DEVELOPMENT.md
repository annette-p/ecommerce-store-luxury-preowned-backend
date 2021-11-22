## Local Development Environment Setup

### Pre-requisites

* Create a `.env` file in the same directory as `index.js` with the below-contents.

```
APP_PORT=4000
DB_DRIVER=mysql
DB_NAME=<preferred_new_database_name>
DB_USERNAME=<preferred_new_db_username>
DB_PASSWORD=<preferred_db_password>
```

* Run the command to create the new MySQL database and user account

```
./db-setup.sh
```

* In the `.env` file, add in 2 new environmental variables named `TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`. From https://randomkeygen.com/, use the 504-bit WPA Key as the value. For example:

```
TOKEN_SECRET='|U7#ee<>dr3UuA%wZ]p;y9[5Ut>rb}Xa4Ob8FU/{43J0[,m3EIa1TqadeWQ"WXc'
REFRESH_TOKEN_SECRET='7,g3v%|m8Z2}][u~n@PY{k=Qe/%~-9|$54r6nrQBOrxjK;5a1ctns5dK>(_iA^o'
```
