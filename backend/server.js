require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');

const pool = require('./config/db');

const initializeDatabase = require('./services/databaseService');

const studentRoutes = require('./routes/studentRoutes');

const app = express();

const PORT = 8089;

// Middleware
app.use(cors());

app.use(bodyParser.json());

// Frontend path
const frontendPath = path.join(__dirname, '../frontend');

// Static frontend
app.use(express.static(frontendPath));

// Frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

// API routes
app.use('/api', studentRoutes);

// Initialize database
initializeDatabase();

// Start server
app.listen(PORT, () => {

  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);

  console.log('📍 Frontend: http://localhost:' + PORT);

  console.log('📍 Admin:    http://localhost:' + PORT + '/admin\n');

});

// Close database connection gracefully
process.on('SIGINT', async () => {

  try {

    await pool.end();

    console.log('\n✅ Database closed');

  } catch (err) {

    console.error(err);

  }

  process.exit(0);

});