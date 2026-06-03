require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 8089;

app.use(cors());
app.use(bodyParser.json());

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'student_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MySQL...');
    const connection = await pool.getConnection();
    console.log('✅ MySQL connection successful');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        major VARCHAR(255) NOT NULL,
        gpa DECIMAL(3, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Students table created/verified');
    
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM students');
    if (rows[0].count === 0) {
      await seedDatabase(connection);
    }
    
    connection.release();
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
}

async function seedDatabase(connection) {
  try {
    const samples = [
      ['John Doe', 'john@example.com', '555-0001', 'Computer Science', 3.8],
      ['Jane Smith', 'jane@example.com', '555-0002', 'Mathematics', 3.9],
      ['Bob Johnson', 'bob@example.com', '555-0003', 'Physics', 3.6]
    ];
    for (const student of samples) {
      await connection.query(
        'INSERT INTO students (name, email, phone, major, gpa) VALUES (?, ?, ?, ?, ?)',
        student
      );
    }
    console.log('✅ Sample data inserted');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  }
}

initializeDatabase();

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM students ORDER BY id DESC');
    connection.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    connection.release();
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create student
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, major, gpa } = req.body;
    if (!name || !email || !phone || !major || gpa === undefined) {
      return res.status(400).json({ error: 'All fields required' });
    }
    if (typeof gpa !== 'number' || gpa < 0 || gpa > 4) {
      return res.status(400).json({ error: 'Invalid GPA' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO students (name, email, phone, major, gpa) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, major, gpa]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, name, email, phone, major, gpa });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, email, phone, major, gpa } = req.body;
    if (!name || !email || !phone || !major || gpa === undefined) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE students SET name = ?, email = ?, phone = ?, major = ?, gpa = ? WHERE id = ?',
      [name, email, phone, major, gpa, req.params.id]
    );
    connection.release();
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ id: parseInt(req.params.id), name, email, phone, major, gpa });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    connection.release();
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);
  console.log('📍 Frontend: http://localhost:' + PORT);
  console.log('📍 Admin:    http://localhost:' + PORT + '/admin\n');
});

process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('\n✅ Database closed');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
});
