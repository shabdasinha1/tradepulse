import { useRef, useState, useEffect } from "react";
import TradePulseCard from "../../components/common/TradePulseCard";
import Select from "react-select";
import {
  GetSuppliers,
  CreateSupplier,
  VerifySupplier,
  GetSupplierVerificationStatuses,
  GetDataSources,
  DeleteSuppliers,
} from "../../services/DashboardService";
import { FiX } from "react-icons/fi";
import axios from "axios";

const SuppliersManagement = () => {
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    supplierId: null,
    companyName: "",
  });
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

  const [loading, setLoading] = useState(false);
  const [verificationOptions, setVerificationOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [dataSources, setDataSources] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  const verificationSelectOptions = verificationOptions.map((status) => ({
    value: status,
    label: status,
  }));

  const dataSourceOptions = dataSources.map((ds) => ({
    value: ds,
    label: ds,
  }));

  const fetchSuppliers = async (pageNumber = 0, isSearch = false) => {
    try {
      setLoading(true);

      const res = await GetSuppliers({
        page: pageNumber,
        size: 10,
        query: search || undefined,
      });

      const newData = res?.data?.content || res?.data || [];

      setSuppliers((prev) => (isSearch ? newData : [...prev, ...newData]));

      setHasMore(newData.length === 10); // if less → no more pages
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuppliers(0, true);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [verificationRes, dataSourcesRes] =
          await Promise.all([
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
    const delayDebounce = setTimeout(() => {
      setPage(0);
      fetchSuppliers(0, true);
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
      await VerifySupplier(id, {
        verificationStatus: "VERIFIED",
      });

      setPage(0);
      fetchSuppliers(0, true);
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
  const lastRowRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSuppliers(nextPage);
      }
    });

    if (node) observer.current.observe(node);
  };
  const handleDelete = async (id) => {
    try {
      await DeleteSuppliers(id);

      setPage(0);
      fetchSuppliers(0, true);

      setDeleteModal({ open: false, supplierId: null, companyName: "" });
    } catch (error) {
      console.error("Error deleting supplier:", error);
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

            <div className="tp-filter-btn-wrapper tp-flex tp-gap-sm tp-supplier-header-btn">
              <input
                className="tp-input tp-supplier-header-input"
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
                <div className="tp-table-head tp-table-supplier-admin">
                  <span>Company</span>
                  <span className="text-center">Country</span>
                  <span className="text-center">Sector</span>
                  <span className="text-center">Verification</span>
                  <span className="text-center">Reliability Score</span>
                  <span className="text-center">Sanctions Score</span>
                  {/* <span className="text-center">LEI Code</span> */}
                  <span className="text-center">Actions</span>
                </div>
              </div>

              <div
                className="tp-table-body-scroll"
                ref={bodyRef}
                onScroll={handleBodyScroll}
              >
                <div className="tp-table">
                  {suppliers.map((supplier, index) => {
                    const isLast = suppliers.length === index + 1;

                    return (
                      <div
                        key={supplier.id}
                        ref={isLast ? lastRowRef : null}
                        className="tp-table-row tp-table-supplier-admin"
                      >
                        {/* Company */}
                        <div className="tp-text-strong">
                          {supplier.companyName}
                        </div>

                        {/* Country */}
                        <span className="text-center">
                          {supplier.countryIso3}
                        </span>

                        {/* Sector */}
                        <span className="text-center">{supplier.sector}</span>

                        {/* Verification */}
                        <span className="text-center">
                          <span
                            className={`tp-pill ${supplier.verificationStatus === "VERIFIED"
                                ? "tp-pill-success"
                                : supplier.verificationStatus === "PARTIAL"
                                  ? "tp-pill-warning"
                                  : "tp-pill-danger"
                              }`}
                          >
                            {supplier.verificationStatus}
                          </span>
                        </span>

                        {/* Reliability Score */}
                        <span className="text-center">
                          <span
                            className={`tp-pill ${supplier.reliabilityScore < 0.3
                                ? "tp-pill-danger"
                                : supplier.reliabilityScore < 0.5
                                  ? "tp-pill-warning"
                                  : "tp-pill-success"
                              }`}
                          >
                            {supplier.reliabilityScore}
                          </span>
                        </span>

                        {/* Sanctions */}
                        <span className="text-center">
                          <span
                            className={`tp-pill ${supplier.sanctionsFlag
                                ? "tp-pill-danger"
                                : "tp-pill-success"
                              }`}
                          >
                            {supplier.sanctionsFlag ? "Flagged" : "Clear"}
                          </span>
                        </span>

                        {/* LEI */}
                        {/* <span className="text-center">
                        {supplier.leiCode || "-"}
                      </span> */}

                        {/* ACTIONS */}
                        <span className="text-center">
                          <div className="tp-admin-actions">
                            {supplier.verificationStatus !== "VERIFIED" ? (
                              <button
                                className="tp-btn-primary tp-btn-sm"
                                onClick={() => handleVerify(supplier.id)}
                              >
                                Verify
                              </button>
                            ) : (
                              <button className="tp-btn-outline" disabled>
                                Verified
                              </button>
                            )}

                            <button
                              className="tp-btn-danger tp-btn-sm"
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  supplierId: supplier.id,
                                  companyName: supplier.companyName,
                                })
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </span>
                      </div>
                    );
                  })}
                </div>
                {loading && (
                  <div className="tp-loading-more">Loading more...</div>
                )}
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

              <form className="tp-form-grid" onSubmit={handleSubmit}>
                <div className="tp-form-group">
                  <label>Company Name</label>
                  <input
                    name="companyName"
                    className="tp-input"
                    placeholder="Enter company name (e.g. ABC Cocoa Ltd)"
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
                    placeholder="Enter ISO3 code (e.g. GHA, IND, USA)"
                    value={formData.countryIso3}
                    onChange={handleChange}
                  />
                </div>

                <div className="tp-form-group">
                  <label>Sector</label>
                  <input
                    name="sector"
                    className="tp-input"
                    placeholder="Enter sector (e.g. Agriculture, Manufacturing)"
                    value={formData.sector}
                    onChange={handleChange}
                  />
                </div>

                <div className="tp-form-group">
                  <label>Verification Status</label>
                  {/* Verification Status */}
                  {/* <select
                    name="verificationStatus"
                    className="tp-input tp-select"
                    value={formData.verificationStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select verification status</option>
                    {verificationOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    classNamePrefix="tp-select"
                    placeholder="Select verification status"
                    options={verificationSelectOptions}
                    value={
                      verificationSelectOptions.find(
                        (opt) => opt.value === formData.verificationStatus,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        verificationStatus: selectedOption?.value || "",
                      }))
                    }
                  />
                </div>
                <div className="tp-form-group">
                  <label>Data Source</label>
                  {/* <select
                    name="dataSource"
                    className="tp-input tp-select"
                    value={formData.dataSource}
                    onChange={handleChange}
                  >
                    <option value="">Select data source</option>
                    {dataSources.map((ds) => (
                      <option key={ds} value={ds}>
                        {ds}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    classNamePrefix="tp-select"
                    placeholder="Select data source"
                    options={dataSourceOptions}
                    value={
                      dataSourceOptions.find(
                        (opt) => opt.value === formData.dataSource,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataSource: selectedOption?.value || "",
                      }))
                    }
                  />
                </div>
                <div className="tp-form-group">
                  <label>Registration Number</label>
                  <input
                    name="registrationNumber"
                    className="tp-input"
                    placeholder="Enter registration number (e.g. GH12345)"
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
                    placeholder="Enter HS codes separated by commas (e.g. 1801, 0901)"
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
        {deleteModal.open && (
  <div className="tp-modal-overlay">
    <div className="tp-modal tp-delete-modal">
      <h3 className="tp-section-title">Confirm Delete</h3>

      <p className="tp-delete-text">
        Are you sure you want to delete{" "}
        <strong>{deleteModal.companyName}</strong>?
      </p>

      <div className="tp-delete-actions">
        <button
          className="tp-btn-outline"
          onClick={() =>
            setDeleteModal({
              open: false,
              supplierId: null,
              companyName: "",
            })
          }
        >
          No
        </button>

        <button
          className="tp-btn-danger"
          onClick={() => handleDelete(deleteModal.supplierId)}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </section>
  );
};

export default SuppliersManagement;
