const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware & View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));

// 1. UNIFIED PATHS
// All routes will now use these variables to avoid data mismatch
const usersPath = path.join(__dirname, 'users.json');
const patientsPath = path.join(__dirname, 'patients.json');

// 2. DATA HELPER
const getData = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
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

// --- USER AUTH ROUTES ---
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

// --- PATIENT ROUTES (API for React Frontend) ---

app.get('/api/patients', (req, res) => {
    res.json(getData(patientsPath));
});

app.post('/api/patients/add', (req, res) => {
    try {
        const patients = getData(patientsPath);
        const newPatient = {
            ...req.body,
            id: `P-${Date.now()}`, 
            uniqueCode: `MR-${new Date().getFullYear()}-${String(patients.length + 1).padStart(3, '0')}`,
            admittedDate: new Date().toISOString().split('T')[0]
        };
        patients.push(newPatient);
        fs.writeFileSync(patientsPath, JSON.stringify(patients, null, 2));
        res.status(201).json({ success: true, patient: newPatient });
    } catch (err) {
        res.status(500).json({ error: "Failed to save to patients.json" });
    }
});

app.put('/api/patients/update/:id', (req, res) => {
    try {
        let patients = getData(patientsPath);
        const index = patients.findIndex(p => p.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: "Patient not found" });

        patients[index] = { ...patients[index], ...req.body };
        fs.writeFileSync(patientsPath, JSON.stringify(patients, null, 2));
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

app.delete('/api/patients/delete/:id', (req, res) => {
    try {
        let patients = getData(patientsPath);
        const filtered = patients.filter(p => p.id !== req.params.id);
        fs.writeFileSync(patientsPath, JSON.stringify(filtered, null, 2));
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

// --- EJS VIEW ROUTES (For Browser Forms) ---

app.get('/patients', (req, res) => {
    const patients = getData(patientsPath);
    res.render('patients', { patients });
});

app.post('/delete-patient/:id', (req, res) => {
    try {
        let patients = getData(patientsPath); 
        const updatedPatients = patients.filter(p => p.id != req.params.id);
        fs.writeFileSync(patientsPath, JSON.stringify(updatedPatients, null, 2));
        res.redirect('/patients');
    } catch (err) { res.status(500).send("Error deleting patient."); }
});

app.listen(5000, () => {
    console.log("MEDADMIN BACKEND RUNNING ON PORT 5000");
});