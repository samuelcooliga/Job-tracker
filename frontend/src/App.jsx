import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---  State for our filter ---
  const [filter, setFilter] = useState('All');

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    date_applied: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add job');
      const newJobResponse = await response.json();

      const newJob = { id: newJobResponse.id, ...formData };
      setJobs([newJob, ...jobs]);

      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        date_applied: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // ---  Function to handle inline status updates ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update the React state instantly so the UI reflects the change
      setJobs(jobs.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  // ---  Filter the jobs array before rendering ---
  const filteredJobs = filter === 'All'
    ? jobs
    : jobs.filter(job => job.status === filter);

  return (
    <div className="container">
      <h1>My Job Tracker</h1>

      {/* Form Card */}
      <div className="card form-container">
        <h2>Add New Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input type="text" name="company" placeholder="Company Name" required value={formData.company} onChange={handleChange} />
            <input type="text" name="role" placeholder="Job Role" required value={formData.role} onChange={handleChange} />
            <input type="date" name="date_applied" required value={formData.date_applied} onChange={handleChange} />
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Add Job</button>
        </form>
      </div>

      { }
      {loading && <p>Loading jobs...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="card table-container">
          {/* --- NEW: Filter Header --- */}
          <div className="table-header">
            <h2>Applications</h2>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>

          {filteredJobs.length === 0 ? (
            <p style={{ padding: '1.5rem' }}>No jobs found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.company}</td>
                    <td>{job.role}</td>
                    <td>
                      { }
                      <select
                        className={`status-select ${job.status.toLowerCase()}`}
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offer">Offer</option>
                      </select>
                    </td>
                    <td>{job.date_applied}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;