import { useRef, useState } from "react";
import TradePulseCard from "../../components/common/TradePulseCard";
import { FiX } from "react-icons/fi";

const SuppliersManagement = () => {
  /* ===============================
     STATIC DATA (TEMP)
  ================================ */
  const suppliers = [
    {
      id: "1",
      companyName: "COCOA MARKETING COMPANY GHANA",
      countryIso3: "GHA",
      sector: "Agriculture",
      verificationStatus: "VERIFIED",
      reliabilityScore: 0.8,
    },
    {
      id: "2",
      companyName: "GLOBAL METALS LTD",
      countryIso3: "USA",
      sector: "Manufacturing",
      verificationStatus: "PENDING",
      reliabilityScore: 0.6,
    },
  ];

  /* ===============================
     MODAL STATE
  ================================ */
  const [openModal, setOpenModal] = useState(false);

  /* ===============================
     FORM STATE
  ================================ */
  const [formData, setFormData] = useState({
    id: "",
    companyName: "",
    countryIso3: "",
    sector: "",
    verificationStatus: "PENDING",
    reliabilityScore: "",
    sanctionsFlag: false,
    sanctionsMatchedName: "",
    sanctionsScore: "",
    sanctionsSource: "NONE",
    leiCode: "",
  });

  /* ===============================
     HANDLE CHANGE
  ================================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ===============================
     SUBMIT
  ================================ */
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      reliabilityScore: Number(formData.reliabilityScore),
      sanctionsScore: Number(formData.sanctionsScore),
    };

    console.log("SUPPLIER PAYLOAD:", payload);

    setOpenModal(false);
  };

  /* ===============================
     SCROLL SYNC
  ================================ */
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
                Suppliers <span>Management</span>
              </h1>

              <p className="tp-section-sub">
                Manage, verify, and monitor your global supplier network.
              </p>
            </div>

            <div className="tp-filter-btn-wrapper">
              <button
                className="tp-btn-primary"
                onClick={() => setOpenModal(true)}
              >
                Add Supplier
              </button>
            </div>
          </div>
        </header>

        {/* TABLE (UNCHANGED) */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <h3 className="tp-card-title">Suppliers Data</h3>
            </div>
          }
        >
          <div className="tp-table-wrapper tp-supplier-table">
            <div className="tp-table-wrapper-feedback">
              {/* HEADER */}
              <div
                className="tp-table-head-scroll"
                ref={headerRef}
                onScroll={handleHeaderScroll}
              >
                <div className="tp-table-head tp-table-supplier">
                  <span>Company</span>
                  <span className="text-center">Country</span>
                  <span className="text-center">Sector</span>
                  <span className="text-center">Verification</span>
                  <span className="text-center">Score</span>
                </div>
              </div>

              {/* BODY */}
              <div
                className="tp-table-body-scroll"
                ref={bodyRef}
                onScroll={handleBodyScroll}
              >
                <div className="tp-table">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="tp-table-row tp-table-supplier"
                    >
                      <div className="tp-text-strong">
                        {supplier.companyName}
                      </div>

                      <span className="text-center">
                        {supplier.countryIso3}
                      </span>

                      <span className="text-center">{supplier.sector}</span>

                      <span className="text-center">
                        <span
                          className={`tp-pill ${
                            supplier.verificationStatus === "VERIFIED"
                              ? "tp-pill-success"
                              : "tp-pill-warning"
                          }`}
                        >
                          {supplier.verificationStatus}
                        </span>
                      </span>

                      <span className="text-center">
                        {(supplier.reliabilityScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TradePulseCard>

        {/* ================= MODAL ================= */}
        {openModal && (
          <div className="tp-modal-overlay">
            <div className="tp-modal">
              <div className="tp-supplier-modal-header">
                <h3 className="tp-section-title tp-margin-bottom">
                  Add Supplier
                </h3>
                <button
                  className="tp-filter-close"
                  onClick={() => setOpenModal(false)}
                  aria-label="Close Filters"
                >
                  <FiX />
                </button>
              </div>

              <form className="tp-form tp-form-grid" onSubmit={handleSubmit}>
                {/* ROW 1 */}
                <div className="tp-form-group">
                  <label>Company Name</label>
                  <input
                    name="companyName"
                    className="tp-input"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="tp-form-group">
                  <label>Country ISO3</label>
                  <input
                    name="countryIso3"
                    className="tp-input"
                    placeholder="e.g. USA, IND"
                    value={formData.countryIso3}
                    onChange={handleChange}
                  />
                </div>

                {/* ROW 2 */}
                <div className="tp-form-group">
                  <label>Sector</label>
                  <input
                    name="sector"
                    className="tp-input"
                    placeholder="e.g. Agriculture"
                    value={formData.sector}
                    onChange={handleChange}
                  />
                </div>

                <div className="tp-form-group">
                  <label>Verification Status</label>
                  <select
                    name="verificationStatus"
                    className="tp-input tp-select"
                    value={formData.verificationStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select status</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {/* ROW 3 */}
                <div className="tp-form-group">
                  <label>Reliability Score</label>
                  <input
                    type="number"
                    step="0.1"
                    name="reliabilityScore"
                    className="tp-input"
                    placeholder="0.0 - 1.0"
                    value={formData.reliabilityScore}
                    onChange={handleChange}
                  />
                </div>

                <div className="tp-form-group">
                  <label>Sanctions Score</label>
                  <input
                    type="number"
                    name="sanctionsScore"
                    className="tp-input"
                    placeholder="Enter score"
                    value={formData.sanctionsScore}
                    onChange={handleChange}
                  />
                </div>

                {/* FULL WIDTH ROW */}
                <div className="tp-form-group tp-form-span-2">
                  <label>LEI Code</label>
                  <input
                    name="leiCode"
                    className="tp-input"
                    placeholder="Optional"
                    value={formData.leiCode}
                    onChange={handleChange}
                  />
                </div>

                {/* SWITCH (ALIGNED LIKE REGISTER CHECKBOX) */}
                <div className="tp-form-group tp-form-span-2 tp-privacy">
                  <label className="tp-privacy-label">
                    <input
                      type="checkbox"
                      name="sanctionsFlag"
                      checked={formData.sanctionsFlag}
                      onChange={handleChange}
                    />
                    <span>Sanctions Flag Enabled</span>
                  </label>
                </div>

                {/* ACTIONS */}
                <div className="tp-form-group tp-form-span-2 tp-actions">
                  <button type="submit" className="tp-btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuppliersManagement;
