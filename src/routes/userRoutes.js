import express from "express";
import db from "../db.js"; // Import kết nối MySQL

const router = express.Router();

// Lấy danh sách người dùng từ MySQL
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi truy vấn dữ liệu:", err);
    res.status(500).json({ error: "Lỗi truy vấn dữ liệu", details: err.message });
  }
});

// Thêm người dùng mới vào MySQL
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Thiếu thông tin name hoặc email" });
  }

  try {
    const [result] = await db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    res.json({ id: result.insertId, name, email });
  } catch (err) {
    console.error("❌ Lỗi khi thêm người dùng:", err);
    res.status(500).json({ error: "Lỗi khi thêm người dùng", details: err.message });
  }
});

// Xóa người dùng theo ID
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "Thiếu ID người dùng" });
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }
    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa người dùng:", err);
    res.status(500).json({ error: "Lỗi khi xóa người dùng", details: err.message });
  }
});

export default router;
