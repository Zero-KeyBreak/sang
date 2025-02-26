import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Tạo pool kết nối với MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "", // Mặc định để trống nếu không có mật khẩu
  database: process.env.DB_NAME || "datmonan",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Số kết nối tối đa
  queueLimit: 0,
});

// Kiểm tra kết nối
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Kết nối MySQL thành công!");
    connection.release(); // Giải phóng kết nối
  } catch (err) {
    console.error("❌ Kết nối MySQL thất bại:", err.message);
  }
}

testConnection();

export default db;
