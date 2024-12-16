const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Express 서버 설정
const app = express();
const port = 3000;

// CORS 설정 (프론트엔드와의 통신 허용)
app.use(cors());

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',   // MySQL 서버 주소
    user: 'root',        // MySQL 사용자명
    password: '1234',    // MySQL 비밀번호
    database: 'tempdb'   // 데이터베이스 이름
});

// API 요청 시 최근 20개의 데이터 반환
app.get('/api/recent', (req, res) => {
    const query = 'SELECT TIME, PV FROM tempdb.tb ORDER BY TIME DESC LIMIT 20';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }

        res.json(results);
    });
});

// API 요청 시 전체 데이터 반환
app.get('/api/all', (req, res) => {
    const query = 'SELECT TIME, PV FROM tempdb.tb ORDER BY TIME DESC';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }

        res.json(results);
    });
});

// API 요청 시 최근 1분간의 최대, 평균, 최소 값 반환
app.get('/api/stats', (req, res) => {
    const query = `
        SELECT
            MAX(PV) AS max,
            AVG(PV) AS avg,
            MIN(PV) AS min
        FROM tempdb.tb
        WHERE TIME >= NOW() - INTERVAL 1 MINUTE;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }

        // 결과를 JSON 형태로 반환
        res.json(results[0]);
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
