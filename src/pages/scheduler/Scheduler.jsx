import { useEffect, useState } from "react";
import axios from "axios";

/* ===============================
   API BASE (TOP CONFIG)
================================ */
const API_BASE = "https://kproxy.tradepulsehq.co.uk/orchestrator/jobs";

/* ===============================
   COMPONENT
================================ */
const Scheduler = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  /* ===============================
     FETCH ALL JOBS
  ================================ */
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     CREATE JOB (SAMPLE)
  ================================ */
  const handleCreateJob = async () => {
    try {
      setCreating(true);

      const payload = {
        jobName: "new-job-demo",
        cronExpression: "0 0 3 * * ?",
        timezone: "UTC",
        executionType: "DOCKER",
        executionPath:
          "registry.gitlab.com/iniperor-group/sample:latest",
        parametersJson: JSON.stringify({ selector: "all" }),
        status: "ACTIVE",
        maxRetries: 2,
      };

      await axios.post(API_BASE, payload);

      fetchJobs();
    } catch (err) {
      console.error("Error creating job", err);
    } finally {
      setCreating(false);
    }
  };

  /* ===============================
     TRIGGER JOB
  ================================ */
  const handleTrigger = async (jobId) => {
    try {
      await axios.post(`${API_BASE}/${jobId}/trigger`);
      alert("Job triggered successfully");
    } catch (err) {
      console.error("Trigger failed", err);
    }
  };

  /* ===============================
     MANUAL SCHEDULE (UPDATE)
  ================================ */
  const handleManualSchedule = async (job) => {
    try {
      const updated = {
        ...job,
        cronExpression: "0 */10 * * * ?", // example: every 10 min
      };

      await axios.put(`${API_BASE}/${job.id}`, updated);

      fetchJobs();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  /* ===============================
     INIT LOAD
  ================================ */
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="tp-section">
      <div className="tp-flex tp-justify-between tp-align-center">
        <h2>Scheduler</h2>

        <button
          className="tp-btn-primary"
          onClick={handleCreateJob}
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Job"}
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="tp-table-wrapper" style={{ marginTop: "20px" }}>
        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <table className="tp-table">
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Cron</th>
                <th>Status</th>
                <th>Timezone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="5">No jobs found</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.jobName}</td>
                    <td>{job.cronExpression}</td>
                    <td>{job.status}</td>
                    <td>{job.timezone}</td>

                    <td>
                      <div className="tp-flex" style={{ gap: "10px" }}>
                        {/* TRIGGER */}
                        <button
                          className="tp-btn-secondary"
                          onClick={() => handleTrigger(job.id)}
                        >
                          Trigger
                        </button>

                        {/* MANUAL SCHEDULE */}
                        <button
                          className="tp-btn-outline"
                          onClick={() => handleManualSchedule(job)}
                        >
                          Manual Schedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Scheduler;