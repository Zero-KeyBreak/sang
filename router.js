import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';

const router = express.Router();

// Đăng ký tài khoản
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi hệ thống' });
    res.status(201).json({ message: 'Đăng ký thành công' });
  });
});

// Đăng nhập
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi hệ thống' });
    if (results.length === 0) return res.status(401).json({ error: 'Tên đăng nhập không đúng' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: 'Mật khẩu không đúng' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Đăng nhập thành công', token });
  });
});


router.get('/test', (req, res) => {
  res.json({ message: 'Xin chào ân' });
});

router.post('/categories', async (req, res) => {
  try {
    const { name_categories } = req.body;

    if (!name_categories) {
      return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
    }

    // Gọi `await db.query()` và nhận kết quả đúng
    const [result] = await db.query('INSERT INTO categories (name_categories) VALUES (?)', [name_categories]);

    res.status(201).json({ message: "Thêm thành công", categoryId: result.insertId });
  } catch (error) {
    console.error("Lỗi khi thêm categories:", error);
    res.status(500).json({ error: "Lỗi hệ thống", details: error.message });
  }
});


export default router;