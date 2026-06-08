const express = require('express');

const router = express.Router();

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  healthCheck
} = require('../controllers/studentController');

router.get('/students', getStudents);

router.get('/students/:id', getStudentById);

router.post('/students', createStudent);

router.put('/students/:id', updateStudent);

router.delete('/students/:id', deleteStudent);

router.get('/health', healthCheck);

module.exports = router;