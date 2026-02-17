const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Absolute Path Verification
// Using __dirname ensures the server finds the file regardless of where you start the terminal
const usersPath = path.join(__dirname, 'users.json');
const patientsPath = path.join(__dirname, 'patients.json');

// 2. Robust Data Helper
const getData = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`Creating new file at: ${filePath}`);
            fs.writeFileSync(filePath, JSON.stringify([]));
            return [];
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content || "[]");
    } catch (err) { 
        console.error(`Error reading ${filePath}:`, err);
        return []; 
    }
};

// --- USER ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const users = getData(usersPath);
        if (users.find(u => u.email === email)) return res.status(400).json({ error: "User exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const prefix = role === 'doctor' ? 'D' : role === 'nurse' ? 'N' : 'A';
        const newUser = { id: `${prefix}${String(users.length + 1).padStart(3, '0')}`, name, email, password: hashedPassword, role };
        
        users.push(newUser);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ error: "Server Error" }); }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;
    const users = getData(usersPath);
    const user = users.find(u => u.email === email && u.role === role);
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ success: true, user: { name: user.name, role: user.role, email: user.email } });
});

// --- PATIENT ROUTES ---

// GET: Returns all stored patients
app.get('/api/patients', (req, res) => {
    console.log("Fetching patients from storage...");
    res.json(getData(patientsPath));
});

// POST: Stores a new patient permanently
app.post('/api/patients/add', (req, res) => {
    console.log("Received new patient data:", req.body); // Terminal Debugging
    try {
        const patients = getData(patientsPath);
        
        const newPatient = {
            ...req.body,
            // Generate professional medical IDs
            id: `P-${Date.now()}`, 
            uniqueCode: `MR-${new Date().getFullYear()}-${String(patients.length + 1).padStart(3, '0')}`,
            admittedDate: new Date().toISOString().split('T')[0]
        };

        patients.push(newPatient);
        
        // 3. The Physical Write to Disk
        fs.writeFileSync(patientsPath, JSON.stringify(patients, null, 2));
        
        console.log("Successfully saved to patients.json");
        res.status(201).json({ success: true, patient: newPatient });
    } catch (err) {
        console.error("Critical Write Error:", err);
        res.status(500).json({ error: "Failed to save to patients.json" });
    }
});

app.listen(5000, () => {
    console.log("-----------------------------------------");
    console.log("MEDADMIN BACKEND RUNNING ON PORT 5000");
    console.log("-----------------------------------------");
});