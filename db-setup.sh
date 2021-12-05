# setup required environment variables
. .env

# # ONLY when necessary to create the initial database and database account
# # https://electrictoolbox.com/run-single-mysql-query-command-line/
# mysql -u root -e "CREATE USER '${DB_USERNAME}'@'%' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"
# mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO '${DB_USERNAME}'@'%';"
# mysql -u root -e "FLUSH PRIVILEGES;"
# mysql -u root -e "CREATE DATABASE ${DB_NAME}"

# # ONLY when necessary to perform cleanup by dropping the entire DB
# mysql -u root -e "DROP DATABASE ${DB_NAME};"
# mysql -u root -e "DROP USER ${DB_USERNAME};"

if [ "${DB_DRIVER}" = "mysql" ]
then
    cat << EOF > database.json
{
    "dev": {
        "driver": "${DB_DRIVER}",
        "user": "${DB_USERNAME}",
        "password": "${DB_PASSWORD}",
        "database": "${DB_NAME}"
    }
}
EOF
elif [ "${DB_DRIVER}" = "postgres" ]
then
    cat << EOF > database.json
{
    "dev": {
        "driver": "${DB_DRIVER}",
        "user": "${DB_USERNAME}",
        "password": "${DB_PASSWORD}",
        "database": "${DB_NAME}",
        "host": "${DB_HOST}",
        "ssl": {
            "rejectUnauthorized": false
        }
    }
}
EOF
fi

