import express from "express";
import cors from "cors";
import db from "./db.js"; // Import kết nối MySQL

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* 📌 API lấy danh sách người dùng từ MySQL */
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu từ MySQL:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* 📌 API thêm người dùng mới vào MySQL */
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    console.error("Lỗi khi thêm user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* 📌 API xóa người dùng theo ID */
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Xóa user thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* 📌 API cập nhật thông tin người dùng */
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);
    res.json({ id, name, email });
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* 📌 Xử lý lỗi 404 */
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy tài nguyên" });
});

/* 📌 Khởi động server */
app.listen(port, () => {
  console.log(`✅ Server chạy tại http://localhost:${port}`);
});
