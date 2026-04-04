import { useEffect, useRef, useState } from "react";
import TradePulseCard from "../../components/common/TradePulseCard";
import { useToast } from "../../components/common/toast/ToastProvider";
import {
  GetSchedulerJobs,
  CreateSchedulerJob,
  TriggerSchedulerJob,
  UpdateSchedulerJob,
} from "../../services/DashboardService";
import Select from "react-select";

/* ===============================
   COMPONENT
================================ */
const Scheduler = () => {
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    jobName: "",
    executionPath: "",
    timezone: "UTC",
    status: "ACTIVE",
    parametersJson: "",
  });

  const [cronType, setCronType] = useState("daily");
  const [cronValue, setCronValue] = useState({
    minute: "0",
    hour: "3",
  });

  const { addToast } = useToast();
  /* ===============================
     FETCH ALL JOBS
  ================================ */
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await GetSchedulerJobs();

      setJobs(res || []);
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
        jobName: form.jobName,
        cronExpression: generateCron(),
        timezone: form.timezone,
        executionType: "DOCKER",
        executionPath: form.executionPath,
        parametersJson: form.parametersJson || "{}",
        status: form.status,
        maxRetries: 2,
      };

      await CreateSchedulerJob(payload);
      addToast("Job created successfully", "success");

      setForm({
        jobName: "",
        executionPath: "",
        timezone: "UTC",
        status: "ACTIVE",
        parametersJson: "",
      });

      setShowModal(false);

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
      await TriggerSchedulerJob(jobId);

      addToast("Job triggered successfully", "success");
    } catch (err) {
      console.error("Trigger failed", err);
      addToast("Trigger failed", "error");
    }
  };
  /* ===============================
     MANUAL SCHEDULE (UPDATE)
  ================================ */
  const handleManualSchedule = async (job) => {
    try {
      const updated = {
        ...job,
        cronExpression: "0 */10 * * * ?", // every 10 min
      };

      await UpdateSchedulerJob(job.id, updated);

      addToast("Schedule updated", "success");

      fetchJobs();
    } catch (err) {
      console.error("Update failed", err);
      addToast("Update failed", "error");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateCron = () => {
    if (cronType === "minutes") {
      return `0 */${cronValue.minute || 5} * * * ?`;
    }

    if (cronType === "hourly") {
      return "0 0 * * * ?";
    }

    if (cronType === "daily") {
      return `0 0 ${cronValue.hour || 3} * * ?`;
    }

    return "0 0 3 * * ?";
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
                onClick={() => setShowModal(true)}
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
                                Manual Trigger
                              </button>

                              <button
                                className="tp-btn-outline"
                                //  onClick={() => handleManualSchedule(job)}
                              >
                                Reschedule
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
      {showModal && (
        <div className="tp-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="tp-modal-header">
              <h3>Create Job</h3>
              <button
                className="tp-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="tp-modal-body">
              <div className="tp-form-grid">
                {/* Job Name */}
                <div className="tp-form-group">
                  <label>Job Name</label>
                  <input
                    className="tp-input"
                    type="text"
                    name="jobName"
                    value={form.jobName}
                    onChange={handleChange}
                    placeholder="Enter job name"
                  />
                </div>

                {/* Execution Path */}
                <div className="tp-form-group">
                  <label>Execution Path</label>
                  <input
                    className="tp-input"
                    type="text"
                    name="executionPath"
                    value={form.executionPath}
                    onChange={handleChange}
                    placeholder="Docker image path"
                  />
                </div>

                {/* Timezone */}
                <div className="tp-form-group">
                  <label>Timezone</label>
                  {/* <select
                    name="timezone"
                    value={form.timezone}
                    onChange={handleChange}
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                  </select> */}
                  <Select
                    classNamePrefix="tp-input"
                    name="timezone"
                    options={[
                      { value: "UTC", label: "UTC" },
                      { value: "Asia/Kolkata", label: "Asia/Kolkata" },
                    ]}
                    value={
                      [
                        { value: "UTC", label: "UTC" },
                        { value: "Asia/Kolkata", label: "Asia/Kolkata" },
                      ].find((opt) => opt.value === form.timezone) || null
                    }
                    onChange={(selectedOption) =>
                      setForm({
                        ...form,
                        timezone: selectedOption?.value || "",
                      })
                    }
                    placeholder="Select timezone"
                  />
                </div>

                {/* Status */}
                <div className="tp-form-group">
                  <label>Status</label>
                  {/* <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select> */}
                  <Select
                    classNamePrefix="tp-input"
                    name="status"
                    options={[
                      { value: "ACTIVE", label: "ACTIVE" },
                      { value: "INACTIVE", label: "INACTIVE" },
                    ]}
                    value={
                      [
                        { value: "ACTIVE", label: "ACTIVE" },
                        { value: "INACTIVE", label: "INACTIVE" },
                      ].find((opt) => opt.value === form.status) || null
                    }
                    onChange={(selectedOption) =>
                      setForm({
                        ...form,
                        status: selectedOption?.value || "",
                      })
                    }
                    placeholder="Select status"
                  />
                </div>

                <div className="tp-form-group full">
                  <label>Schedule</label>

                  <div className="tp-cron-box">
                    {/* TYPE SELECT */}
                    {/* <select
                      value={cronType}
                      onChange={(e) => setCronType(e.target.value)}
                    >
                      <option value="minutes">Every X Minutes</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                    </select> */}
                    <Select
                      classNamePrefix="tp-input"
                      value={
                        [
                          { value: "minutes", label: "Every X Minutes" },
                          { value: "hourly", label: "Hourly" },
                          { value: "daily", label: "Daily" },
                        ].find((opt) => opt.value === cronType) || null
                      }
                      onChange={(selectedOption) =>
                        setCronType(selectedOption?.value || "")
                      }
                      options={[
                        { value: "minutes", label: "Every X Minutes" },
                        { value: "hourly", label: "Hourly" },
                        { value: "daily", label: "Daily" },
                      ]}
                      placeholder="Select schedule type"
                    />

                    {/* CONDITIONAL INPUTS */}

                    {cronType === "minutes" && (
                      <input
                        className="tp-input"
                        type="number"
                        min="1"
                        placeholder="Minutes (e.g. 10)"
                        onChange={(e) =>
                          setCronValue({ minute: e.target.value })
                        }
                      />
                    )}

                    {cronType === "daily" && (
                      <input
                        className="tp-input"
                        type="number"
                        min="0"
                        max="23"
                        placeholder="Hour (0-23)"
                        onChange={(e) => setCronValue({ hour: e.target.value })}
                      />
                    )}

                    {cronType === "hourly" && (
                      <span className="tp-text-muted">Runs every hour</span>
                    )}
                  </div>
                </div>

                {/* Parameters JSON */}
                <div className="tp-form-group full">
                  <label>Parameters (JSON)</label>
                  <textarea
                    className="tp-input tp-textarea"
                    name="parametersJson"
                    value={form.parametersJson}
                    onChange={handleChange}
                    placeholder='{ "selector": "all" }'
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="tp-modal-footer">
              <button
                className="tp-btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="tp-btn-primary"
                // onClick={handleCreateJob}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Scheduler;
