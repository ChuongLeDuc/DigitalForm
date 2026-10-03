require("dotenv").config();
const { Pool } = require("pg");

// Lấy connection string từ biến môi trường
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // Bật SSL nếu kết nối tới Neon hoặc DB trên Cloud, tự động tắt nếu chạy localhost
  ssl: connectionString && !connectionString.includes("localhost")
    ? { rejectUnauthorized: false }
    : false,
});

pool.on("connect", () => {
  console.log("PostgreSQL Pool: Kết nối thành công!");
});

pool.on("error", (err) => {
  console.error("Lỗi PostgreSQL Pool:", err.message);
});

module.exports = pool;