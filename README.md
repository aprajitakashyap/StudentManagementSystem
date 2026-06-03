# Student Management System

A simple CRUD-based Student Management System built using Node.js, Express.js, and MySQL.

## Features

* Add students
* View students
* Update student details
* Delete students
* MySQL database integration
* Responsive frontend

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express.js
* Database: MySQL

## Installation

### Clone the repository

```bash
git clone https://github.com/aprajitakashyap/StudentManagementSystem.git
cd StudentManagementSystem
```

### Install dependencies

```bash
cd backend
npm install
```

### Configure Database

Create a MySQL database named:

```sql
student_management
```

Update the `.env` file inside backend:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
PORT=8089
```

### Start the server

```bash
npm start
```

Open in browser:

```bash
http://localhost:8089
```

## API Endpoints

* GET `/api/students`
* POST `/api/students`
* PUT `/api/students/:id`
* DELETE `/api/students/:id`

