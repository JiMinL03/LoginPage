const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mariadb = require('mariadb');

console.log('__dirname:', __dirname);

const loginPath = __dirname;
console.log('loginPath:', loginPath);

app.use(express.static(loginPath));
app.use(express.json()); // JSON 파싱을 위한 미들웨어 추가

app.get('*', (req, res) => {
  res.sendFile(path.join(loginPath, 'login.html'));
});

const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'root',
  port: '3306',
  password: 'JiMinL',
  database: 'user',
  connectionLimit: 20
});

app.post('/signup', async (req, res) => {
  try {
    const { username, userid, userpw } = req.body;
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO user_information (name, id, pw) VALUES (?, ?, ?)',
      [username, userid, userpw]
    );
    conn.release();
    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { userid, userpw } = req.body;
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO user_information (id, pw) VALUES (?, ?)',
      [userid, userpw]
    );
    conn.release();
    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});