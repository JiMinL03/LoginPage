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

    // 방법 1: 사용자가 이미 존재하는지 확인
    const userExistsQuery = await pool.query('SELECT EXISTS(SELECT 1 FROM user_information WHERE id = ?) as user_exists', [userid]);
    const userExists = userExistsQuery[0].user_exists === 1;
    if (userExists[0]==1) {
      // 이미 해당 이메일을 가진 사용자가 존재함, 적절히 처리
      res.status(400).json({ success: false, message: '해당 이메일로 이미 가입된 사용자가 있습니다.' });
    } else {
      // 사용자가 존재하지 않으면 삽입 진행
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO user_information (name, id, pw) VALUES (?, ?, ?)',
        [username, userid, userpw]
      );
      conn.release();
      res.status(200).json({ success: true, message: 'Hello! Friends :)' });
    }

    // 방법 2: 기존 사용자 업데이트 //이건 아이디 비번 바꿀 때 사용하면 될 듯
    // const result = await pool.query(
    //   'INSERT INTO user_information (name, id, pw) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), pw = VALUES(pw)',
    //   [username, userid, userpw]
    // );

  } catch (error) {
    console.error('데이터 삽입 중 오류 발생:', error);
    res.status(500).json({ success: false, message: 'The ID is duplicated.' });
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