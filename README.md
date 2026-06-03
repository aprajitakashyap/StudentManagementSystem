# Student Management System

A complete CRUD application for managing student information with Node.js/Express backend and MySQL database.

## 🎯 Features

✅ **Create** - Add new students with full details  
✅ **Read** - View all students in a responsive table  
✅ **Update** - Edit student information  
✅ **Delete** - Remove students from the system  
✅ **Database** - MySQL with automatic backup  
✅ **Admin Panel** - View database statistics  
✅ **Error Handling** - Comprehensive error messages  

## 📋 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Package Manager:** npm

## 🚀 Quick Start

### Prerequisites

1. **Install Node.js** (if not already installed)
   ```bash
   brew install node
   ```

2. **Install MySQL** (if not already installed)
   ```bash
   brew install mysql
   brew services start mysql
   ```

### Setup Instructions

#### Step 1: Create MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database (paste and run these commands):
CREATE DATABASE IF NOT EXISTS student_management;
CREATE USER IF NOT EXISTS 'student_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON student_management.* TO 'student_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 2: Configure Environment Variables

Edit `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123123123
DB_NAME=student_management
```

#### Step 3: Install Dependencies

```bash
cd backend
npm install
```

#### Step 4: Start the Server

```bash
npm start
```

You should see:
```
🚀 Server running at http://localhost:8080
📚 Available routes:
  🌐 Frontend: http://localhost:8080
  🔧 Admin:    http://localhost:8080/admin
```

#### Step 5: Open in Browser

- **Student Management:** http://localhost:8080
- **Admin Panel:** http://localhost:8080/admin

## 📱 Usage

### Adding a Student

1. Fill in the form with student details
2. Click "Add Student"
3. Student appears in the table below

### Editing a Student

1. Click the "Edit" button on a student row
2. Form populates with current data
3. Modify the details
4. Click "Update Student"

### Deleting a Student

1. Click the "Delete" button on a student row
2. Confirm the deletion
3. Student is removed from the system

## 🔧 API Endpoints

### Get All Students
```
GET /api/students
Response: [{ id, name, email, phone, major, gpa }, ...]
```

### Get Student by ID
```
GET /api/students/:id
Response: { id, name, email, phone, major, gpa }
```

### Create Student
```
POST /api/students
Body: { name, email, phone, major, gpa }
Response: { id, name, email, phone, major, gpa }
```

### Update Student
```
PUT /api/students/:id
Body: { name, email, phone, major, gpa }
Response: { id, name, email, phone, major, gpa }
```

### Delete Student
```
DELETE /api/students/:id
Response: { message: "Student deleted successfully" }
```

### Health Check
```
GET /api/health
Response: { status: "OK", message: "Server is running" }
```

## 🗄️ Database

### Table Structure

```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  major VARCHAR(255) NOT NULL,
  gpa DECIMAL(3, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### View Data in MySQL

```bash
mysql -u root -p
USE student_management;
SELECT * FROM students;
```

## 🔍 Troubleshooting

### Port 8080 is Already in Use

```bash
# Kill the process using port 8080
lsof -ti:8080 | xargs kill -9
```

### MySQL Connection Error

1. Verify MySQL is running:
   ```bash
   brew services list
   # Should show mysql: started
   ```

2. Check credentials in `.env` file

3. Ensure database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### No Data Showing in Frontend

1. Check browser console (F12) for errors
2. Verify server is running: http://localhost:8080/api/health
3. Check MySQL has data: `SELECT * FROM students;`

## 📂 Project Structure

```
StudentManagementSystem/
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   ├── .env.example        # Example env file
│   └── node_modules/       # Dependencies
├── frontend/
│   ├── index.html          # Main page
│   ├── admin.html          # Admin panel
│   ├── main.js             # Frontend logic
│   └── styles.css          # Styling
└── README.md               # This file
```

## 💡 Sample Data

The system comes pre-loaded with 3 sample students:

1. **John Doe** - Computer Science, GPA 3.8
2. **Jane Smith** - Mathematics, GPA 3.9
3. **Bob Johnson** - Physics, GPA 3.6

## 🎓 GPA Requirements

- Valid range: 0.0 to 4.0
- Decimal format: X.XX (e.g., 3.85)

## 📝 Notes

- All fields are required when creating/updating students
- Email validation is performed by the browser
- GPA values are stored with 2 decimal places
- Students are displayed in reverse order (newest first)

## 🛠️ Development

To make changes:

1. **Backend changes:** Edit `backend/server.js` and restart the server
2. **Frontend changes:** Edit `frontend/main.js` or other files, refresh the browser (no restart needed)
3. **Styling changes:** Edit `frontend/styles.css`

## 📞 Support

If you encounter any issues:

1. Check the browser console (F12) for errors
2. Check the server console for logs
3. Verify MySQL is running: `brew services list`
4. Check `.env` file configuration

---

**Created:** June 2026  
**Version:** 1.0.0
