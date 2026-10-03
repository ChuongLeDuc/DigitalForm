const { Pool } = require("pg");
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "chuong_889",
    database: "postgres"
});

module.exports=pool