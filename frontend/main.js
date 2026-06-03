const API_URL = 'http://localhost:8089/api/students';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM loaded, initializing app...');
    
    const form = document.getElementById('studentForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetForm);
    
    // Allow Enter key in search box
    const searchId = document.getElementById('searchId');
    if (searchId) searchId.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchStudent();
    });
});

// Search for student by ID
async function searchStudent() {
    const id = document.getElementById('searchId').value.trim();
    if (!id) {
        showMessage('⚠️ Please enter a Student ID', 'error');
        return;
    }

    try {
        console.log('🔍 Searching for student ID:', id);
        const response = await fetch(`${API_URL}/${id}`);
        
        if (response.status === 404) {
            showMessage('❌ Student not found with ID: ' + id, 'error');
            return;
        }
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const student = await response.json();
        console.log('✅ Student found:', student);
        
        // Populate form with student data
        document.getElementById('studentId').value = student.id;
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('phone').value = student.phone;
        document.getElementById('major').value = student.major;
        document.getElementById('gpa').value = student.gpa;
        document.getElementById('submitBtn').textContent = 'Update Student';
        document.getElementById('deleteBtn').style.display = 'inline-block';
        
        showMessage('✅ Student found! You can now Edit or Delete.', 'success');
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error searching student:', error);
        showMessage('❌ Error: ' + error.message, 'error');
    }
}

// List all students in table
async function listAllStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to load students');
        const students = await response.json();
        
        if (students.length === 0) {
            showMessage('📋 No students found', 'error');
            return;
        }
        
        displayStudentsList(students);
        showMessage(`📋 ${students.length} students loaded!`, 'success');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Display students in table on page
function displayStudentsList(students) {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        const gpa = parseFloat(student.gpa).toFixed(2);
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.major}</td>
            <td>${gpa}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('listSection').style.display = 'block';
    document.getElementById('listSection').scrollIntoView({ behavior: 'smooth' });
}

// Hide student list
function hideStudentList() {
    document.getElementById('listSection').style.display = 'none';
}

// Refresh student list table
async function refreshStudentListTable() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to refresh students');
        const students = await response.json();
        displayStudentsList(students);
        console.log('✅ Student list refreshed');
    } catch (error) {
        console.error('Error refreshing list:', error);
    }
}

// Load all students
async function loadStudents() {
    try {
        console.log('📡 Fetching from:', API_URL);
        const response = await fetch(API_URL);
        
        console.log('✅ Response received:', response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
        const students = await response.json();
        console.log('✅ Students loaded:', students.length, 'records');
        displayStudents(students);
        if (students.length > 0) {
            showMessage('✅ ' + students.length + ' students loaded!', 'success');
        }
    } catch (error) {
        console.error('❌ Error loading students:', error);
        showMessage('❌ Error: ' + error.message, 'error');
    }
}

// Display students in table
function displayStudents(students) {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No students found. Add a new student to get started!</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        const gpa = parseFloat(student.gpa).toFixed(2);
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.major}</td>
            <td>${gpa}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission (add or update)
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        major: document.getElementById('major').value,
        gpa: parseFloat(document.getElementById('gpa').value)
    };

    try {
        let response;
        if (id) {
            // Update existing student
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            const message = response.ok ? 'Student updated successfully!' : 'Failed to update student';
            showMessage(message, response.ok ? 'success' : 'error');
        } else {
            // Add new student
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            const message = response.ok ? 'Student added successfully!' : 'Failed to add student';
            showMessage(message, response.ok ? 'success' : 'error');
        }

        if (response.ok) {
            resetForm();
            showMessage('✅ Operation successful!', 'success');
            
            // Refresh the student list table if it's visible
            const listSection = document.getElementById('listSection');
            if (listSection && listSection.style.display !== 'none') {
                await refreshStudentListTable();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

// Edit student
async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to load student');

        const student = await response.json();
        
        document.getElementById('studentId').value = student.id;
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('phone').value = student.phone;
        document.getElementById('major').value = student.major;
        document.getElementById('gpa').value = student.gpa;

        document.getElementById('submitBtn').textContent = 'Update Student';
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading student:', error);
        showMessage('Error loading student: ' + error.message, 'error');
    }
}

// Delete student
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showMessage('Student deleted successfully!', 'success');
                resetForm();
            } else {
                showMessage('Failed to delete student', 'error');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

// Reset form
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Student';
    document.getElementById('deleteBtn').style.display = 'none';
    document.getElementById('searchId').value = '';
}

// Delete student from form
function deleteFromForm() {
    const id = document.getElementById('studentId').value;
    if (id) {
        deleteStudent(id);
    } else {
        showMessage('❌ No student selected', 'error');
    }
}

// Show message
function showMessage(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type + '-message';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);

        // Keep errors visible for 5 seconds, success for 3 seconds
        const timeout = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            messageDiv.remove();
        }, timeout);
    }
}
