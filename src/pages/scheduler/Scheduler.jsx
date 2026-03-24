import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TradePulseCard from "../../components/common/TradePulseCard";
import { useToast } from "../../components/common/toast/ToastProvider";

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

  const { addToast } = useToast();
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
        executionPath: "registry.gitlab.com/iniperor-group/sample:latest",
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
      addToast("Job triggered successfully","success");
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

  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const handleHeaderScroll = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  };

  const handleBodyScroll = () => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };
  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <div className="tp-overview-sub-row">
            <div>
              <h1 className="tp-section-title">
                Scheduler <span>Control Panel</span>
              </h1>

              <p className="tp-section-sub">
                Manage, trigger, and monitor scheduled orchestration jobs.
              </p>
            </div>

            <div className="tp-filter-btn-wrapper">
              <button
                className="tp-btn-primary"
                onClick={handleCreateJob}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Job"}
              </button>
            </div>
          </div>
        </header>

        {/* ================= TABLE ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <h3 className="tp-card-title">Job Directory</h3>
            </div>
          }
        >
          <div className="tp-table-wrapper tp-scheduler-table">
            {loading ? (
              <p className="tp-loading-text">Loading jobs...</p>
            ) : (
              <div className="tp-table-wrapper-feedback">
                {/* HEADER */}
                <div
                  className="tp-table-head-scroll"
                  ref={headerRef}
                  onScroll={handleHeaderScroll}
                >
                  <div className="tp-table-head tp-table-scheduler">
                    <span>Job Name</span>
                    <span className="text-center">Cron</span>
                    <span className="text-center">Status</span>
                    <span className="text-center">Timezone</span>
                    <span className="text-center">Actions</span>
                  </div>
                </div>

                {/* BODY */}
                <div
                  className="tp-table-body-scroll"
                  ref={bodyRef}
                  onScroll={handleBodyScroll}
                >
                  <div className="tp-table">
                    {loading ? (
                      <p className="tp-loading-text">Loading jobs...</p>
                    ) : jobs.length === 0 ? (
                      <div className="tp-empty">No jobs found</div>
                    ) : (
                      jobs.map((job) => (
                        <div
                          key={job.id}
                          className="tp-table-row tp-table-scheduler"
                        >
                          <div className="tp-text-strong">{job.jobName}</div>

                          <span className="text-center tp-mono">
                            {job.cronExpression}
                          </span>

                          <span className="text-center">
                            <span
                              className={`tp-pill ${
                                job.status === "ACTIVE"
                                  ? "tp-pill-success"
                                  : "tp-pill-danger"
                              }`}
                            >
                              {job.status}
                            </span>
                          </span>

                          <span className="text-center">{job.timezone}</span>

                          <span className="text-center">
                            <div className="tp-flex tp-actions">
                              <button
                                className="tp-btn-primary"
                                // onClick={() => handleTrigger(job.id)}
                              >
                                Trigger
                              </button>

                              <button
                                className="tp-btn-outline"
                                // onClick={() => handleManualSchedule(job)}
                              >
                                Manual Schedule
                              </button>
                            </div>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TradePulseCard>
      </div>
    </section>
  );
};

export default Scheduler;
