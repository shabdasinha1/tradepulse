import { useRef, useState, useEffect } from "react";
import TradePulseCard from "../../components/common/TradePulseCard";
import {
  GetSuppliers,
  CreateSupplier,
  VerifySupplier,
  GetSupplierVerificationStatuses,
  GetDataSources,
} from "../../services/DashboardService";
import { FiX } from "react-icons/fi";

const SuppliersManagement = () => {
  /* ===============================
     MODAL STATE
  ================================ */
  const [openModal, setOpenModal] = useState(false);

  /* ===============================
     FORM STATE (UPDATED)
  ================================ */
  const [formData, setFormData] = useState({
    companyName: "",
    countryIso3: "",
    sector: "",
    verificationStatus: "PENDING",

    hsCodes: [],
    registrationNumber: "",
    dataSource: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verificationOptions, setVerificationOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [dataSources, setDataSources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [supplierRes, verificationRes, dataSourcesRes] =
          await Promise.all([
            GetSuppliers({ page: 0, size: 10 }),
            GetSupplierVerificationStatuses(),
            GetDataSources(),
          ]);

        setDataSources(dataSourcesRes?.data || dataSourcesRes || []);
        if (dataSourcesRes?.data?.length) {
  setFormData((prev) => ({
    ...prev,
    dataSource: dataSourcesRes.data[0], // ✅ default selected
  }));
}
        setSuppliers(supplierRes?.data?.content || supplierRes?.data || []);
        setVerificationOptions(verificationRes?.data || []);
      } catch (error) {
        console.error("Error fetching suppliers/meta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await GetSuppliers({
          page: 0,
          size: 10,
          query: search,
        });

        setSuppliers(res?.data?.content || res?.data || []);
      } catch (error) {
        console.error("Error searching suppliers:", error);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
      };
      console.log(payload);

      await CreateSupplier(payload);

      const res = await GetSuppliers({
        page: 0,
        size: 10,
      });

      setSuppliers(res?.data?.content || res?.data || []);
      setOpenModal(false);

      /* RESET UPDATED */
      setFormData({
  companyName: "",
  countryIso3: "",
  sector: "",
  verificationStatus: "PENDING",
  hsCodes: [],
  registrationNumber: "",
  dataSource: "",
});
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      await VerifySupplier(id);

      const res = await GetSuppliers({
        page: 0,
        size: 10,
      });

      setSuppliers(res?.data?.content || res?.data || []);
    } catch (error) {
      console.error("Error verifying supplier:", error);
    }
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

            <div className="tp-filter-btn-wrapper tp-flex tp-gap-sm">
              <input
                className="tp-input"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="tp-btn-primary"
                onClick={() => setOpenModal(true)}
              >
                Add Supplier
              </button>
            </div>
          </div>
        </header>

        <TradePulseCard
          header={
            <div className="tp-card-header">
              <h3 className="tp-card-title">Suppliers Data</h3>
            </div>
          }
        >
          <div className="tp-table-wrapper tp-supplier-table">
            <div className="tp-table-wrapper-feedback">
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
                        <div className="tp-flex tp-gap-sm tp-align-center tp-justify-center">
                          <span
                            className={`tp-pill ${
                              supplier.verificationStatus === "VERIFIED"
                                ? "tp-pill-success"
                                : "tp-pill-warning"
                            }`}
                          >
                            {supplier.verificationStatus}
                          </span>

                          {supplier.verificationStatus !== "VERIFIED" && (
                            <button
                              className="tp-btn-secondary tp-btn-sm"
                              onClick={() => handleVerify(supplier.id)}
                            >
                              Verify
                            </button>
                          )}
                        </div>
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
                >
                  <FiX />
                </button>
              </div>

              <form className="tp-form tp-form-grid" onSubmit={handleSubmit}>
                <div className="tp-form-group">
                  <label>Company Name</label>
                  <input
                    name="companyName"
                    className="tp-input"
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
                    value={formData.countryIso3}
                    onChange={handleChange}
                  />
                </div>

                <div className="tp-form-group">
                  <label>Sector</label>
                  <input
                    name="sector"
                    className="tp-input"
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
                    {verificationOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="tp-form-group">
                  <label>Data Source</label>
                 <select
  name="dataSource"
  className="tp-input tp-select"
  value={formData.dataSource}
  onChange={handleChange}
>
  <option value="">Select Data Source</option> {/* ✅ important */}

  {dataSources.map((ds) => (
    <option key={ds} value={ds}>
      {ds}
    </option>
  ))}
</select>
                </div>
                <div className="tp-form-group">
  <label>Registration Number</label>
  <input
    name="registrationNumber"
    className="tp-input"
    value={formData.registrationNumber}
    onChange={handleChange}
  />
</div>

                <div className="tp-form-group">
                  <label>HS Code</label>
                  <input
                    type="text"
                    name="hsCodes"
                    className="tp-input"
                    value={formData.hsCodes.join(",")}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hsCodes: e.target.value.split(","),
                      }))
                    }
                  />
                </div>

                {/* <div className="tp-form-group">
                  <label>Sanctions Score</label>
                  <input
                    type="number"
                    name="sanctionsScore"
                    className="tp-input"
                    value={formData.sanctionsScore}
                    onChange={handleChange}
                  />
                </div> */}

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
