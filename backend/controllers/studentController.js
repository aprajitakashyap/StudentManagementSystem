const pool = require('../config/db');

// GET all students
exports.getStudents = async (req, res) => {
  try {

    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT * FROM students ORDER BY id DESC'
    );

    connection.release();

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// GET student by ID
exports.getStudentById = async (req, res) => {
  try {

    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Not found'
      });
    }

    res.json(rows[0]);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// POST create student
exports.createStudent = async (req, res) => {
  try {

    const { name, email, phone, major, gpa } = req.body;

    if (!name || !email || !phone || !major || gpa === undefined) {
      return res.status(400).json({
        error: 'All fields required'
      });
    }

    if (typeof gpa !== 'number' || gpa < 0 || gpa > 4) {
      return res.status(400).json({
        error: 'Invalid GPA'
      });
    }

    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO students (name, email, phone, major, gpa) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, major, gpa]
    );

    connection.release();

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone,
      major,
      gpa
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// PUT update student
exports.updateStudent = async (req, res) => {
  try {

    const { name, email, phone, major, gpa } = req.body;

    if (!name || !email || !phone || !major || gpa === undefined) {
      return res.status(400).json({
        error: 'All fields required'
      });
    }

    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'UPDATE students SET name = ?, email = ?, phone = ?, major = ?, gpa = ? WHERE id = ?',
      [name, email, phone, major, gpa, req.params.id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Not found'
      });
    }

    res.json({
      id: parseInt(req.params.id),
      name,
      email,
      phone,
      major,
      gpa
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  try {

    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'DELETE FROM students WHERE id = ?',
      [req.params.id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Not found'
      });
    }

    res.json({
      message: 'Deleted successfully'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// Health check
exports.healthCheck = (req, res) => {

  res.json({
    status: 'OK'
  });

};