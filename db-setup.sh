# setup required environment variables
. .env

# https://electrictoolbox.com/run-single-mysql-query-command-line/
mysql -u root -e "CREATE USER '${DB_USERNAME}'@'%' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO '${DB_USERNAME}'@'%';"
mysql -u root -e "FLUSH PRIVILEGES;"
mysql -u root -e "CREATE DATABASE ${DB_NAME}"

cat << EOF > database.json
{
    "dev": {
        "driver": "mysql",
        "user": "${DB_USERNAME}",
        "password": "${DB_PASSWORD}",
        "database": "${DB_NAME}"
    }
}
EOF