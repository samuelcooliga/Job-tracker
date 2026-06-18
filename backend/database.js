const Database = require("better-sqlite3");

const db = new Database("jobs.db");


db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Applied',
    date_applied TEXT NOT NULL,
    notes TEXT
  )
`);

module.exports = db;