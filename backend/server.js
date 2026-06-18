const express = require('express');
const cors = require('cors');
const db = require('./database'); // Imports the database connection you just built!

const app = express();
const PORT = process.env.PORT || 5001;

// --- MIDDLEWARE ---
// CORS allows your React app (which will run on a different port, like 3000) to make requests here.
app.use(cors());
// This allows Express to understand incoming JSON data from POST requests.
app.use(express.json());

// --- REST API ROUTES ---

// 1. GET Route: Fetch all job applications
app.get('/api/jobs', (req, res) => {
    try {
        // .prepare() compiles the SQL query, .all() executes it and returns an array of all rows.
        const jobs = db.prepare('SELECT * FROM jobs ORDER BY date_applied DESC').all();
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// 2. POST Route: Add a new job application
app.post('/api/jobs', (req, res) => {
    // Extract the data sent from the frontend
    const { company, role, status, date_applied, notes } = req.body;

    try {

        const stmt = db.prepare(`
            INSERT INTO jobs (company, role, status, date_applied, notes)
            VALUES (?, ?, ?, ?, ?)
        `);

        // Execute the statement, passing in the variables in the exact order of the '?' marks
        const info = stmt.run(
            company,
            role,
            status || 'Applied', // Default to 'Applied' if no status is provided
            date_applied,
            notes || ''
        );


        res.status(201).json({ id: info.lastInsertRowid, message: "Job added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add job" });
    }
});

app.patch('/api/jobs/:id', (req, res) => {

    const { id } = req.params;

    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Please provide a new status." });
    }

    try {
        const stmt = db.prepare('UPDATE jobs SET status = ? WHERE id = ?');
        const info = stmt.run(status, id);


        if (info.changes === 0) {
            return res.status(404).json({ error: "Job not found." });
        }

        res.json({ message: "Job status updated to: " + status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update job." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});