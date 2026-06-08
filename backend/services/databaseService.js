const pool = require('../config/db');

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

    const [rows] = await connection.query(
      'SELECT COUNT(*) as count FROM students'
    );

    if (rows[0].count === 0) {
      await seedDatabase(connection);
    }

    connection.release();

  } catch (err) {

    console.error('❌ Database error:', err.message);

    process.exit(1);
  }
}

module.exports = initializeDatabase;const pool = require('../config/db');

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

    const [rows] = await connection.query(
      'SELECT COUNT(*) as count FROM students'
    );

    if (rows[0].count === 0) {
      await seedDatabase(connection);
    }

    connection.release();

  } catch (err) {

    console.error('❌ Database error:', err.message);

    process.exit(1);
  }
}

module.exports = initializeDatabase;