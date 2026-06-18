# 🚀 Full-Stack Job Application Tracker

A fast, lightweight full-stack web application built to track job applications, monitor interview statuses, and manage the job hunt process. 

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, pure CSS
* **Backend:** Node.js, Express.js REST API
* **Database:** SQLite (via `better-sqlite3`)

## ✨ Features
* **Dashboard View:** See all tracked applications at a glance.
* **Add Applications:** Quickly log new jobs with company name, role, and date.
* **Interactive Statuses:** Update a job's status (Applied, Interview, Rejected, Offer) inline without reloading the page.
* **Filtering:** Filter the view to only show active interviews or successful offers.

## 🧠 Architecture & Trade-offs
**Database Selection:** I chose SQLite over PostgreSQL for this specific build to prioritize rapid local setup, immediate prototyping, and zero-configuration portability. However, the backend data layer is deliberately structured using parameterized SQL queries. This means swapping to a robust PostgreSQL instance in the future would essentially only require a configuration change and adding the `pg` driver, while the core API logic remains untouched.

## 🚦 How to Run Locally

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR-USERNAME/job-tracker.git](https://github.com/YOUR-USERNAME/job-tracker.git)
cd job-tracker
